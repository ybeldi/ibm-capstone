import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Star, Heart } from 'lucide-react';

export default function BookCard({ book }) {
  const { navigateTo, addToCart, wishlist, toggleWishlist } = useStore();
  const isWishlisted = wishlist.includes(book.id);

  return (
    <div className="book-card">
      {/* Cover Column */}
      <div
        className="cover-container"
        onClick={() => navigateTo('product-detail', book.id)}
      >
        <img
          src={book.coverImage}
          alt={book.title}
          className="book-cover-img"
          loading="lazy"
        />
        <button
          className={`wishlist-quick-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(book.id);
          }}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={14} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : '#ffffff'} />
        </button>
      </div>

      {/* Details Column matching wireframe image7 */}
      <div className="book-details">
        <h4
          className="book-title"
          onClick={() => navigateTo('product-detail', book.id)}
        >
          {book.title}
        </h4>
        <p className="book-author">by <span className="author-name">{book.author}</span></p>

        <p className="book-synopsis">{book.synopsis}</p>

        <div className="book-format-tag">
          <span className="format-text">{book.format}</span>
        </div>

        <div className="book-tags-row">
          {book.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>

        <div className="price-and-action-row">
          <div>
            <div className="book-price">${book.price.toFixed(2)}</div>
            <div className="delivery-info">Delivery by <strong>{book.tentativeDelivery}</strong></div>
          </div>

          <button
            className="add-to-cart-quick"
            onClick={() => addToCart(book)}
            title="Add to Basket"
          >
            <ShoppingCart size={15} />
            <span>Add</span>
          </button>
        </div>
      </div>

      <style>{`
        .book-card {
          display: flex;
          gap: 14px;
          background-color: transparent;
          border-radius: 8px;
          padding: 8px;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .book-card:hover {
          background-color: #181b22;
          transform: translateY(-2px);
        }
        .cover-container {
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
          width: 108px;
          height: 140px;
          border-radius: 4px;
          overflow: hidden;
          background-color: #121418;
          box-shadow: 0 4px 8px rgba(0,0,0,0.5);
        }
        .book-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.25s ease;
        }
        .cover-container:hover .book-cover-img {
          transform: scale(1.03);
        }
        .wishlist-quick-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          border: none;
          border-radius: 50%;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .book-card:hover .wishlist-quick-btn {
          opacity: 1;
        }
        .wishlist-quick-btn.active {
          opacity: 1;
        }
        .book-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .book-title {
          font-size: 15px;
          font-weight: 600;
          color: #f8fafc;
          cursor: pointer;
          line-height: 1.3;
          margin-bottom: 2px;
        }
        .book-title:hover {
          color: #3b82f6;
        }
        .book-author {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 6px;
        }
        .author-name {
          color: #60a5fa;
          font-weight: 500;
        }
        .book-synopsis {
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 6px;
        }
        .book-format-tag {
          font-size: 11px;
          color: #cbd5e1;
          margin-bottom: 4px;
        }
        .format-text {
          font-weight: 500;
        }
        .book-tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 10px;
        }
        .tag-pill {
          font-size: 10px;
          color: #94a3b8;
          background-color: #242833;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .price-and-action-row {
          margin-top: auto;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        .book-price {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
        }
        .delivery-info {
          font-size: 11px;
          color: #64748b;
        }
        .delivery-info strong {
          color: #94a3b8;
        }
        .add-to-cart-quick {
          background-color: #1e222b;
          border: 1px solid #2e3442;
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .add-to-cart-quick:hover {
          background-color: #2563eb;
          border-color: #2563eb;
        }
      `}</style>
    </div>
  );
}
