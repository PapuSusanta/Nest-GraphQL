import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../common/abstract.schema.js';

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
