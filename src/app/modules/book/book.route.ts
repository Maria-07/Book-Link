import express from 'express';
import { BookController } from './book.controller';

const router = express.Router();

// create a Book
router.post('/', BookController.createBook);

//get all Book
router.get('/', BookController.getAllBook);

// get a single book
router.get('/:id', BookController.getSingleBook);

//* Update a book
router.patch('/:id', BookController.updateBook);

//* delete a book
router.delete('/:id', BookController.deleteBook);

//* add a review
router.post('/review/:id', BookController.addReview);

//* get all review
router.get('/review/:id', BookController.getAllReview);

export const BookRoutes = router;
