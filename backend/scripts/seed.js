import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Book from '../models/Book.js';
import Order from '../models/Order.js';
import connectDB from '../config/db.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const sampleBooks = [
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    imageUrl: '/images/midnight_library.jpg',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    category: 'Fiction',
    price: 14.99,
    stock: 10,
    rating: 4.5,
    numReviews: 2,
    reviews: [
      {
        username: 'book_lover',
        rating: 5,
        comment: 'Beautifully written and thought-provoking. Highly recommend!',
        user: new mongoose.Types.ObjectId(), // Placeholders for review user relations
      },
      {
        username: 'reader_jane',
        rating: 4,
        comment: 'A very creative concept, though a bit slow in the middle.',
        user: new mongoose.Types.ObjectId(),
      }
    ]
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    imageUrl: '/images/dune.jpg',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the spice Melange.',
    category: 'Sci-Fi',
    price: 12.50,
    stock: 15,
    rating: 4.8,
    numReviews: 1,
    reviews: [
      {
        username: 'scifi_guy',
        rating: 5,
        comment: 'A masterpiece of world-building and science fiction.',
        user: new mongoose.Types.ObjectId(),
      }
    ]
  },
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    imageUrl: '/images/steve_jobs.jpg',
    description: 'Based on more than forty interviews with Steve Jobs conducted over two years—as well as interviews with more than a hundred family members, friends, adversaries, competitors, and colleagues.',
    category: 'Biography',
    price: 18.99,
    stock: 8,
    rating: 4.6,
    numReviews: 1,
    reviews: [
      {
        username: 'tech_enthusiast',
        rating: 5,
        comment: 'An incredibly detailed look at the life of a visionary leader.',
        user: new mongoose.Types.ObjectId(),
      }
    ]
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    imageUrl: '/images/clean_code.jpg',
    description: 'Even bad code can run. But if code isn’t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.',
    category: 'Technology',
    price: 35.00,
    stock: 12,
    rating: 4.9,
    numReviews: 1,
    reviews: [
      {
        username: 'coder_pro',
        rating: 5,
        comment: 'Essential reading for every software engineer. Transformative book.',
        user: new mongoose.Types.ObjectId(),
      }
    ]
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    imageUrl: '/images/atomic_habits.jpg',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world’s leading experts on habit formation, reveals practical strategies to form good habits.',
    category: 'Self-Help',
    price: 16.20,
    stock: 20,
    rating: 4.7,
    numReviews: 0,
    reviews: []
  },
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    imageUrl: '/images/zero_to_one.jpg',
    description: 'The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create. In Zero to One, legendary entrepreneur and investor Peter Thiel shows how we can find singular ways to create those new things.',
    category: 'Business',
    price: 15.00,
    stock: 5,
    rating: 4.4,
    numReviews: 0,
    reviews: []
  }
];

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Book.deleteMany();
    await Order.deleteMany();

    console.log('Database cleared.');

    // Add Users
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      isAdmin: true,
    });

    const standardUser = await User.create({
      username: 'customer',
      email: 'user@example.com',
      password: 'user123',
      isAdmin: false,
    });

    console.log('Default users created:');
    console.log('- Admin: admin@example.com / admin123');
    console.log('- Customer: user@example.com / user123');

    // Populate reviews with actual user references
    const populatedBooks = sampleBooks.map(book => {
      if (book.reviews && book.reviews.length > 0) {
        book.reviews = book.reviews.map(review => ({
          ...review,
          user: standardUser._id
        }));
      }
      return book;
    });

    // Add Books
    await Book.insertMany(populatedBooks);
    console.log(`${populatedBooks.length} Books seeded successfully.`);

    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
