import { Schema, Types, model } from 'mongoose';
import { IWishList, WishListModel } from './wishList.interface';
import { status } from './wish.constance';

const WishListSchema: Schema<IWishList> = new Schema<IWishList>(
  {
    book: { type: Types.ObjectId, ref: 'Book' },
    userEmail: { type: String },
    status: { type: String, enum: status },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const WishList = model<IWishList, WishListModel>(
  'WishList',
  WishListSchema,
);
