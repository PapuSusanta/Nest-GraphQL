import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserInput } from './contract/command/create-user-input.dto.js';
import { GetUserArgs } from './contract/query/get-user-args.dto.js';
import { UserRepository } from './users.repository.js';
import { User } from './models/user.model.js';
import { UserDocument } from './schema/user.schema.js';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(userArgs: GetUserArgs) {
    const user = await this.userRepository.findOne(userArgs);
    return this.toModel(user);
  }

  async createUser(createUserInput: CreateUserInput) {
    const email = createUserInput.email.trim().toLowerCase();
    await this.validateEmail(email);

    try {
      const user = await this.userRepository.create({
        ...createUserInput,
        email,
      });

      return this.toModel(user);
    } catch (error) {
      // The unique index is the final guard against simultaneous requests.
      if (this.isDuplicateKeyError(error)) {
        throw new UnprocessableEntityException('Email already exists');
      }

      throw error;
    }
  }

  private async validateEmail(email: string) {
    try {
      await this.userRepository.findOne({ email });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return;
      }

      throw error;
    }

    throw new UnprocessableEntityException('Email already exists');
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    );
  }

  private toModel(userDocument: UserDocument): User {
    return {
      _id: userDocument._id.toString(),
      email: userDocument.email,
      name: userDocument.name,
    };
  }
}
