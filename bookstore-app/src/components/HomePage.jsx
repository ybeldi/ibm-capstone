import React from 'react';
import { useStore } from '../context/StoreContext';
import BookCard from './BookCard';
import { Sparkles, TrendingUp, Flame, BookOpen } from 'lucide-react';

export default function HomePage() {
  const {
    filteredBooks,
    activeCategory,
    searchQuery,
    languageFilter,
    formatFilter,
    priceFilter,
    setActiveCategory,
    setSearchQuery
  } = useStore();

  const isFilteringActive =
    activeCategory !== 'All' ||
    searchQuery.trim() !== '' ||
    languageFilter !== 'All' ||
    formatFilter !== 'All' ||
    priceFilter !== 'All';

  // Group books for the default homepage sections as shown in image7.png
  const recommendedBooks = filteredBooks.filter((b) => b.isRecommended);
  const bestsellerBooks = filteredBooks.filter((b) => b.isBestseller);
  const newLaunchBooks = filteredBooks.filter((b) => b.isNewLaunch);

  return (
    <div className="home-container">
      {/* Banner / Category Header */}
      <div className="home-header">
        <div className="header-breadcrumbs">
          <span>Home</span>
          <span className="separator">/</span>
          <span className="current-page">{activeCategory}</span>
        </div>

        {isFilteringActive && (
          <div className="filter-summary-row">
            <span className="match-count">
              Showing <strong>{filteredBooks.length}</strong> books matching your criteria
            </span>
            <button
              className="clear-all-filters-btn"
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {isFilteringActive ? (
        /* Filtered Grid View */
        <section className="catalog-section">
          <div className="section-title-row">
            <h2 className="section-title">
              {searchQuery ? `Search Results for "${searchQuery}"` : `${activeCategory} Reads`}
            </h2>
          </div>
          {filteredBooks.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={48} className="empty-icon" />
              <h3>No books found</h3>
              <p>Try adjusting your search terms or filter selections.</p>
              <button
                className="btn-primary mt-4"
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
              >
                Show All Books
              </button>
            </div>
          ) : (
            <div className="books-grid">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Default 3-Section Wireframe View from image7.png */
        <div className="sections-wrapper">
          {/* Section 1: Recommended for You */}
          <section className="catalog-section">
            <div className="section-title-row">
              <Sparkles size={18} className="section-icon text-amber-400" />
              <h2 className="section-title">Recommended for You</h2>
            </div>
            <div className="books-grid">
              {recommendedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>

          {/* Section 2: Bestsellers this Month */}
          <section className="catalog-section">
            <div className="section-title-row">
              <TrendingUp size={18} className="section-icon text-blue-400" />
              <h2 className="section-title">Bestsellers this Month</h2>
            </div>
            <div className="books-grid">
              {bestsellerBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>

          {/* Section 3: New Launches */}
          <section className="catalog-section">
            <div className="section-title-row">
              <Flame size={18} className="section-icon text-rose-400" />
              <h2 className="section-title">New Launches</h2>
            </div>
            <div className="books-grid">
              {newLaunchBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        </div>
      )}

      <style>{`
        .home-container {
          flex: 1;
          padding: 20px 28px;
          overflow-y: auto;
        }
        .home-header {
          margin-bottom: 24px;
        }
        .header-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 8px;
        }
        .separator {
          color: #475569;
        }
        .current-page {
          color: #cbd5e1;
          font-weight: 500;
        }
        .filter-summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #171920;
          padding: 10px 16px;
          border-radius: 6px;
          border: 1px solid #232732;
        }
        .match-count {
          font-size: 13px;
          color: #94a3b8;
        }
        .match-count strong {
          color: #ffffff;
        }
        .clear-all-filters-btn {
          background: none;
          color: #3b82f6;
          font-size: 13px;
          font-weight: 500;
        }
        .clear-all-filters-btn:hover {
          text-decoration: underline;
        }
        .sections-wrapper {
          display: flex;
          flex-direction: column;
          gap: 36px;
        }
        .catalog-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .section-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #1e222b;
          padding-bottom: 10px;
        }
        .section-icon {
          color: #f59e0b;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #f1f5f9;
          letter-spacing: -0.01em;
        }
        .books-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }
        @media (max-width: 1280px) {
          .books-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 768px) {
          .books-grid {
            grid-template-columns: 1fr;
          }
        }
        .empty-state {
          padding: 60px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #14161c;
          border-radius: 8px;
          border: 1px dashed #242936;
        }
        .empty-icon {
          color: #475569;
          margin-bottom: 12px;
        }
        .empty-state h3 {
          font-size: 18px;
          color: #f8fafc;
          margin-bottom: 6px;
        }
        .empty-state p {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
}
