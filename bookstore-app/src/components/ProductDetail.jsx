import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Bookmark, Star, ArrowLeft, Send, Check } from 'lucide-react';

export default function ProductDetail() {
  const {
    selectedBookId,
    books,
    navigateTo,
    addToCart,
    wishlist,
    toggleWishlist,
    reviews,
    addReview
  } = useStore();

  const book = books.find((b) => b.id === selectedBookId) || books[0];
  const bookReviews = reviews[book.id] || [];
  const isWishlisted = wishlist.includes(book.id);

  // Active cover view tab: 'front' | 'back'
  const [activeCoverView, setActiveCoverView] = useState('front');

  // Review form state
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Related reads: other books in same category or recommended books
  const relatedReads = books
    .filter((b) => b.id !== book.id)
    .slice(0, 3);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    addReview(book.id, {
      rating: newReviewRating,
      comment: newReviewText.trim()
    });

    setNewReviewText('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="detail-page-container">
      {/* Breadcrumbs matching image11.png */}
      <div className="detail-breadcrumbs">
        <button className="back-crumb-btn" onClick={() => navigateTo('home')}>
          <ArrowLeft size={14} />
          <span>Home</span>
        </button>
        <span className="crumb-sep">/</span>
        <span>{book.tags[0] || 'Non-Fiction'}</span>
        <span className="crumb-sep">/</span>
        <span>{book.category}</span>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">{book.title}</span>
      </div>

      <div className="detail-main-layout">
        {/* Left / Center Main Area */}
        <div className="detail-primary-content">
          {/* Top Section: Covers and Book Metadata */}
          <div className="detail-hero-grid">
            {/* Book Covers Preview (Front & Back) */}
            <div className="covers-preview-section">
              <div className="covers-display-row">
                <div className={`cover-box ${activeCoverView === 'front' ? 'active-cover' : ''}`}>
                  <img
                    src={book.coverImage}
                    alt={`${book.title} Front Cover`}
                    className="book-detail-cover"
                  />
                  <span className="cover-label">Front Cover</span>
                </div>

                {book.backCoverImage && (
                  <div className={`cover-box ${activeCoverView === 'back' ? 'active-cover' : ''}`}>
                    <img
                      src={book.backCoverImage}
                      alt={`${book.title} Back Cover`}
                      className="book-detail-cover"
                    />
                    <span className="cover-label">Back Cover</span>
                  </div>
                )}
              </div>
            </div>

            {/* Book Meta & Buy Actions */}
            <div className="book-meta-column">
              <h1 className="detail-book-title">{book.title}</h1>
              <p className="detail-book-author">by <span className="author-highlight">{book.author}</span></p>

              <p className="detail-synopsis-quote">“{book.synopsis}”</p>

              <div className="publisher-row">
                <span className="pub-label">Published by:</span>
                <span className="pub-name">{book.publisher}</span>
              </div>

              <div className="format-info">
                <span className="format-badge-large">{book.format}</span>
              </div>

              <div className="tags-row-detail">
                {book.tags.map((tag) => (
                  <span key={tag} className="detail-tag-pill">{tag}</span>
                ))}
              </div>

              <div className="price-detail-row">
                <span className="currency-symbol">$</span>
                <span className="price-big">{book.price.toFixed(2)}</span>
                {book.mrp > book.price && (
                  <span className="mrp-strikethrough">${book.mrp.toFixed(2)}</span>
                )}
              </div>

              <div className="delivery-detail-tag">
                Delivery by <strong>{book.tentativeDelivery}</strong>
              </div>

              {/* Action Buttons matching wireframe image11 */}
              <div className="detail-action-buttons">
                <button
                  className="btn-primary detail-cart-btn"
                  onClick={() => addToCart(book)}
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>

                <button
                  className={`btn-secondary detail-wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
                  onClick={() => toggleWishlist(book.id)}
                >
                  <Bookmark size={18} fill={isWishlisted ? '#f59e0b' : 'none'} />
                  <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Stats Row matching wireframe */}
              <div className="detail-stats-bar">
                <div className="stat-item">
                  <span className="stat-label">Language</span>
                  <span className="stat-value">{book.language}</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <span className="stat-label">Rating</span>
                  <div className="stars-row">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i <= Math.round(book.rating) ? '#f59e0b' : '#334155'}
                        color={i <= Math.round(book.rating) ? '#f59e0b' : '#334155'}
                      />
                    ))}
                  </div>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <span className="stat-label">Sells</span>
                  <span className="stat-value">{book.copiesSold} copies sold</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: About the Writer matching image11.png */}
          <section className="about-writer-card">
            <h3 className="section-heading">About the writer</h3>
            <div className="writer-profile">
              <div className="writer-avatar-wrapper">
                <img
                  src={book.authorAvatar}
                  alt={book.author}
                  className="writer-avatar"
                />
              </div>
              <div className="writer-info">
                <h4 className="writer-name">{book.author}</h4>
                <p className="writer-bio">{book.authorBio}</p>
              </div>
            </div>
          </section>

          {/* Section: Reviews matching image11.png */}
          <section className="reviews-section">
            <h3 className="section-heading">Reviews</h3>

            <div className="reviews-layout">
              {/* Review Input Box */}
              <div className="leave-review-card">
                <div className="review-card-header">
                  <span>Leave Your Review</span>
                  <span className="char-count">{newReviewText.length}/100</span>
                </div>

                <form onSubmit={handleReviewSubmit}>
                  <textarea
                    rows={4}
                    maxLength={100}
                    placeholder="Write your honest review of this book..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="review-textarea"
                  />

                  <div className="review-form-footer">
                    <div className="interactive-star-picker">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          className="star-pick-btn"
                          onClick={() => setNewReviewRating(star)}
                        >
                          <Star
                            size={18}
                            fill={star <= newReviewRating ? '#f59e0b' : 'none'}
                            color={star <= newReviewRating ? '#f59e0b' : '#64748b'}
                          />
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={!newReviewText.trim()}
                      className="btn-primary submit-review-btn"
                    >
                      {reviewSubmitted ? (
                        <>
                          <Check size={16} />
                          <span>Submitted!</span>
                        </>
                      ) : (
                        <>
                          <span>Submit</span>
                          <Send size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Reviews List */}
              <div className="existing-reviews-list">
                {bookReviews.map((rev) => (
                  <div key={rev.id} className="review-bubble">
                    <div className="review-bubble-header">
                      <span className="reviewer-name">{rev.reviewerName}</span>
                      <span className="review-date">{rev.date}</span>
                    </div>
                    <div className="stars-row-review">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i <= rev.rating ? '#f59e0b' : '#334155'}
                          color={i <= rev.rating ? '#f59e0b' : '#334155'}
                        />
                      ))}
                    </div>
                    <p className="review-body-text">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar: Related Reads matching image11.png */}
        <aside className="related-reads-sidebar">
          <h3 className="related-title">Related Reads</h3>
          <div className="related-books-stack">
            {relatedReads.map((item) => (
              <div
                key={item.id}
                className="related-item-card"
                onClick={() => navigateTo('product-detail', item.id)}
              >
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="related-thumb"
                />
                <div className="related-meta">
                  <h5 className="related-book-title">{item.title}</h5>
                  <p className="related-author">by {item.author}</p>
                  <span className="related-format">{item.format}</span>
                  <div className="related-tags">
                    {item.tags.slice(0, 2).map((t) => (
                      <span key={t} className="related-tag-pill">{t}</span>
                    ))}
                  </div>
                  <div className="related-price">${item.price.toFixed(2)}</div>
                  <div className="related-delivery">Delivery by {item.tentativeDelivery}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <style>{`
        .detail-page-container {
          flex: 1;
          padding: 24px 32px;
          max-width: 1440px;
          margin: 0 auto;
          width: 100%;
        }
        .detail-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 24px;
        }
        .back-crumb-btn {
          background: none;
          color: #3b82f6;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
        }
        .back-crumb-btn:hover {
          text-decoration: underline;
        }
        .crumb-sep {
          color: #475569;
        }
        .crumb-current {
          color: #e2e8f0;
          font-weight: 500;
        }
        .detail-main-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 36px;
        }
        @media (max-width: 1024px) {
          .detail-main-layout {
            grid-template-columns: 1fr;
          }
        }
        .detail-hero-grid {
          display: grid;
          grid-template-columns: 460px 1fr;
          gap: 32px;
          background: #14161d;
          padding: 28px;
          border-radius: 12px;
          border: 1px solid #1f232d;
          margin-bottom: 32px;
        }
        @media (max-width: 820px) {
          .detail-hero-grid {
            grid-template-columns: 1fr;
          }
        }
        .covers-display-row {
          display: flex;
          gap: 16px;
        }
        .cover-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .book-detail-cover {
          width: 100%;
          max-height: 380px;
          object-fit: contain;
          border-radius: 6px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.6);
        }
        .cover-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .detail-book-title {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 4px;
        }
        .detail-book-author {
          font-size: 14px;
          color: #94a3b8;
          margin-bottom: 12px;
        }
        .author-highlight {
          color: #60a5fa;
          font-weight: 500;
        }
        .detail-synopsis-quote {
          font-size: 13px;
          color: #cbd5e1;
          font-style: italic;
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .publisher-row {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 10px;
        }
        .pub-label {
          margin-right: 6px;
        }
        .pub-name {
          color: #e2e8f0;
          font-weight: 500;
        }
        .format-badge-large {
          display: inline-block;
          font-size: 12px;
          color: #93c5fd;
          background: rgba(59, 130, 246, 0.15);
          padding: 3px 10px;
          border-radius: 4px;
          margin-bottom: 12px;
        }
        .tags-row-detail {
          display: flex;
          gap: 6px;
          margin-bottom: 18px;
        }
        .detail-tag-pill {
          font-size: 11px;
          color: #94a3b8;
          background: #20242e;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .price-detail-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 6px;
        }
        .currency-symbol {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
        }
        .price-big {
          font-size: 32px;
          font-weight: 800;
          color: #ffffff;
        }
        .mrp-strikethrough {
          font-size: 16px;
          color: #64748b;
          text-decoration: line-through;
        }
        .delivery-detail-tag {
          font-size: 12px;
          color: #a5b4fc;
          margin-bottom: 24px;
        }
        .detail-action-buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
        }
        .detail-cart-btn {
          padding: 12px 28px;
          font-size: 15px;
        }
        .detail-wishlist-btn {
          padding: 12px 20px;
        }
        .detail-stats-bar {
          display: flex;
          align-items: center;
          background: #1a1d25;
          padding: 12px 18px;
          border-radius: 8px;
          border: 1px solid #262a34;
        }
        .stat-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-divider {
          width: 1px;
          height: 24px;
          background: #2d323e;
          margin: 0 16px;
        }
        .stat-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
        }
        .stat-value {
          font-size: 13px;
          font-weight: 600;
          color: #f1f5f9;
        }
        .stars-row {
          display: flex;
          gap: 2px;
        }
        .about-writer-card {
          background: #14161d;
          border: 1px solid #1f232d;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 32px;
        }
        .section-heading {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 16px;
        }
        .writer-profile {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .writer-avatar-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid #3b82f6;
        }
        .writer-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .writer-name {
          font-size: 16px;
          font-weight: 600;
          color: #f8fafc;
          margin-bottom: 6px;
        }
        .writer-bio {
          font-size: 13px;
          color: #94a3b8;
          line-height: 1.6;
        }
        .reviews-section {
          background: #14161d;
          border: 1px solid #1f232d;
          padding: 24px;
          border-radius: 12px;
        }
        .reviews-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 768px) {
          .reviews-layout {
            grid-template-columns: 1fr;
          }
        }
        .leave-review-card {
          background: #191c24;
          border: 1px solid #252a36;
          border-radius: 8px;
          padding: 16px;
        }
        .review-card-header {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 8px;
        }
        .review-textarea {
          width: 100%;
          background: #13151b;
          border: 1px solid #282d3a;
          border-radius: 6px;
          color: #ffffff;
          padding: 10px;
          font-size: 13px;
          resize: none;
          margin-bottom: 12px;
        }
        .review-form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .interactive-star-picker {
          display: flex;
          gap: 4px;
        }
        .star-pick-btn {
          background: none;
          padding: 2px;
        }
        .submit-review-btn {
          padding: 8px 16px;
          font-size: 13px;
        }
        .existing-reviews-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 280px;
          overflow-y: auto;
        }
        .review-bubble {
          background: #191c24;
          border: 1px solid #252a36;
          padding: 14px;
          border-radius: 8px;
        }
        .review-bubble-header {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 4px;
        }
        .reviewer-name {
          font-weight: 600;
          color: #ffffff;
        }
        .review-date {
          font-size: 11px;
          color: #64748b;
        }
        .stars-row-review {
          display: flex;
          gap: 2px;
          margin-bottom: 8px;
        }
        .review-body-text {
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.5;
        }
        .related-reads-sidebar {
          background: #14161d;
          border: 1px solid #1f232d;
          border-radius: 12px;
          padding: 20px;
          align-self: flex-start;
        }
        .related-title {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 16px;
          border-bottom: 1px solid #1f232d;
          padding-bottom: 8px;
        }
        .related-books-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .related-item-card {
          display: flex;
          gap: 12px;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .related-item-card:hover {
          background: #1a1e28;
        }
        .related-thumb {
          width: 70px;
          height: 95px;
          object-fit: cover;
          border-radius: 4px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.4);
        }
        .related-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .related-book-title {
          font-size: 13px;
          font-weight: 600;
          color: #f1f5f9;
          line-height: 1.3;
          margin-bottom: 2px;
        }
        .related-author {
          font-size: 11px;
          color: #60a5fa;
          margin-bottom: 4px;
        }
        .related-format {
          font-size: 10px;
          color: #94a3b8;
          margin-bottom: 4px;
        }
        .related-tags {
          display: flex;
          gap: 4px;
          margin-bottom: 6px;
        }
        .related-tag-pill {
          font-size: 9px;
          background: #222632;
          color: #94a3b8;
          padding: 1px 5px;
          border-radius: 3px;
        }
        .related-price {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
        }
        .related-delivery {
          font-size: 10px;
          color: #64748b;
        }
      `}</style>
    </div>
  );
}
