import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Check, BookOpen, Clock, AlertCircle, ArrowRight } from 'lucide-react';

export default function ConfirmationView() {
  const { lastPlacedOrder, cancelOrder, navigateTo } = useStore();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [timeLeftString, setTimeLeftString] = useState('47h 59m remaining');

  // Order data fallback if opened directly
  const order = lastPlacedOrder || {
    id: 'ord-demo',
    orderNumber: 'BW-92841',
    date: new Date().toISOString(),
    status: 'Confirmed',
    cancellationDeadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    items: [
      {
        id: 'book-7',
        book: {
          id: 'book-7',
          title: 'Joy of Minimalism',
          author: 'Daniel Reed',
          synopsis: 'Declutter your life to uncover peace, clarity, and joy.',
          format: 'Paperback',
          tags: ['Non-fiction', 'Self Help'],
          price: 149,
          tentativeDelivery: 'Mon, 21 Jul',
          coverImage: '/covers/joy_of_minimalism_large_front.png'
        },
        quantity: 1,
        price: 149
      },
      {
        id: 'book-3',
        book: {
          id: 'book-3',
          title: 'The Path to Success',
          author: 'James Wright',
          synopsis: 'A practical guide to achieving goals with clarity and confidence.',
          format: 'Paperback',
          tags: ['Non-fiction', 'Self Help'],
          price: 359,
          tentativeDelivery: 'Mon, 21 Jul',
          coverImage: '/covers/path_to_success.png'
        },
        quantity: 1,
        price: 359
      }
    ],
    totalAmount: 470
  };

  const isCancelled = order.status === 'Cancelled';

  // Calculate 48h countdown
  useEffect(() => {
    const updateCountdown = () => {
      const deadline = new Date(order.cancellationDeadline).getTime();
      const now = Date.now();
      const diff = deadline - now;
      if (diff <= 0) {
        setTimeLeftString('Window Expired');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeftString(`${hours}h ${minutes}m remaining`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [order.cancellationDeadline]);

  const handleConfirmCancel = () => {
    cancelOrder(order.id, cancelReason || 'Changed my mind');
    setShowCancelModal(false);
  };

  return (
    <div className="confirmation-page-container">
      <div className="confirmation-card">
        {/* Animated Green Checkmark matching image15.png */}
        <div className={`status-badge-circle ${isCancelled ? 'cancelled' : 'success'}`}>
          {isCancelled ? <AlertCircle size={36} /> : <Check size={36} strokeWidth={3} />}
        </div>

        <h1 className="confirmation-headline">
          {isCancelled
            ? 'Order Cancelled (Full Refund Initiated)'
            : 'Your purchase of the following reads is successful'}
        </h1>

        <div className="order-metadata-row">
          <span>Order #{order.orderNumber}</span>
          <span className="dot-sep">•</span>
          <span>Paid ${Number(order.totalAmount).toFixed(2)}</span>
        </div>

        {/* 48 Hours Cancellation Banner (Slide 5, 8, 12) */}
        {!isCancelled && (
          <div className="cancellation-window-banner">
            <div className="window-info">
              <Clock size={16} className="text-amber-400" />
              <span>
                Risk-Free Guarantee: You can <strong>Cancel Order within 48 hrs</strong>
              </span>
              <span className="countdown-pill">{timeLeftString}</span>
            </div>
            <button
              className="cancel-order-trigger-btn"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Order
            </button>
          </div>
        )}

        {/* Purchased Books Cards Grid matching image15.png */}
        <div className="purchased-books-grid">
          {order.items.map((item) => {
            const book = item.book || item;
            return (
              <div key={item.id || book.id} className="purchased-book-card">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="purchased-cover"
                />
                <div className="purchased-info">
                  <h3 className="purchased-title">{book.title}</h3>
                  <p className="purchased-author">by <span className="author-name">{book.author}</span></p>

                  <p className="purchased-synopsis">{book.synopsis}</p>

                  <div className="purchased-format">{book.format}</div>

                  <div className="purchased-tags">
                    {book.tags && book.tags.slice(0, 2).map((t) => (
                      <span key={t} className="purchased-tag-pill">{t}</span>
                    ))}
                  </div>

                  <div className="purchased-price">${Number(book.price).toFixed(2)}</div>
                  <div className="purchased-delivery">
                    Delivery by <strong>{book.tentativeDelivery || 'Mon, 21 Jul'}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary Action Button matching image15.png */}
        <div className="confirmation-actions">
          <button
            className="btn-primary continue-shopping-btn"
            onClick={() => navigateTo('home')}
          >
            <span>Continue your Shopping</span>
            <BookOpen size={18} />
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigateTo('orders')}
          >
            <span>View All Orders</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="cancel-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="cancel-modal-title">Cancel Order #{order.orderNumber}</h3>
            <p className="cancel-modal-desc">
              Your order is within the 48-hour free cancellation window. If you cancel, your payment of
              <strong> ${Number(order.totalAmount).toFixed(2)}</strong> will be refunded to your original payment method immediately.
            </p>

            <div className="cancel-reason-group">
              <label>Reason for cancellation (Optional)</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="cancel-select"
              >
                <option value="Changed mind">Changed my mind</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Need different format">Need different format (eBook/Hardcover)</option>
                <option value="Found alternative">Found alternative title</option>
              </select>
            </div>

            <div className="cancel-modal-buttons">
              <button
                className="btn-outline"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Order
              </button>
              <button
                className="confirm-cancel-btn"
                onClick={handleConfirmCancel}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .confirmation-page-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
        .confirmation-card {
          background-color: #171920;
          border: 1px solid #232732;
          border-radius: 12px;
          padding: 48px;
          max-width: 820px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
        }
        .status-badge-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          margin-bottom: 20px;
        }
        .status-badge-circle.success {
          background-color: #10b981;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }
        .status-badge-circle.cancelled {
          background-color: #ef4444;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
        }
        .confirmation-headline {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          text-align: center;
          max-width: 540px;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .order-metadata-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 24px;
        }
        .dot-sep {
          color: #475569;
        }
        .cancellation-window-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.25);
          padding: 10px 18px;
          border-radius: 8px;
          margin-bottom: 28px;
        }
        @media (max-width: 600px) {
          .cancellation-window-banner {
            flex-direction: column;
            gap: 10px;
          }
        }
        .window-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #e2e8f0;
        }
        .countdown-pill {
          background: #252834;
          color: #f59e0b;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 9999px;
        }
        .cancel-order-trigger-btn {
          background: none;
          color: #f87171;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 4px 10px;
          border-radius: 4px;
        }
        .cancel-order-trigger-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }
        .purchased-books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          width: 100%;
          margin-bottom: 36px;
        }
        .purchased-book-card {
          display: flex;
          gap: 16px;
          background: #12141a;
          border: 1px solid #1f222b;
          border-radius: 8px;
          padding: 16px;
        }
        .purchased-cover {
          width: 100px;
          height: 140px;
          object-fit: cover;
          border-radius: 4px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.5);
          flex-shrink: 0;
        }
        .purchased-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .purchased-title {
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 2px;
        }
        .purchased-author {
          font-size: 11px;
          color: #94a3b8;
          margin-bottom: 4px;
        }
        .author-name {
          color: #60a5fa;
        }
        .purchased-synopsis {
          font-size: 11px;
          color: #94a3b8;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 4px;
        }
        .purchased-format {
          font-size: 10px;
          color: #cbd5e1;
          margin-bottom: 4px;
        }
        .purchased-tags {
          display: flex;
          gap: 4px;
          margin-bottom: 8px;
        }
        .purchased-tag-pill {
          font-size: 9px;
          background: #20242e;
          color: #94a3b8;
          padding: 1px 5px;
          border-radius: 3px;
        }
        .purchased-price {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
        }
        .purchased-delivery {
          font-size: 11px;
          color: #64748b;
        }
        .confirmation-actions {
          display: flex;
          gap: 16px;
        }
        .continue-shopping-btn {
          padding: 12px 32px;
          font-size: 15px;
        }
        .cancel-modal-content {
          background: #1c1f28;
          border: 1px solid #2d3342;
          border-radius: 10px;
          padding: 24px;
          max-width: 480px;
          width: 100%;
        }
        .cancel-modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .cancel-modal-desc {
          font-size: 13px;
          color: #94a3b8;
          line-height: 1.5;
          margin-bottom: 18px;
        }
        .cancel-reason-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 24px;
        }
        .cancel-reason-group label {
          font-size: 12px;
          color: #94a3b8;
        }
        .cancel-select {
          width: 100%;
        }
        .cancel-modal-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .confirm-cancel-btn {
          background-color: #dc2626;
          color: #ffffff;
          padding: 10px 18px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
        }
        .confirm-cancel-btn:hover {
          background-color: #b91c1c;
        }
      `}</style>
    </div>
  );
}
