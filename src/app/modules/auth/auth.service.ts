import mongoose from 'mongoose';
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
  IUser,
} from './auth.interface';
import { User } from './auth.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

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

const loginUser = async (payload: IUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  // console.log(payload);

  const isUserExist = await User.isUserExist(email);
  // console.log('isisUserExist', isUserExist);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // match password
  if (
    isUserExist.password &&
    !(await User.isPasswordMatch(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'password is incorrect');
  }

  // create accessToken and refreshToken
  const { email: userEmail } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    {
      userEmail,
    },
    config.jwt.secret as Secret,
    config.jwt.expire_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    {
      userEmail,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expire_in as string,
  );

  // console.log({ accessToken, refreshToken, needsPasswordChange });

  return { accessToken, refreshToken };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userEmail } = verifiedToken;
  // console.log('verifiedToken', verifiedToken);

  const isUserExist = await User.isUserExist(userEmail);
  // console.log('isUserExist', isUserExist);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    { userEmail: isUserExist.email },
    config.jwt.secret as Secret,
    config.jwt.expire_in as string,
  );

  return { accessToken: newAccessToken };
};

export const AuthService = { createUser, loginUser, refreshToken };
