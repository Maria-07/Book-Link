import mongoose from 'mongoose';
import { IUser } from './auth.interface';
import { User } from './auth.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

// create a user through sign in
const createUser = async (user: IUser): Promise<IUser | null> => {
  let newUserAllData = null;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }

    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newUserAllData;
};

export const AuthService = { createUser };
