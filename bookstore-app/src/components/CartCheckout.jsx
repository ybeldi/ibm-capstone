import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Minus, Trash2, ArrowLeft, CreditCard, Award, Tag, Check } from 'lucide-react';

export default function CartCheckout() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    tax,
    deliveryCharges,
    couponDiscount,
    giftPointsDiscount,
    grandTotal,
    appliedCoupon,
    setAppliedCoupon,
    useGiftPoints,
    setUseGiftPoints,
    user,
    address,
    setAddress,
    navigateTo,
    setIsPaymentModalOpen
  } = useStore();

  const [couponInput, setCouponInput] = useState(appliedCoupon.code || 'WELCOME10');
  const [couponMessage, setCouponMessage] = useState(appliedCoupon.applied ? 'Coupon WELCOME10 applied (-$10.00)' : '');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim().toUpperCase() === 'WELCOME10') {
      setAppliedCoupon({
        code: 'WELCOME10',
        discount: 10.00,
        applied: true
      });
      setCouponMessage('Coupon WELCOME10 applied (-$10.00)');
    } else if (couponInput.trim().toUpperCase() === 'BOOKWORM5') {
      setAppliedCoupon({
        code: 'BOOKWORM5',
        discount: 5.00,
        applied: true
      });
      setCouponMessage('Coupon BOOKWORM5 applied (-$5.00)');
    } else {
      setCouponMessage('Invalid coupon code');
    }
  };

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty-state">
        <h2>Your Shopping Basket is Empty</h2>
        <p>Explore our catalog to find your next great read.</p>
        <button className="btn-primary mt-4" onClick={() => navigateTo('home')}>
          Return to Catalog
        </button>
        <style>{`
          .cart-empty-state {
            padding: 80px 20px;
            text-align: center;
            max-width: 600px;
            margin: 0 auto;
          }
          .cart-empty-state h2 {
            font-size: 24px;
            color: #ffffff;
            margin-bottom: 12px;
          }
          .cart-empty-state p {
            color: #94a3b8;
            margin-bottom: 24px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      {/* Breadcrumbs matching image13.png */}
      <div className="checkout-breadcrumbs">
        <button className="back-crumb-btn" onClick={() => navigateTo('home')}>
          <ArrowLeft size={14} />
          <span>Home</span>
        </button>
        <span className="crumb-sep">/</span>
        <span>Non-Fiction</span>
        <span className="crumb-sep">/</span>
        <span>Self Help</span>
        <span className="crumb-sep">/</span>
        <span>Joy of Minimalism</span>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">Checkout</span>
      </div>

      <h1 className="checkout-page-title">Shopping Cart</h1>

      {/* Top Section: Cart Items Row matching image13.png */}
      <div className="cart-items-horizontal-row">
        {cart.map((item) => (
          <div key={item.id} className="cart-item-card">
            <img
              src={item.book.coverImage}
              alt={item.book.title}
              className="cart-item-cover"
            />
            <div className="cart-item-details">
              <h3 className="cart-item-title">{item.book.title}</h3>
              <p className="cart-item-author">by <span className="author-name">{item.book.author}</span></p>

              <p className="cart-item-synopsis">{item.book.synopsis}</p>

              <div className="cart-item-format">{item.book.format}</div>

              <div className="cart-item-tags">
                {item.book.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="cart-tag-pill">{tag}</span>
                ))}
              </div>

              <div className="cart-price-delivery">
                <div className="cart-item-price">${item.book.price.toFixed(2)}</div>
                <div className="cart-item-delivery">Delivery by <strong>{item.book.tentativeDelivery}</strong></div>
              </div>

              {/* Counter matching image13.png ( 1 - + ) */}
              <div className="quantity-counter-row">
                <span className="qty-number">{item.quantity}</span>
                <button
                  className="counter-btn"
                  onClick={() => updateQuantity(item.id, -1)}
                  title="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <button
                  className="counter-btn"
                  onClick={() => updateQuantity(item.id, 1)}
                  title="Increase quantity"
                >
                  <Plus size={14} />
                </button>

                <button
                  className="cart-delete-btn"
                  onClick={() => removeFromCart(item.id)}
                  title="Remove from cart"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Layout: Address on Left, Grand Total on Right */}
      <div className="checkout-bottom-grid">
        {/* Address Form Card matching image13.png */}
        <div className="address-section-card">
          <h2 className="address-section-title">Address</h2>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={address.useSaved}
              onChange={(e) => handleAddressChange('useSaved', e.target.checked)}
              className="custom-checkbox"
            />
            <span>Use Saved Address</span>
          </label>

          <form className="address-form-grid" onSubmit={(e) => e.preventDefault()}>
            <div className="form-col">
              <label className="input-label">First Name</label>
              <input
                type="text"
                placeholder="First Name"
                value={address.firstName}
                onChange={(e) => handleAddressChange('firstName', e.target.value)}
              />
            </div>

            <div className="form-col">
              <label className="input-label">Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                value={address.lastName}
                onChange={(e) => handleAddressChange('lastName', e.target.value)}
              />
            </div>

            <div className="form-col full-width">
              <label className="input-label">Address</label>
              <input
                type="text"
                placeholder="Address Line 2 / Street"
                value={address.addressLine2}
                onChange={(e) => handleAddressChange('addressLine2', e.target.value)}
              />
            </div>

            <div className="form-col full-width">
              <label className="input-label">e-mail</label>
              <input
                type="email"
                placeholder="e-mail"
                value={address.email}
                onChange={(e) => handleAddressChange('email', e.target.value)}
              />
            </div>

            <div className="form-col">
              <label className="input-label">City</label>
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
              />
            </div>

            <div className="form-col">
              <label className="input-label">Pin</label>
              <input
                type="text"
                placeholder="000000"
                value={address.pin}
                onChange={(e) => handleAddressChange('pin', e.target.value)}
              />
            </div>

            <div className="form-col">
              <label className="input-label">Phone Number</label>
              <div className="phone-input-group">
                <select
                  value={address.countryCode}
                  onChange={(e) => handleAddressChange('countryCode', e.target.value)}
                  className="country-code-select"
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <input
                  type="tel"
                  placeholder="1234567890"
                  value={address.phoneNumber}
                  onChange={(e) => handleAddressChange('phoneNumber', e.target.value)}
                  className="phone-field"
                />
              </div>
            </div>

            <div className="form-col">
              <label className="input-label">State</label>
              <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
              />
            </div>

            <div className="form-col">
              <label className="input-label">Country</label>
              <select
                value={address.country}
                onChange={(e) => handleAddressChange('country', e.target.value)}
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
              </select>
            </div>
          </form>
        </div>

        {/* Grand Total Card with Illustration Banner matching image13.png */}
        <div className="grand-total-card">
          <div className="grand-total-inner">
            {/* Left Decorative Illustration from wireframe */}
            <div className="decorative-banner-wrapper">
              <img
                src="/covers/checkout_banner.png"
                alt="Book Worm Celebration Banner"
                className="banner-illustration"
              />
            </div>

            {/* Right Summary Details */}
            <div className="summary-details-wrapper">
              <h2 className="summary-heading">Grand Total</h2>

              <div className="summary-line">
                <span className="line-label">Price ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="line-val">${cartSubtotal.toFixed(2)}</span>
              </div>

              <div className="summary-line">
                <span className="line-label">Tax (8% Sales Tax)</span>
                <span className="line-val">${tax.toFixed(2)}</span>
              </div>

              <div className="summary-line">
                <span className="line-label">Delivery Charges</span>
                <span className="line-val delivery-free">{deliveryCharges === 0 ? 'Free' : `$${deliveryCharges.toFixed(2)}`}</span>
              </div>

              {/* Gift Points Redemption Option */}
              <div className="points-redemption-box">
                <label className="points-redeem-label">
                  <input
                    type="checkbox"
                    checked={useGiftPoints}
                    onChange={(e) => setUseGiftPoints(e.target.checked)}
                  />
                  <span>Redeem Gift Points ({user.giftPoints} available = $10.00)</span>
                </label>
                {useGiftPoints && (
                  <span className="points-discount-val">-${giftPointsDiscount.toFixed(2)}</span>
                )}
              </div>

              {/* Coupon Code Input matching wireframe */}
              <form onSubmit={handleApplyCoupon} className="coupon-form-row">
                <input
                  type="text"
                  placeholder="Apply Coupon (e.g. WELCOME10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="coupon-input"
                />
                <button type="submit" className="coupon-apply-btn">
                  Apply
                </button>
              </form>
              {couponMessage && (
                <div className="coupon-status-text">{couponMessage}</div>
              )}

              {couponDiscount > 0 && (
                <div className="summary-line discount-line">
                  <span className="line-label">Discount</span>
                  <span className="line-val">-${couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-divider" />

              <div className="total-amount-line">
                <span className="total-label">Total Amount</span>
                <span className="total-value">${grandTotal.toFixed(2)}</span>
              </div>

              <button
                className="pay-now-action-btn"
                onClick={() => setIsPaymentModalOpen(true)}
              >
                <span>Pay Now</span>
                <CreditCard size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-page-container {
          flex: 1;
          padding: 24px 32px;
          max-width: 1440px;
          margin: 0 auto;
          width: 100%;
        }
        .checkout-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 16px;
        }
        .back-crumb-btn {
          background: none;
          color: #3b82f6;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
        }
        .crumb-sep {
          color: #475569;
        }
        .crumb-current {
          color: #e2e8f0;
          font-weight: 500;
        }
        .checkout-page-title {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 24px;
        }
        .cart-items-horizontal-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }
        .cart-item-card {
          display: flex;
          gap: 20px;
          background: #14161d;
          border: 1px solid #1f232d;
          border-radius: 10px;
          padding: 20px;
        }
        .cart-item-cover {
          width: 130px;
          height: 180px;
          object-fit: cover;
          border-radius: 6px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          flex-shrink: 0;
        }
        .cart-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .cart-item-title {
          font-size: 17px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 2px;
        }
        .cart-item-author {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 8px;
        }
        .author-name {
          color: #60a5fa;
        }
        .cart-item-synopsis {
          font-size: 12px;
          color: #94a3b8;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 6px;
          line-height: 1.4;
        }
        .cart-item-format {
          font-size: 11px;
          color: #cbd5e1;
          margin-bottom: 6px;
        }
        .cart-item-tags {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
        }
        .cart-tag-pill {
          font-size: 10px;
          background: #20242e;
          color: #94a3b8;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .cart-price-delivery {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .cart-item-price {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
        }
        .cart-item-delivery {
          font-size: 11px;
          color: #64748b;
        }
        .cart-item-delivery strong {
          color: #94a3b8;
        }
        .quantity-counter-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: auto;
          background: #1b1e27;
          width: fit-content;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #282d39;
        }
        .qty-number {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          min-width: 14px;
          text-align: center;
        }
        .counter-btn {
          background: none;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }
        .counter-btn:hover {
          color: #ffffff;
        }
        .cart-delete-btn {
          background: none;
          color: #ef4444;
          margin-left: 12px;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .cart-delete-btn:hover {
          color: #f87171;
        }
        .checkout-bottom-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 28px;
        }
        @media (max-width: 960px) {
          .checkout-bottom-grid {
            grid-template-columns: 1fr;
          }
        }
        .address-section-card {
          background: #14161d;
          border: 1px solid #1f232d;
          border-radius: 12px;
          padding: 24px;
        }
        .address-section-title {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 14px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #cbd5e1;
          cursor: pointer;
          margin-bottom: 20px;
        }
        .custom-checkbox {
          accent-color: #2563eb;
          width: 16px;
          height: 16px;
        }
        .address-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .form-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .form-col.full-width {
          grid-column: 1 / -1;
        }
        .input-label {
          font-size: 11px;
          color: #64748b;
          text-transform: capitalize;
        }
        .phone-input-group {
          display: flex;
          gap: 8px;
        }
        .country-code-select {
          width: 80px;
        }
        .phone-field {
          flex: 1;
        }
        .grand-total-card {
          background: #14161d;
          border: 1px solid #1f232d;
          border-radius: 12px;
          overflow: hidden;
        }
        .grand-total-inner {
          display: flex;
          height: 100%;
        }
        @media (max-width: 600px) {
          .grand-total-inner {
            flex-direction: column;
          }
        }
        .decorative-banner-wrapper {
          width: 140px;
          flex-shrink: 0;
          background: #0f121a;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .banner-illustration {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.9;
        }
        .summary-details-wrapper {
          flex: 1;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .summary-heading {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 18px;
        }
        .summary-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 10px;
        }
        .line-val {
          color: #ffffff;
          font-weight: 500;
        }
        .delivery-free {
          color: #10b981;
          font-weight: 600;
        }
        .points-redemption-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.2);
          padding: 8px 12px;
          border-radius: 6px;
          margin: 10px 0;
          font-size: 12px;
          color: #f59e0b;
        }
        .points-redeem-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .points-discount-val {
          font-weight: 700;
        }
        .coupon-form-row {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          margin-bottom: 6px;
        }
        .coupon-input {
          flex: 1;
          font-size: 12px;
          text-transform: uppercase;
        }
        .coupon-apply-btn {
          background-color: #2563eb;
          color: #ffffff;
          padding: 0 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }
        .coupon-apply-btn:hover {
          background-color: #1d4ed8;
        }
        .coupon-status-text {
          font-size: 11px;
          color: #10b981;
          margin-bottom: 12px;
        }
        .discount-line .line-val {
          color: #10b981;
        }
        .summary-divider {
          height: 1px;
          background: #242935;
          margin: 16px 0;
        }
        .total-amount-line {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 24px;
        }
        .total-label {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }
        .total-value {
          font-size: 26px;
          font-weight: 800;
          color: #ffffff;
        }
        .pay-now-action-btn {
          background-color: #2563eb;
          color: #ffffff;
          width: 100%;
          padding: 14px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          transition: all 0.2s ease;
        }
        .pay-now-action-btn:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
