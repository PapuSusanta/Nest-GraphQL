import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { User } from './models/user.model.js';
import { UsersService } from './users.service.js';
import { CreateUserInput } from './contract/command/create-user-input.dto.js';
import { GetUserArgs } from './contract/query/get-user-args.dto.js';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  @Query(() => User, { name: 'user' })
  async getUser(@Args() userArgs: GetUserArgs) {
    return this.userService.getUser(userArgs);
  }
}
