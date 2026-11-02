import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistView() {
  const { wishlist, toggleWishlist, books, addToCart, navigateTo } = useStore();

  const wishlistedBooks = books.filter((b) => wishlist.includes(b.id));

  return (
    <div className="wishlist-page-container">
      <div className="wishlist-header">
        <h1 className="wishlist-title">My Wishlist</h1>
        <p className="wishlist-subtitle">Books you saved for later reading adventures.</p>
      </div>

      {wishlistedBooks.length === 0 ? (
        <div className="wishlist-empty-box">
          <Heart size={48} className="empty-heart-icon" />
          <h3>Your Wishlist is Empty</h3>
          <p>Tap the bookmark or heart icon on any book to save it here.</p>
          <button className="btn-primary mt-4" onClick={() => navigateTo('home')}>
            Discover Books
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistedBooks.map((book) => (
            <div key={book.id} className="wishlist-item-card">
              <img
                src={book.coverImage}
                alt={book.title}
                className="wishlist-cover"
                onClick={() => navigateTo('product-detail', book.id)}
              />
              <div className="wishlist-info">
                <h4
                  className="wishlist-book-title"
                  onClick={() => navigateTo('product-detail', book.id)}
                >
                  {book.title}
                </h4>
                <p className="wishlist-author">by {book.author}</p>
                <div className="wishlist-price-tag">${Number(book.price).toFixed(2)}</div>
                <div className="wishlist-actions">
                  <button
                    className="btn-primary add-to-cart-sm"
                    onClick={() => {
                      addToCart(book);
                      toggleWishlist(book.id);
                    }}
                  >
                    <ShoppingBag size={14} />
                    <span>Move to Cart</span>
                  </button>
                  <button
                    className="remove-wish-btn"
                    onClick={() => toggleWishlist(book.id)}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .wishlist-page-container {
          flex: 1;
          padding: 24px 32px;
          max-width: 1440px;
          margin: 0 auto;
          width: 100%;
        }
        .wishlist-header {
          margin-bottom: 24px;
        }
        .wishlist-title {
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
        }
        .wishlist-subtitle {
          font-size: 14px;
          color: #94a3b8;
        }
        .wishlist-empty-box {
          text-align: center;
          padding: 80px 20px;
          background: #14161d;
          border-radius: 12px;
        }
        .empty-heart-icon {
          color: #475569;
          margin-bottom: 12px;
        }
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .wishlist-item-card {
          display: flex;
          gap: 16px;
          background: #14161d;
          border: 1px solid #1f232d;
          border-radius: 8px;
          padding: 16px;
        }
        .wishlist-cover {
          width: 80px;
          height: 110px;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
        }
        .wishlist-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .wishlist-book-title {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
          margin-bottom: 2px;
        }
        .wishlist-book-title:hover {
          color: #3b82f6;
        }
        .wishlist-author {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 6px;
        }
        .wishlist-price-tag {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 12px;
        }
        .wishlist-actions {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .add-to-cart-sm {
          padding: 6px 12px;
          font-size: 12px;
        }
        .remove-wish-btn {
          background: none;
          color: #64748b;
          padding: 6px;
          display: flex;
        }
        .remove-wish-btn:hover {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
}
