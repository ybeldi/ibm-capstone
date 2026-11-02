import React from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ChevronDown, X } from 'lucide-react';

export default function FilterBar() {
  const {
    searchQuery,
    setSearchQuery,
    languageFilter,
    setLanguageFilter,
    formatFilter,
    setFormatFilter,
    priceFilter,
    setPriceFilter,
    sortBy,
    setSortBy
  } = useStore();

  return (
    <div className="filter-bar-container">
      <div className="filter-bar-grid">
        {/* Search input matching wireframe */}
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search you want to read here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery ? (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          ) : (
            <Search className="search-icon" size={18} />
          )}
        </div>

        {/* Language Filter */}
        <div className="filter-select-group">
          <label className="filter-label">Language</label>
          <div className="select-wrapper">
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All</option>
              <option value="English">English</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
              <option value="German">German</option>
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>
        </div>

        {/* Format Filter */}
        <div className="filter-select-group">
          <label className="filter-label">Format (Paperback, ebook etc)</label>
          <div className="select-wrapper">
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All</option>
              <option value="Paperback">Paperback</option>
              <option value="Hardcover">Hard Cover</option>
              <option value="eBook">eBook</option>
              <option value="Audiobook">Audiobook</option>
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>
        </div>

        {/* Price Range */}
        <div className="filter-select-group">
          <label className="filter-label">Price Range</label>
          <div className="select-wrapper">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All</option>
              <option value="under-15">Under $15</option>
              <option value="15-25">$15 - $25</option>
              <option value="25-35">$25 - $35</option>
              <option value="above-35">Above $35</option>
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>
        </div>

        {/* Sort By */}
        <div className="filter-select-group">
          <label className="filter-label">Sort by</label>
          <div className="select-wrapper">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Releases</option>
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>
        </div>
      </div>

      <style>{`
        .filter-bar-container {
          background-color: #121419;
          border-bottom: 1px solid #1f222b;
          padding: 16px 24px;
        }
        .filter-bar-grid {
          max-width: 1440px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2.5fr 1fr 1.4fr 1.1fr 1.1fr;
          gap: 16px;
          align-items: center;
        }
        @media (max-width: 1024px) {
          .filter-bar-grid {
            grid-template-columns: 1fr 1fr;
          }
          .search-input-wrapper {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 640px) {
          .filter-bar-grid {
            grid-template-columns: 1fr;
          }
        }
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-input {
          width: 100%;
          background-color: #1a1d24;
          border: 1px solid #282c37;
          border-radius: 6px;
          padding: 10px 40px 10px 14px;
          font-size: 14px;
          color: #ffffff;
        }
        .search-input::placeholder {
          color: #64748b;
        }
        .search-input:focus {
          border-color: #3b82f6;
          background-color: #1e222a;
        }
        .search-icon {
          position: absolute;
          right: 12px;
          color: #94a3b8;
          pointer-events: none;
        }
        .search-clear-btn {
          position: absolute;
          right: 10px;
          background: none;
          color: #94a3b8;
          padding: 4px;
        }
        .search-clear-btn:hover {
          color: #ffffff;
        }
        .filter-select-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .filter-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .filter-select {
          width: 100%;
          appearance: none;
          background-color: #1a1d24;
          border: 1px solid #282c37;
          border-radius: 6px;
          padding: 9px 30px 9px 12px;
          font-size: 13px;
          color: #e2e8f0;
          cursor: pointer;
        }
        .filter-select:focus {
          border-color: #3b82f6;
        }
        .select-chevron {
          position: absolute;
          right: 10px;
          color: #94a3b8;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
