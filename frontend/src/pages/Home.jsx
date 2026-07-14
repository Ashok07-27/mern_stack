import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import { Search } from 'lucide-react';
import { API_URL } from '../context/AuthContext';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState(['Fiction', 'Sci-Fi', 'Biography', 'Technology', 'Self-Help', 'Business']);

  useEffect(() => {
    fetchBooks();
  }, [search, selectedCategory]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let query = `${API_URL}/books?`;
      if (search) query += `keyword=${encodeURIComponent(search)}&`;
      if (selectedCategory) query += `category=${encodeURIComponent(selectedCategory)}&`;

      const res = await fetch(query);
      const data = await res.json();
      if (res.ok) {
        setBooks(data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      
      {/* Dynamic BG Glows */}
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>

      {/* Hero Banner Section */}
      <section className="glass-card" style={{ padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <span className="badge badge-indigo" style={{ marginBottom: '1rem' }}>MERN Stack Project Showcase</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--text-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome to BookStore
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Your one-stop destination for all things books! Whether you’re a passionate reader, someone who enjoys exploring new titles, or searching for the perfect gift, BookStore is here to make your journey easier and more exciting. With our vast collection covering every genre, author, and language, you’ll always find something that matches your taste.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Built using the powerful MERN Stack (MongoDB, Express.js, React, Node.js) to give you a smooth, fast, and reliable experience. You can browse books, read reviews, get personalized recommendations, and easily buy or reserve your favorites—all in just a few clicks!
          </p>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <div className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        
        {/* Search bar */}
        <div style={{ position: 'relative', flexGrow: 1, maxWidth: '400px', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search by title or author..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input" 
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Category tags */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setSelectedCategory('')}
            className={`btn btn-sm ${selectedCategory === '' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.35rem 0.85rem' }}
          >
            All Genres
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.35rem 0.85rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Book Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : books.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h3>No books found</h3>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Try adjusting your filters or search keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}

    </div>
  );
};

export default Home;
