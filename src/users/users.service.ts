import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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
    await this.validateEmail(createUserInput);

    const user = await this.userRepository.create({
      ...createUserInput,
    });

    return this.toModel(user);
  }

  private async validateEmail(createUserInput: CreateUserInput) {
    try {
      await this.userRepository.findOne({ email: createUserInput.email });
      throw new UnprocessableEntityException('Email already exists');
    } catch (err) {}
  }

  private toModel(userDocument: UserDocument): User {
    return {
      _id: userDocument._id.toString(),
      email: userDocument.email,
      name: userDocument.name,
    };
  }
}
