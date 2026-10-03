import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractModel } from '../../common/abstract.model.js';

@ObjectType()
export class User extends AbstractModel {
  @Field()
  name: string;

  @Field()
  email: string;
}
