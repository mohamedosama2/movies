import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from './_user.model';

export type AdminDocument = Admin & Document;

@Schema()
export class Admin {
  role: UserRole;

  @Prop({ required: true })
  bio: number;
}

const AdminSchema = SchemaFactory.createForClass(Admin);

export { AdminSchema };
