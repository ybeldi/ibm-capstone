import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Package, RotateCcw, Clock, CheckCircle2, XCircle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import BookCard from './BookCard';

export default function OrdersView() {
  const { orders, buyItAgain, cancelOrder, books, navigateTo } = useStore();
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  // Recommendations based on order history
  const orderRecommendations = books.filter((b) => b.isRecommended).slice(0, 3);

  return (
    <div className="orders-page-container">
      <div className="orders-header">
        <h1 className="orders-title">My Orders</h1>
        <p className="orders-subtitle">
          View your purchase history, track shipments, and re-order with 1-click <strong>Buy It Again</strong>.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders-box">
          <Package size={48} className="empty-pkg-icon" />
          <h3>No Orders Placed Yet</h3>
          <p>Browse our catalog and enjoy seamless delivery right to your door.</p>
          <button className="btn-primary mt-4" onClick={() => navigateTo('home')}>
            Explore Books
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((ord) => {
            const isCancelled = ord.status === 'Cancelled';
            const deadline = new Date(ord.cancellationDeadline).getTime();
            const isWithin48h = Date.now() < deadline;

            return (
              <div key={ord.id} className="order-history-card">
                {/* Order Summary Top Bar */}
                <div className="order-card-header">
                  <div className="header-meta-group">
                    <div>
                      <span className="meta-label">Order Placed</span>
                      <span className="meta-val">
                        {new Date(ord.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="meta-label">Total Amount</span>
                      <span className="meta-val">${Number(ord.totalAmount).toFixed(2)}</span>
                    </div>

                    <div>
                      <span className="meta-label">Ship To</span>
                      <span className="meta-val">{ord.deliveryAddress.split(',')[0]}</span>
                    </div>
                  </div>

                  <div className="header-status-group">
                    <span className="order-num-tag">#{ord.orderNumber}</span>
                    <span className={`status-pill ${ord.status.toLowerCase()}`}>
                      {ord.status === 'Confirmed' && <CheckCircle2 size={13} />}
                      {ord.status === 'Delivered' && <CheckCircle2 size={13} />}
                      {ord.status === 'Cancelled' && <XCircle size={13} />}
                      <span>{ord.status}</span>
                    </span>
                  </div>
                </div>

                {/* 48-Hour Cancellation Active Banner */}
                {!isCancelled && isWithin48h && (
                  <div className="order-cancellation-notice">
                    <div className="notice-left">
                      <Clock size={15} className="text-amber-400" />
                      <span>
                        48-Hour Guarantee: Eligible for full refund cancellation until{' '}
                        {new Date(ord.cancellationDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                      </span>
                    </div>
                    <button
                      className="cancel-btn-subtle"
                      onClick={() => setCancellingOrderId(ord.id)}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}

                {/* Order Items List */}
                <div className="order-items-container">
                  {ord.items.map((item) => {
                    const book = item.book || item;
                    return (
                      <div key={item.id || book.id} className="order-item-row">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="order-item-thumb"
                        />
                        <div className="order-item-info">
                          <h4
                            className="order-item-title"
                            onClick={() => navigateTo('product-detail', book.id)}
                          >
                            {book.title}
                          </h4>
                          <p className="order-item-author">by {book.author}</p>
                          <span className="order-item-format">{book.format} • Qty: {item.quantity}</span>
                          <span className="order-item-price">${Number(book.price).toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Actions Footer */}
                <div className="order-card-footer">
                  <div className="tracking-info">
                    {ord.trackingNumber && <span>Tracking: <code>{ord.trackingNumber}</code></span>}
                  </div>

                  {/* Buy It Again Button (Slide 5, 8, 10) */}
                  <div className="order-footer-buttons">
                    <button
                      className="buy-again-btn"
                      onClick={() => buyItAgain(ord.id)}
                      title="1-Click re-add all items to your cart"
                    >
                      <RotateCcw size={15} />
                      <span>Buy It Again</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recommended Based On Past Orders (Slide 5 & 8) */}
      <section className="order-recommendations-section">
        <div className="rec-header-row">
          <Sparkles size={18} className="text-amber-400" />
          <h2 className="rec-title">Recommended items based on Order History</h2>
        </div>
        <div className="rec-books-grid">
          {orderRecommendations.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Confirmation Modal for Order Cancellation */}
      {cancellingOrderId && (
        <div className="modal-overlay" onClick={() => setCancellingOrderId(null)}>
          <div className="cancel-confirm-box" onClick={(e) => e.stopPropagation()}>
            <ShieldAlert size={36} className="text-rose-500 mb-2" />
            <h3>Cancel This Order?</h3>
            <p>
              Your order is within the 48-hour free cancellation window. We will automatically refund your payment in full.
            </p>
            <div className="cancel-actions-row">
              <button
                className="btn-outline"
                onClick={() => setCancellingOrderId(null)}
              >
                No, Keep Order
              </button>
              <button
                className="btn-danger-confirm"
                onClick={() => {
                  cancelOrder(cancellingOrderId);
                  setCancellingOrderId(null);
                }}
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .orders-page-container {
          flex: 1;
          padding: 24px 32px;
          max-width: 1440px;
          margin: 0 auto;
          width: 100%;
        }
        .orders-header {
          margin-bottom: 28px;
        }
        .orders-title {
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
        }
        .orders-subtitle {
          font-size: 14px;
          color: #94a3b8;
        }
        .orders-subtitle strong {
          color: #60a5fa;
        }
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 48px;
        }
        .order-history-card {
          background: #14161d;
          border: 1px solid #1f232d;
          border-radius: 10px;
          overflow: hidden;
        }
        .order-card-header {
          background: #1b1e27;
          border-bottom: 1px solid #232733;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        @media (max-width: 680px) {
          .order-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
        .header-meta-group {
          display: flex;
          gap: 28px;
        }
        .meta-label {
          display: block;
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
        }
        .meta-val {
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
        }
        .header-status-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .order-num-tag {
          font-size: 13px;
          color: #94a3b8;
          font-family: monospace;
        }
        .status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 9999px;
        }
        .status-pill.confirmed {
          background: rgba(37, 99, 235, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(37, 99, 235, 0.3);
        }
        .status-pill.delivered {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .status-pill.cancelled {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .order-cancellation-notice {
          background: rgba(245, 158, 11, 0.08);
          border-bottom: 1px solid rgba(245, 158, 11, 0.2);
          padding: 8px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #fcd34d;
        }
        .notice-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cancel-btn-subtle {
          background: none;
          color: #f87171;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .cancel-btn-subtle:hover {
          text-decoration: underline;
        }
        .order-items-container {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .order-item-row {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .order-item-thumb {
          width: 55px;
          height: 75px;
          object-fit: cover;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.5);
        }
        .order-item-info {
          flex: 1;
        }
        .order-item-title {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
        }
        .order-item-title:hover {
          color: #3b82f6;
        }
        .order-item-author {
          font-size: 12px;
          color: #94a3b8;
        }
        .order-item-format {
          font-size: 11px;
          color: #64748b;
          display: block;
          margin-top: 2px;
        }
        .order-item-price {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
        }
        .order-card-footer {
          background: #101217;
          border-top: 1px solid #1e222c;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tracking-info {
          font-size: 12px;
          color: #64748b;
        }
        .tracking-info code {
          color: #94a3b8;
          background: #1b1e27;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .buy-again-btn {
          background-color: #2563eb;
          color: #ffffff;
          padding: 8px 18px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .buy-again-btn:hover {
          background-color: #1d4ed8;
        }
        .order-recommendations-section {
          background: #14161d;
          border: 1px solid #1f232d;
          border-radius: 12px;
          padding: 24px;
        }
        .rec-header-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid #1f232d;
          padding-bottom: 10px;
        }
        .rec-title {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }
        .rec-books-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .rec-books-grid {
            grid-template-columns: 1fr;
          }
        }
        .no-orders-box {
          text-align: center;
          padding: 60px 20px;
          background: #14161d;
          border-radius: 10px;
        }
        .empty-pkg-icon {
          color: #475569;
          margin-bottom: 12px;
        }
        .cancel-confirm-box {
          background: #1a1c24;
          border: 1px solid #292e3a;
          border-radius: 10px;
          padding: 24px;
          max-width: 440px;
          width: 100%;
          text-align: center;
        }
        .cancel-confirm-box h3 {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .cancel-confirm-box p {
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .cancel-actions-row {
          display: flex;
          justify-content: center;
          gap: 12px;
        }
        .btn-danger-confirm {
          background: #dc2626;
          color: #ffffff;
          padding: 8px 18px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
        }
        .btn-danger-confirm:hover {
          background: #b91c1c;
        }
      `}</style>
    </div>
  );
}
