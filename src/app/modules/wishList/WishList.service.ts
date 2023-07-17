import mongoose from 'mongoose';
import { IWishList, IWishListFilter } from './wishList.interface';
import { WishList } from './wishList.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IBook } from '../book/book.interface';

const createWishList = async (
  wishList: IWishList,
  userEmail: string,
): Promise<IWishList | IBook | null> => {
  let newWishListData = null;

  // Start the transaction
  const session = await mongoose.startSession();
  console.log(userEmail);
  try {
    session.startTransaction();

    const newWishList = await WishList.create([wishList], { session });

    if (!newWishList.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create this WishList',
      );
    }

    newWishListData = newWishList[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newWishListData;
};

//* Get all wishList
const getAllWishList = async (filters: IWishListFilter) => {
  const { ...filtersData } = filters;

  const andCondition = [];

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await WishList.find(whereCondition).populate('book');

  return {
    data: result,
  };
};

export const WishListService = {
  createWishList,
  getAllWishList,
};
