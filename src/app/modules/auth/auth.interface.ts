import { Model } from 'mongoose';

/* eslint-disable no-unused-vars */
export type IUser = {
  email: string;
  password: string;
};

export type UserModel = {
  isUserExist(email: string): Promise<Pick<IUser, 'email'>>;
  isPasswordMatch(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;
