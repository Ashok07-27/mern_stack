import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit, Check, ShieldAlert, BookOpen, CreditCard, ShoppingBag } from 'lucide-react';
import { API_URL } from '../context/AuthContext';

const Admin = () => {
  const { authFetch } = useAuth();
  const [activeTab, setActiveTab] = useState('books');

  // Book management states
  const [books, setBooks] = useState([]);
  const [bookLoading, setBookLoading] = useState(true);
  const [editBookId, setEditBookId] = useState(null);

  // Book Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Fiction');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Orders management states
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
    fetchOrders();
  }, []);

  const fetchBooks = async () => {
    setBookLoading(true);
    try {
      const res = await fetch(`${API_URL}/books`);
      const data = await res.json();
      if (res.ok) {
        setBooks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBookLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrderLoading(true);
    try {
      const res = await authFetch('/orders');
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOrderLoading(false);
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const bookData = {
      title,
      author,
      category,
      price: Number(price),
      stock: Number(stock),
      imageUrl: imageUrl || '/images/generic_book.jpg',
      description,
    };

    try {
      let res;
      if (editBookId) {
        // Edit existing book
        res = await authFetch(`/books/${editBookId}`, {
          method: 'PUT',
          body: JSON.stringify(bookData),
        });
      } else {
        // Add new book
        res = await authFetch('/books', {
          method: 'POST',
          body: JSON.stringify(bookData),
        });
      }

      const data = await res.json();

      if (res.ok) {
        setFormSuccess(editBookId ? 'Book updated successfully!' : 'Book added successfully!');
        resetBookForm();
        fetchBooks();
      } else {
        setFormError(data.message || 'Error processing book');
      }
    } catch (err) {
      setFormError(err.message || 'Failed to process book');
    }
  };

  const handleEditInit = (book) => {
    setEditBookId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setCategory(book.category);
    setPrice(book.price);
    setStock(book.stock);
    setImageUrl(book.imageUrl);
    setDescription(book.description);
    setFormError('');
    setFormSuccess('');
  };

  const resetBookForm = () => {
    setEditBookId(null);
    setTitle('');
    setAuthor('');
    setCategory('Fiction');
    setPrice(0);
    setStock(0);
    setImageUrl('');
    setDescription('');
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      const res = await authFetch(`/books/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchBooks();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete book');
    }
  };

  const handleDeliverOrder = async (id) => {
    try {
      const res = await authFetch(`/orders/${id}/deliver`, {
        method: 'PUT',
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayOrder = async (id) => {
    try {
      const res = await authFetch(`/orders/${id}/pay`, {
        method: 'PUT',
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container animate-fade-in">
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '2.2rem', marginBottom: '1.5rem' }}>
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('books')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.75rem 1rem',
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            color: activeTab === 'books' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'books' ? '2px solid var(--accent-secondary)' : 'none',
            cursor: 'pointer'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={18} /> Manage Books</span>
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.75rem 1rem',
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            color: activeTab === 'orders' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'orders' ? '2px solid var(--accent-secondary)' : 'none',
            cursor: 'pointer'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShoppingBag size={18} /> Manage Orders & Reserves</span>
        </button>
      </div>

      {activeTab === 'books' && (
        <div className="grid grid-cols-3" style={{ gap: '2rem', alignItems: 'start' }}>
          
          {/* Books List (Left 2 cols) */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '0.5rem' }}>Book Catalog</h3>
            
            {bookLoading ? <p>Loading books list...</p> : (
              <div className="glass-card" style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <th style={{ padding: '1rem' }}>Cover</th>
                      <th style={{ padding: '1rem' }}>Title & Author</th>
                      <th style={{ padding: '1rem' }}>Category</th>
                      <th style={{ padding: '1rem' }}>Price</th>
                      <th style={{ padding: '1rem' }}>Stock</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((b) => (
                      <tr key={b._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <img src={b.imageUrl} alt={b.title} style={{ width: '40px', height: '55px', objectFit: 'cover', borderRadius: '3px' }} />
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: '700' }}>{b.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.author}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-indigo">{b.category}</span></td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>${b.price.toFixed(2)}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{b.stock}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button onClick={() => handleEditInit(b)} className="btn-icon" style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer' }} title="Edit">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDeleteBook(b._id)} className="btn-icon" style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }} title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Add / Edit Form (Right 1 col) */}
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '1.25rem' }}>
              {editBookId ? 'Edit Book Details' : 'Add New Book'}
            </h3>

            {formError && <div className="badge badge-danger" style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem', justifyContent: 'center' }}>{formError}</div>}
            {formSuccess && <div className="badge badge-success" style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem', justifyContent: 'center' }}>{formSuccess}</div>}

            <form onSubmit={handleBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Book Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" required />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Author Name</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="form-input" required />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                  <label className="form-label">Price ($)</label>
                  <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                  <label className="form-label">Stock Qty</label>
                  <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className="form-input" required />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-input">
                  <option value="Fiction">Fiction</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Biography">Biography</option>
                  <option value="Technology">Technology</option>
                  <option value="Self-Help">Self-Help</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Image URL</label>
                <input type="text" placeholder="/images/dune.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="form-input" />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="form-input" required></textarea>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  Save Book
                </button>
                {editBookId && (
                  <button type="button" onClick={resetBookForm} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                    Cancel
                  </button>
                )}
              </div>

            </form>
          </div>

        </div>
      )}

      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '0.5rem' }}>Order Records</h3>
          
          {orderLoading ? <p>Loading order history...</p> : orders.length === 0 ? (
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders placed yet.</div>
          ) : (
            <div className="glass-card" style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '1rem' }}>Order ID</th>
                    <th style={{ padding: '1rem' }}>Customer</th>
                    <th style={{ padding: '1rem' }}>Book Item(s)</th>
                    <th style={{ padding: '1rem' }}>Type</th>
                    <th style={{ padding: '1rem' }}>Total Price</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Delivery</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                      <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>{o._id}</td>
                      <td style={{ padding: '1rem' }}>{o.user ? o.user.username : 'Deleted User'}</td>
                      <td style={{ padding: '1rem' }}>
                        {o.orderItems.map((itm) => (
                          <div key={itm._id} style={{ fontSize: '0.85rem' }}>
                            {itm.title} <span style={{ color: 'var(--text-muted)' }}>x {itm.qty}</span>
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {o.type === 'reservation' ? (
                          <span className="badge badge-cyan">Reservation</span>
                        ) : (
                          <span className="badge badge-indigo">Purchase</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: '600' }}>
                        {o.type === 'reservation' ? <span style={{ color: 'var(--success)' }}>Free</span> : `$${o.totalPrice.toFixed(2)}`}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {o.isPaid ? (
                          <span className="badge badge-success">Paid</span>
                        ) : (
                          <span className="badge badge-danger">Unpaid</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {o.isDelivered ? (
                          <span className="badge badge-success">Completed</span>
                        ) : (
                          <span className="badge badge-danger">Pending</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                          {!o.isPaid && (
                            <button onClick={() => handlePayOrder(o._id)} className="btn btn-outline btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', gap: '0.2rem' }}>
                              <Check size={12} /> Pay
                            </button>
                          )}
                          {!o.isDelivered && (
                            <button onClick={() => handleDeliverOrder(o._id)} className="btn btn-primary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', gap: '0.2rem' }}>
                              <Check size={12} /> Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
