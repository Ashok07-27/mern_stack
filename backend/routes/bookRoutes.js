import express from 'express';
import {
  getBooks,
  getBookById,
  createBookReview,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBooks)
  .post(protect, admin, createBook);

router.route('/:id')
  .get(getBookById)
  .put(protect, admin, updateBook)
  .delete(protect, admin, deleteBook);

router.route('/:id/reviews').post(protect, createBookReview);

export default router;
