import React from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/booksData';

export default function CategorySidebar() {
  const { activeCategory, setActiveCategory, books, navigateTo } = useStore();

  const getCategoryCount = (cat) => {
    if (cat === 'All') return books.length;
    return books.filter((b) => b.category === cat).length;
  };

  const handleSelect = (category) => {
    setActiveCategory(category);
    navigateTo('home');
  };

  return (
    <aside className="category-sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Categories</h3>
      </div>
      <div className="category-list">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const count = getCategoryCount(cat);

          return (
            <button
              key={cat}
              className={`category-item ${isActive ? 'active' : ''}`}
              onClick={() => handleSelect(cat)}
            >
              <span className="category-name">{cat}</span>
              {count > 0 && <span className="category-count">{count}</span>}
            </button>
          );
        })}
      </div>

      <style>{`
        .category-sidebar {
          width: 220px;
          min-width: 220px;
          background-color: #0f1115;
          border-right: 1px solid #1f222b;
          padding: 16px 0;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 860px) {
          .category-sidebar {
            display: none;
          }
        }
        .sidebar-header {
          padding: 0 16px 12px 16px;
          border-bottom: 1px solid #1a1c22;
        }
        .sidebar-title {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          font-weight: 600;
        }
        .category-list {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          max-height: calc(100vh - 170px);
          padding-top: 8px;
        }
        .category-item {
          background: none;
          text-align: left;
          padding: 8px 16px;
          font-size: 13px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-left: 3px solid transparent;
          transition: all 0.15s ease;
        }
        .category-item:hover {
          color: #f1f5f9;
          background-color: #16181f;
        }
        .category-item.active {
          color: #ffffff;
          background-color: #1e222c;
          border-left-color: #3b82f6;
          font-weight: 600;
        }
        .category-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .category-count {
          font-size: 11px;
          color: #64748b;
          background: #14161c;
          padding: 1px 6px;
          border-radius: 9999px;
        }
        .category-item.active .category-count {
          background: #2563eb;
          color: #ffffff;
        }
      `}</style>
    </aside>
  );
}
