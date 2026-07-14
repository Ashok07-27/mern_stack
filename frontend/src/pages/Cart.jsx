import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShieldAlert, ArrowRight, BookOpen, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Cart = ({ cart, updateQty, removeFromCart, clearCart }) => {
  const navigate = useNavigate();
  const { userInfo, authFetch } = useAuth();

  // Shipping details state (for purchases)
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  // Checkout states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Group items by type: purchases or reservations
  const purchaseItems = cart.filter(item => item.type === 'purchase');
  const reservationItems = cart.filter(item => item.type === 'reservation');

  const purchaseTotal = purchaseItems.reduce((acc, item) => acc + item.book.price * item.qty, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      navigate('/auth?redirect=/cart');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // We will place separate orders for purchase items and reservation items
      if (purchaseItems.length > 0) {
        if (!address || !city || !postalCode || !country) {
          throw new Error('Please fill in all shipping details for purchase items');
        }

        const res = await authFetch('/orders', {
          method: 'POST',
          body: JSON.stringify({
            orderItems: purchaseItems.map(item => ({
              title: item.book.title,
              qty: item.qty,
              imageUrl: item.book.imageUrl,
              price: item.book.price,
              book: item.book._id,
            })),
            shippingAddress: { address, city, postalCode, country },
            paymentMethod: 'Credit Card',
            totalPrice: purchaseTotal,
            type: 'purchase',
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to place purchase order');
        }
      }

      if (reservationItems.length > 0) {
        const res = await authFetch('/orders', {
          method: 'POST',
          body: JSON.stringify({
            orderItems: reservationItems.map(item => ({
              title: item.book.title,
              qty: item.qty,
              imageUrl: item.book.imageUrl,
              price: item.book.price,
              book: item.book._id,
            })),
            paymentMethod: 'Store Pickup',
            totalPrice: 0.0, // Reservations are free
            type: 'reservation',
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to reserve books');
        }
      }

      // Success
      setSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="glass-card" style={{ padding: '3rem 2rem', maxWidth: '600px', margin: '0 auto', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ color: 'var(--success)', fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Order Confirmed!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Thank you for your order. If you purchased books, they will be dispatched soon. If you reserved books, they will be kept aside for you at our store for up to 7 days.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to={userInfo.isAdmin ? "/admin" : "/dashboard"} className="btn btn-primary btn-sm">View My Dashboard</Link>
            <Link to="/" className="btn btn-outline btn-sm">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="glass-card" style={{ padding: '3rem 2rem', maxWidth: '600px', margin: '0 auto', borderRadius: 'var(--radius-lg)' }}>
          <ShieldAlert size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Browse our catalog to add books to your purchase or reservation list.</p>
          <Link to="/" className="btn btn-primary btn-sm">Explore Books</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '2.2rem', marginBottom: '2rem' }}>
        Shopping Cart
      </h1>

      <div className="grid grid-cols-3" style={{ gap: '2rem', alignItems: 'start' }}>
        
        {/* Cart Items list (Left 2 cols) */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Cart Table list */}
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cart.map((item) => (
                <div key={`${item.book._id}-${item.type}`} style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
                  
                  {/* Image */}
                  <img 
                    src={item.book.imageUrl} 
                    alt={item.book.title} 
                    style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60';
                    }}
                  />

                  {/* Title & Author */}
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>
                      <Link to={`/books/${item.book._id}`} style={{ color: 'var(--text-primary)' }}>{item.book.title}</Link>
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>By {item.book.author}</p>
                    
                    {/* Item type badge */}
                    <div style={{ marginTop: '0.3rem' }}>
                      {item.type === 'reservation' ? (
                        <span className="badge badge-cyan" style={{ gap: '0.2rem' }}><Calendar size={12} /> Reservation</span>
                      ) : (
                        <span className="badge badge-indigo" style={{ gap: '0.2rem' }}><CreditCard size={12} /> Purchase</span>
                      )}
                    </div>
                  </div>

                  {/* Qty Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <select 
                      value={item.qty} 
                      onChange={(e) => updateQty(item.book._id, item.type, Number(e.target.value))}
                      className="form-input"
                      style={{ width: '65px', padding: '0.3rem 0.5rem' }}
                    >
                      {[...Array(item.book.stock).keys()].slice(0, 10).map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div style={{ width: '80px', textAlign: 'right', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {item.type === 'reservation' ? (
                      <span style={{ color: 'var(--accent-secondary)' }}>Free Reserve</span>
                    ) : (
                      `$${(item.book.price * item.qty).toFixed(2)}`
                    )}
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={() => removeFromCart(item.book._id, item.type)}
                    className="btn-icon" 
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.3rem' }}
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Checkout panel (Right 1 col) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Summary
            </h3>

            {error && <div className="badge badge-danger" style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem', justifyContent: 'center' }}>{error}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>Purchase Items ({purchaseItems.length})</span>
                <span>${purchaseTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>Reserved Items ({reservationItems.length})</span>
                <span style={{ color: 'var(--success)' }}>Free</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.15rem', marginBottom: '1.5rem' }}>
              <span>Total Price</span>
              <span style={{ color: 'var(--accent-secondary)' }}>${purchaseTotal.toFixed(2)}</span>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Shipping address inputs (Only if there are items to purchase) */}
              {purchaseItems.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>Shipping Information</h4>
                  
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Address</label>
                    <input 
                      type="text" 
                      placeholder="123 Main St" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="form-input" 
                      required 
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">City</label>
                    <input 
                      type="text" 
                      placeholder="New York" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="form-input" 
                      required 
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                      <label className="form-label">ZIP Code</label>
                      <input 
                        type="text" 
                        placeholder="10001" 
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="form-input" 
                        required 
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                      <label className="form-label">Country</label>
                      <input 
                        type="text" 
                        placeholder="USA" 
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="form-input" 
                        required 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={loading}
              >
                {loading ? 'Processing...' : (userInfo ? 'Place Order' : 'Log In to Place Order')} <ArrowRight size={16} />
              </button>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
