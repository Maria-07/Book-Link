import mongoose from 'mongoose';
import { IBook } from './book.interface';
import { Book } from './book.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

// create a Book
const createBook = async (cow: IBook): Promise<IBook | null> => {
  let newCowAllData = null;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newCow = await Book.create([cow], { session });

    if (!newCow.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create a Book Profile',
      );
    }

    newCowAllData = newCow[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newCowAllData;
};

export const BookService = { createBook };
