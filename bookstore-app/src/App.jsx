import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import CategorySidebar from './components/CategorySidebar';
import HomePage from './components/HomePage';
import ProductDetail from './components/ProductDetail';
import CartCheckout from './components/CartCheckout';
import ConfirmationView from './components/ConfirmationView';
import OrdersView from './components/OrdersView';
import WishlistView from './components/WishlistView';
import PaymentModal from './components/PaymentModal';
import AuthModal from './components/AuthModal';
import { Sparkles, Shield, HeartHandshake } from 'lucide-react';

function AppContent() {
  const { currentView } = useStore();

  return (
    <div className="app-container">
      <Navbar />

      {/* Filter bar is shown on catalog/home view */}
      {currentView === 'home' && <FilterBar />}

      <main className="main-content">
        {/* Category Sidebar is visible in home view */}
        {currentView === 'home' && <CategorySidebar />}

        {/* View Router */}
        {currentView === 'home' && <HomePage />}
        {currentView === 'product-detail' && <ProductDetail />}
        {currentView === 'cart-checkout' && <CartCheckout />}
        {currentView === 'confirmation' && <ConfirmationView />}
        {currentView === 'orders' && <OrdersView />}
        {currentView === 'wishlist' && <WishlistView />}
      </main>

      {/* Global Modals */}
      <PaymentModal />
      <AuthModal />

      {/* Footer with AI specialist capstone credentials */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-brand-col">
            <h4 className="footer-title">📖 Book Worm Online E-Commerce</h4>
            <p className="footer-desc">
              AI-Augmented Capstone Platform built using Agentic IDE workflows (IBM Bob / AWS Kiro / Antigravity).
              Featuring Member, Catalog, Shopping Cart, Payment, and 48-Hour Order Cancellation.
            </p>
          </div>

          <div className="footer-perks-col">
            <div className="footer-perk">
              <Shield size={16} className="text-blue-400" />
              <span>48h Risk-Free Cancellation</span>
            </div>
            <div className="footer-perk">
              <Sparkles size={16} className="text-amber-400" />
              <span>AI-Driven Reading Recommendations</span>
            </div>
            <div className="footer-perk">
              <HeartHandshake size={16} className="text-emerald-400" />
              <span>Gift Points Loyalty Rewards</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Book Worm Inc. • AI Specialist Capstone Project • All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        .app-footer {
          background-color: #0c0d10;
          border-top: 1px solid #1a1d24;
          padding: 32px 24px 20px 24px;
          margin-top: auto;
        }
        .footer-inner {
          max-width: 1440px;
          margin: 0 auto 20px auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }
        @media (max-width: 768px) {
          .footer-inner {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        .footer-brand-col {
          max-width: 600px;
        }
        .footer-title {
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 6px;
        }
        .footer-desc {
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }
        .footer-perks-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .footer-perk {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #cbd5e1;
        }
        .footer-bottom {
          max-width: 1440px;
          margin: 0 auto;
          padding-top: 16px;
          border-top: 1px solid #14171e;
          font-size: 11px;
          color: #475569;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
