import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { BookService } from './book.service';
import pick from '../../../shared/pick';
import { bookFilterableFields } from '../../../constance/filterableFields';
import { paginationFields } from '../../../constance/paginationC';
import { IBook } from './book.interface';

//* create a Book profile
const createBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...bookData } = req.body;
    const result = await BookService.createBook(bookData);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Book created successfully',
      data: result,
    });
  },
);

//* get all books
const getAllBook = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);
  // console.log('filters ==== ', filters);

  const paginationOption = pick(req.query, paginationFields);

  const result = await BookService.getAllBook(filters, paginationOption);

  sendResponse<IBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const BookController = { createBook, getAllBook };
