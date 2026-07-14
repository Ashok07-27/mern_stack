import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, Calendar, ShoppingCart, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../context/AuthContext';

const BookDetail = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo, authFetch } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/books/${id}`);
      const data = await res.json();
      if (res.ok) {
        setBook(data);
      } else {
        setError(data.message || 'Error loading book details');
      }
    } catch (err) {
      setError('Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (type) => {
    addToCart(book, Number(qty), type);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const res = await authFetch(`/books/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();

      if (res.ok) {
        setReviewSuccess('Review submitted successfully!');
        setComment('');
        setRating(5);
        fetchBookDetails(); // Refresh details to show new review
      } else {
        setReviewError(data.message || 'Error submitting review');
      }
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h3 className="text-danger">{error || 'Book not found'}</h3>
        <Link to="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={18} /> Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ position: 'relative' }}>
      
      {/* Back button */}
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: '500' }}>
        <ArrowLeft size={18} /> Back to Catalog
      </Link>

      <div className="grid grid-cols-2" style={{ gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Book cover image */}
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}>
          <img 
            src={book.imageUrl} 
            alt={book.title} 
            style={{ width: '100%', maxWidth: '380px', height: 'auto', borderRadius: 'var(--radius-sm)', objectFit: 'cover', boxShadow: 'var(--shadow-lg)' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60';
            }}
          />
        </div>

        {/* Book details block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>{book.category}</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: '800', lineHeight: '1.1' }}>{book.title}</h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>By <strong style={{ color: 'var(--text-primary)' }}>{book.author}</strong></p>
          </div>

          {/* Ratings & reviews count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Star size={20} fill="var(--warning)" color="var(--warning)" />
              <span style={{ fontSize: '1.05rem', fontWeight: '700' }}>{book.rating.toFixed(1)}</span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{book.numReviews} User Reviews</span>
          </div>

          {/* Price & Stock info */}
          <div className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Price</span>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-secondary)', fontWeight: '800' }}>${book.price.toFixed(2)}</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Availability</span>
              <div style={{ marginTop: '0.2rem' }}>
                {book.stock > 0 ? (
                  <span className="badge badge-success">In Stock ({book.stock} left)</span>
                ) : (
                  <span className="badge badge-danger">Out of Stock</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {book.stock > 0 && (
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Quantity Select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="form-label" style={{ margin: 0 }}>Quantity</span>
                <select 
                  value={qty} 
                  onChange={(e) => setQty(e.target.value)}
                  className="form-input"
                  style={{ width: '80px', padding: '0.4rem 0.6rem' }}
                >
                  {[...Array(book.stock).keys()].slice(0, 10).map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                
                {/* Buy / Purchase button */}
                <button 
                  onClick={() => handleAddToCart('purchase')}
                  className="btn btn-primary"
                  style={{ flexGrow: 1, justifyContent: 'center' }}
                >
                  <ShoppingCart size={18} /> Buy Now
                </button>

                {/* Reserve button */}
                <button 
                  onClick={() => handleAddToCart('reservation')}
                  className="btn btn-secondary"
                  style={{ flexGrow: 1, justifyContent: 'center' }}
                >
                  <Calendar size={18} /> Reserve for 7 Days
                </button>

              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center' }}>
                * Reservations are free. Keep the book reserved for up to 7 days before pickup.
              </p>

            </div>
          )}

          {/* Description */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: '600', marginBottom: '0.5rem' }}>Description</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{book.description}</p>
          </div>

        </div>

      </div>

      {/* Reviews Section */}
      <section style={{ marginTop: '3.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Customer Reviews
        </h3>

        <div className="grid grid-cols-2" style={{ gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {book.reviews.length === 0 ? (
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No reviews yet. Be the first to write a review!
              </div>
            ) : (
              book.reviews.map((rev) => (
                <div key={rev._id} className="glass-card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{rev.username}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.5rem' }}>
                    {[...Array(5).keys()].map((star) => (
                      <Star 
                        key={star} 
                        size={14} 
                        fill={star < rev.rating ? "var(--warning)" : "none"} 
                        color={star < rev.rating ? "var(--warning)" : "var(--text-muted)"} 
                      />
                    ))}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Review Form */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: '600', marginBottom: '1rem' }}>Write a Customer Review</h4>
            
            {userInfo ? (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {reviewSuccess && <div className="badge badge-success" style={{ padding: '0.5rem', width: '100%', justifyContent: 'center' }}>{reviewSuccess}</div>}
                {reviewError && <div className="badge badge-danger" style={{ padding: '0.5rem', width: '100%', justifyContent: 'center' }}>{reviewError}</div>}

                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="form-input"
                    style={{ width: '100px' }}
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Comment</label>
                  <textarea 
                    rows="3" 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="form-input" 
                    placeholder="Describe your experience with this book..."
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm"
                  disabled={reviewLoading}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>

              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', padding: '1rem', textAlign: 'center' }}>
                <ShieldAlert size={28} style={{ color: 'var(--warning)' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Please log in to submit a review.</p>
                <Link to="/auth" className="btn btn-outline btn-sm">Log In</Link>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};

export default BookDetail;
