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

export const BookService = { createBook, getAllBook };
