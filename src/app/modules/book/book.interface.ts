import { Model } from 'mongoose';

export type IGenre =
  | 'Fiction'
  | 'Mystery'
  | 'Thriller'
  | 'Romance'
  | 'Science Fiction'
  | 'Fantasy'
  | 'Historical Fiction'
  | 'Horror'
  | 'Young Adult'
  | 'Biography'
  | 'Autobiography'
  | 'Memoir'
  | 'Self-help'
  | 'Business'
  | 'History'
  | 'Travel'
  | 'Science'
  | 'Philosophy'
  | 'Poetry'
  | "Children's";

export type IBook = {
  title: string;
  author: string;
  genre: IGenre;
  publicationDate: string;
  reviews?: string[];
  userEmail?: string;
};

export type BookModel = Model<IBook, Record<string, unknown>>;

export type IBookFilter = {
  searchTerm?: string;
  genre?: IGenre;
  publicationDate?: string;
};
