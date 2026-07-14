import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const BookCard = ({ book }) => {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: '1rem' }}>
      
      {/* Cover image wrapper */}
      <div style={{ position: 'relative', paddingBottom: '140%', width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)' }}>
        <img 
          src={book.imageUrl} 
          alt={book.title} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
          className="book-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60';
          }}
        />
        <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
          <span className="badge badge-indigo">{book.category}</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, marginTop: '1rem', gap: '0.4rem' }}>
        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-primary)', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.8rem' }}>
          {book.title}
        </h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>By {book.author}</p>
        
        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', margin: '0.2rem 0' }}>
          <Star size={16} fill="var(--warning)" color="var(--warning)" />
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{book.rating.toFixed(1)}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({book.numReviews})</span>
        </div>

        {/* Purchase Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-secondary)' }}>
            ${book.price.toFixed(2)}
          </span>
          <Link to={`/books/${book._id}`} className="btn btn-outline btn-sm" style={{ padding: '0.3rem 0.8rem' }}>
            Details
          </Link>
        </div>

      </div>

    </div>
  );
};

export default BookCard;
