import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../common/abstract.schema.js';

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
