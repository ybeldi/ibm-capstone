import React from 'react';
import { useStore } from '../context/StoreContext';
import { BookOpen, ShoppingBag, Heart, User, Award, Clock } from 'lucide-react';

export default function Navbar() {
  const {
    currentView,
    navigateTo,
    cart,
    wishlist,
    user,
    orders,
    setIsAuthModalOpen
  } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeOrdersCount = orders.filter((o) => o.status === 'Confirmed' || o.status === 'Processing').length;

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand / Logo */}
        <div
          className="navbar-brand"
          onClick={() => navigateTo('home')}
          title="Go to Book Worm Home"
        >
          <div className="brand-icon-wrapper">
            <BookOpen className="brand-icon" size={24} />
          </div>
          <span className="brand-title">Book Worm</span>
        </div>

        {/* Center Nav Links */}
        <nav className="navbar-links">
          <button
            className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => navigateTo('home')}
          >
            Catalog
          </button>
          <button
            className={`nav-link ${currentView === 'orders' ? 'active' : ''}`}
            onClick={() => navigateTo('orders')}
          >
            <span>My Orders</span>
            {activeOrdersCount > 0 && (
              <span className="nav-badge-pill">{activeOrdersCount}</span>
            )}
          </button>
          <button
            className={`nav-link ${currentView === 'wishlist' ? 'active' : ''}`}
            onClick={() => navigateTo('wishlist')}
          >
            <span>My Wishlist</span>
            {wishlist.length > 0 && (
              <span className="nav-badge-subtle">{wishlist.length}</span>
            )}
          </button>
          <button
            className="nav-link"
            onClick={() => {
              // Direct filter to featured writer Daniel Reed
              navigateTo('home');
            }}
          >
            My Writers
          </button>
        </nav>

        {/* Right Section: Points, Cart & Profile */}
        <div className="navbar-actions">
          {/* Gift Points Tag */}
          <div className="gift-points-pill" title="Redeem points for discounts at checkout">
            <Award size={15} className="text-amber-400" />
            <span className="points-val">{user.giftPoints}</span>
            <span className="points-label">Pts</span>
          </div>

          {/* Cart Icon & Badge */}
          <button
            className="cart-btn"
            onClick={() => navigateTo('cart-checkout')}
            title="View Shopping Cart"
          >
            <ShoppingBag size={20} />
            {totalCartCount > 0 && (
              <span className="cart-badge">{totalCartCount}</span>
            )}
          </button>

          {/* User Account / Login */}
          <button
            className="user-profile-btn"
            onClick={() => setIsAuthModalOpen(true)}
            title={user.isAuthenticated ? `Logged in as ${user.name}` : 'Sign In'}
          >
            <div className="avatar-circle">
              <User size={18} />
            </div>
            {user.isAuthenticated && (
              <span className="user-name-label">{user.name.split(' ')[0]}</span>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .navbar-container {
          background-color: #0d0e11;
          border-bottom: 1px solid #1f222b;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .navbar-inner {
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }
        .brand-icon-wrapper {
          color: #3b82f6;
        }
        .brand-title {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #ffffff;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .nav-link {
          background: none;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 0;
          position: relative;
        }
        .nav-link:hover {
          color: #f1f5f9;
        }
        .nav-link.active {
          color: #ffffff;
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #3b82f6;
        }
        .nav-badge-pill {
          background-color: #2563eb;
          color: #ffffff;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 9999px;
        }
        .nav-badge-subtle {
          background-color: #262a34;
          color: #cbd5e1;
          font-size: 11px;
          padding: 1px 6px;
          border-radius: 9999px;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .gift-points-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.25);
          color: #f59e0b;
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
        }
        .points-val {
          color: #fbbf24;
        }
        .points-label {
          font-size: 11px;
          opacity: 0.85;
        }
        .cart-btn {
          background: none;
          color: #cbd5e1;
          position: relative;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-btn:hover {
          background-color: #1e222b;
          color: #ffffff;
        }
        .cart-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background-color: #ef4444;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #0d0e11;
        }
        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #1a1d24;
          border: 1px solid #282c37;
          padding: 4px 12px 4px 4px;
          border-radius: 9999px;
          color: #f1f5f9;
        }
        .user-profile-btn:hover {
          border-color: #3b82f6;
        }
        .avatar-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }
        .user-name-label {
          font-size: 13px;
          font-weight: 500;
        }
      `}</style>
    </header>
  );
}
