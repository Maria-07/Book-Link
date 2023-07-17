import { Schema, model } from 'mongoose';
import { BookModel, IBook } from './book.interface';
import { Genre } from './book.constance';

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true, unique: true },
    genre: { type: String, enum: Genre, required: true },
    publicationDate: { type: String, required: true },
    publicationYear: { type: String },
    img: { type: String },
    userEmail: { type: String },
    reviews: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Book = model<IBook, BookModel>('Book', BookSchema);
