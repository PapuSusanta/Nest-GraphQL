import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../database/abstract.repository.js';
import { UserDocument } from './schema/user.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.model.js';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UserRepository.name);
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel);
  }
}
