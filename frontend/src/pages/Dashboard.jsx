import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, ShoppingCart, Clock, Check, ShieldAlert } from 'lucide-react';

const Dashboard = () => {
  const { authFetch } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/orders/myorders');
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        setError(data.message || 'Failed to fetch order history');
      }
    } catch (err) {
      setError('Connection to backend failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="bg-glow glow-1"></div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
        My Dashboard
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Track your purchases, view active book reservations, and manage your account.
      </p>

      {loading ? <p>Loading your history...</p> : error ? (
        <div className="badge badge-danger" style={{ padding: '0.75rem', width: '100%', justifyContent: 'center' }}>{error}</div>
      ) : orders.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <ShieldAlert size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
          <h3>No Orders Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>You haven't made any purchases or reservations yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((o) => (
            <div key={o._id} className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order ID:</span>
                  <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', marginLeft: '0.3rem', color: 'var(--text-primary)', fontWeight: '600' }}>{o._id}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Placed on: <strong>{new Date(o.createdAt).toLocaleDateString()}</strong>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-3" style={{ gap: '1.5rem', alignItems: 'start' }}>
                
                {/* Book Items */}
                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {o.orderItems.map((itm) => (
                    <div key={itm._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img src={itm.imageUrl} alt={itm.title} style={{ width: '40px', height: '55px', objectFit: 'cover', borderRadius: '3px' }} />
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{itm.title}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quantity: {itm.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status card */}
                <div className="glass-card" style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '0.8rem', background: 'rgba(10,12,16,0.3)' }}>
                  
                  {/* Order Type */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Type:</span>
                    {o.type === 'reservation' ? (
                      <span className="badge badge-cyan" style={{ gap: '0.2rem' }}><Calendar size={12} /> Reservation</span>
                    ) : (
                      <span className="badge badge-indigo" style={{ gap: '0.2rem' }}><ShoppingCart size={12} /> Purchase</span>
                    )}
                  </div>

                  {/* Payment */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Payment:</span>
                    {o.isPaid ? (
                      <span className="badge badge-success" style={{ gap: '0.2rem' }}><Check size={12} /> Paid</span>
                    ) : (
                      <span className="badge badge-danger" style={{ gap: '0.2rem' }}><Clock size={12} /> Unpaid</span>
                    )}
                  </div>

                  {/* Delivery Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status:</span>
                    {o.isDelivered ? (
                      <span className="badge badge-success">Completed</span>
                    ) : (
                      <span className="badge badge-danger">Pending</span>
                    )}
                  </div>

                  {/* Reservation Expiry Info */}
                  {o.type === 'reservation' && o.reservationExpiry && (
                    <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Pickup before:</span>
                      <div style={{ color: 'var(--warning)', fontWeight: '600', marginTop: '0.1rem' }}>
                        {new Date(o.reservationExpiry).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {/* Total price for purchases */}
                  {o.type === 'purchase' && (
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                      <span>Total:</span>
                      <span style={{ color: 'var(--accent-secondary)' }}>${o.totalPrice.toFixed(2)}</span>
                    </div>
                  )}

                </div>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
