/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './auth.interface';
import bcrypt, { hash } from 'bcrypt';
import config from '../../../config';

const UserSchema: Schema<IUser, UserModel> = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

UserSchema.statics.isUserExist = async function (
  email: string,
): Promise<Pick<IUser, 'email' | 'password'> | null> {
  return await User.findOne({ email }, { _id: 1, email: 1, password: 1 });
};

UserSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

UserSchema.pre('save', async function (next) {
  const user = this;
  //hash password
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  console.log('password  and Hash 💡', this.password, hash);

  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
