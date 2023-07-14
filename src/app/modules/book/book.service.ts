import mongoose, { SortOrder } from 'mongoose';
import { IBook, IBookFilter } from './book.interface';
import { Book } from './book.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  IGenericResponse,
  IPaginationOption,
} from '../../../interfaces/pagination';
import { bookFilterableFields } from '../../../constance/filterableFields';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

//* create a Book
const createBook = async (cow: IBook): Promise<IBook | null> => {
  let newCowAllData = null;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newBook = await Book.create([cow], { session });

    if (!newBook.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create a Book Profile',
      );
    }

    newCowAllData = newBook[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newCowAllData;
};

//* Get all Book
const getAllBook = async (
  filters: IBookFilter,
  paginationOption: IPaginationOption,
): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: bookFilterableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculationPagination(paginationOption);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Book.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

//* get single Book
const getSingleBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findById(id);
  return result;
};

//* Update a book

const updateBook = async (
  id: string,
  payload: Partial<IBook>,
  token: string,
): Promise<IBook | null> => {
  // console.log(id, payload);
  console.log('Token => 🔖🔖', token);

  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token as string,
      config.jwt.secret as Secret,
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  console.log('verifiedToken =======', verifiedToken);

  const { userEmail } = verifiedToken;
  // console.log('Email 📩', email);

  const bookDetails = await Book.findById(id);
  // console.log('bookDetails 📕', cowDetails);

  if (!bookDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This Book is invalid');
  }

  if (!userEmail) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'user UNAUTHORIZED');
  }

  const result = await Book.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  // console.log(result, 'updated result');
  return result;
};

export const BookService = {
  createBook,
  getAllBook,
  getSingleBook,
  updateBook,
};
