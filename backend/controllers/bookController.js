import Book from '../models/Book.js';

// @desc    Fetch all books (with optional category & search filter)
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { author: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const books = await Book.find({ ...keyword, ...category });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/books/:id/reviews
// @access  Private
const createBookReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      const alreadyReviewed = book.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Book already reviewed' });
      }

      const review = {
        username: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      book.reviews.push(review);
      book.numReviews = book.reviews.length;
      book.rating =
        book.reviews.reduce((acc, item) => item.rating + acc, 0) /
        book.reviews.length;

      await book.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a book (Admin)
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res) => {
  const { title, author, price, description, category, imageUrl, stock } = req.body;

  try {
    const book = new Book({
      title,
      author,
      price,
      description,
      category,
      imageUrl,
      stock,
      rating: 0,
      numReviews: 0,
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a book (Admin)
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res) => {
  const { title, author, price, description, category, imageUrl, stock } = req.body;

  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      book.title = title || book.title;
      book.author = author || book.author;
      book.price = price !== undefined ? price : book.price;
      book.description = description || book.description;
      book.category = category || book.category;
      book.imageUrl = imageUrl || book.imageUrl;
      book.stock = stock !== undefined ? stock : book.stock;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a book (Admin)
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      await Book.deleteOne({ _id: req.params.id });
      res.json({ message: 'Book removed successfully' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getBooks,
  getBookById,
  createBookReview,
  createBook,
  updateBook,
  deleteBook,
};
