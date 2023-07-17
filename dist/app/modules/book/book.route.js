'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.BookRoutes = void 0;
const express_1 = __importDefault(require('express'));
const book_controller_1 = require('./book.controller');
const router = express_1.default.Router();
// create a Book
router.post('/', book_controller_1.BookController.createBook);
//get all Book
router.get('/', book_controller_1.BookController.getAllBook);
//get all Book by years
router.get('/years', book_controller_1.BookController.getAllBookByYear);
// get a single book
router.get('/:id', book_controller_1.BookController.getSingleBook);
//* Update a book
router.patch('/:id', book_controller_1.BookController.updateBook);
//* delete a book
router.delete('/:id', book_controller_1.BookController.deleteBook);
//* add a review
router.post('/review/:id', book_controller_1.BookController.addReview);
//* get all review
router.get('/review/:id', book_controller_1.BookController.getAllReview);
exports.BookRoutes = router;
