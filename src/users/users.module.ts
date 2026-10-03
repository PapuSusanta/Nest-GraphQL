import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver.js';
import { UsersService } from './users.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './models/user.model.js';
import { UserSchema } from './schema/user.schema.js';
import { UserRepository } from './users.repository.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersResolver, UsersService, UserRepository],
})
export class UsersModule {}
