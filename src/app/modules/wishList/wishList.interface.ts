import { Model, Types } from 'mongoose';
import { IBook } from '../book/book.interface';
import { IUser } from '../auth/auth.interface';

export type IStatus = 'reading' | 'plan to read' | 'finished';

export type IWishList = {
  book: Types.ObjectId | IBook;
  user: Types.ObjectId | IUser;
  status: IStatus;
};

export type WishListModel = Model<IWishList, Record<string, unknown>>;

export type IWishListFilter = {
  searchTerm?: string;
  status?: IStatus;
};
