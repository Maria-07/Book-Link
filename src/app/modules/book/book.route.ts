import express from 'express';
import { BookController } from './book.controller';

const router = express.Router();

// create a Book
router.post('/', BookController.createBook);

//get all Book
router.get('/', BookController.getAllBook);

// get a single book
// router.get(
//   '/:id',

//   BookController.getSingleBook,
// );

export const BookRoutes = router;
