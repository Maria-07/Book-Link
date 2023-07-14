import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { wishListFilterableFields } from '../../../constance/filterableFields';
import { WishListService } from './WishList.service';

// create WishList
const createWishList: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...wishList } = req.body;
    // console.log('order pro', order);

    const result = await WishListService.createWishList(wishList);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'WishList created successfully',
      data: result,
    });
  },
);

//* get all wishList
const getAllWishList = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, wishListFilterableFields);
  // console.log('filters ==== ', filters);

  const result = await WishListService.getAllWishList(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'WishList retrieved successfully',
    data: result.data,
  });
});

export const wishListController = {
  createWishList,
  getAllWishList,
};
