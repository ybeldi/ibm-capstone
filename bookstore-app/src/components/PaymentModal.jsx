import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CreditCard, Smartphone, Wallet, X, Loader2, ShieldCheck } from 'lucide-react';

export default function PaymentModal() {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    grandTotal,
    placeOrder
  } = useStore();

  const [activeTab, setActiveTab] = useState('credit'); // 'credit' | 'debit' | 'upi' | 'wallet'
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8920');
  const [cardName, setCardName] = useState('Daniel Reed');
  const [cvv, setCvv] = useState('892');
  const [expiry, setExpiry] = useState('08/29');
  const [upiId, setUpiId] = useState('daniel.reed@okaxis');

  if (!isPaymentModalOpen) return null;

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const methodMap = {
      credit: 'Credit Card',
      debit: 'Debit Card',
      upi: 'UPI',
      wallet: 'Wallet'
    };

    setTimeout(() => {
      setIsProcessing(false);
      placeOrder(methodMap[activeTab] || 'Credit Card');
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={() => !isProcessing && setIsPaymentModalOpen(false)}>
      <div className="payment-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header matching image14.png */}
        <div className="payment-modal-header">
          <h2 className="modal-title">Complete Payment</h2>
          <div className="payable-amount-box">
            <span className="payable-label">Payable Amount:</span>
            <span className="payable-value">${grandTotal.toFixed(2)}</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => !isProcessing && setIsPaymentModalOpen(false)}
            title="Cancel payment"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Left Tabs, Right Form */}
        <div className="payment-modal-body">
          {/* Left Tabs Column */}
          <div className="payment-tabs-column">
            <button
              className={`payment-tab-item ${activeTab === 'credit' ? 'active' : ''}`}
              onClick={() => setActiveTab('credit')}
            >
              <CreditCard size={16} />
              <span>Credit Card</span>
            </button>

            <button
              className={`payment-tab-item ${activeTab === 'debit' ? 'active' : ''}`}
              onClick={() => setActiveTab('debit')}
            >
              <CreditCard size={16} />
              <span>Debit card</span>
            </button>

            <button
              className={`payment-tab-item ${activeTab === 'upi' ? 'active' : ''}`}
              onClick={() => setActiveTab('upi')}
            >
              <Smartphone size={16} />
              <span>UPI</span>
            </button>

            <button
              className={`payment-tab-item ${activeTab === 'wallet' ? 'active' : ''}`}
              onClick={() => setActiveTab('wallet')}
            >
              <Wallet size={16} />
              <span>Wallet</span>
            </button>
          </div>

          {/* Right Form Column matching image14.png */}
          <div className="payment-fields-column">
            <form onSubmit={handlePay}>
              {(activeTab === 'credit' || activeTab === 'debit') && (
                <div className="cards-form-grid">
                  <div className="form-group">
                    <label className="field-label">Card Number</label>
                    <input
                      type="text"
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">Name on Card</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">CVV</label>
                    <input
                      type="password"
                      placeholder="XXX"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">Date of Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YYYY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {activeTab === 'upi' && (
                <div className="upi-form-wrapper">
                  <div className="form-group">
                    <label className="field-label">Virtual Payment Address (UPI ID)</label>
                    <input
                      type="text"
                      placeholder="username@bank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="upi-app-badges">
                    <span className="app-badge">Google Pay</span>
                    <span className="app-badge">PhonePe</span>
                    <span className="app-badge">Paytm</span>
                  </div>
                </div>
              )}

              {activeTab === 'wallet' && (
                <div className="wallet-options-wrapper">
                  <p className="wallet-desc">Select digital wallet to charge:</p>
                  <div className="wallet-balance-card">
                    <div>
                      <div className="wallet-name">Book Worm Express Wallet</div>
                      <div className="wallet-bal">Available Balance: $150.00</div>
                    </div>
                    <ShieldCheck size={24} className="text-emerald-400" />
                  </div>
                </div>
              )}

              <div className="payment-submit-row">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="modal-pay-now-btn"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Authorizing Secure Gateway...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay Now</span>
                      <CreditCard size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .payment-modal-card {
          background-color: #1a1c23;
          border: 1px solid #282d39;
          border-radius: 12px;
          width: 680px;
          max-width: 95vw;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85);
          overflow: hidden;
          animation: slideUp 0.25s ease-out;
        }
        .payment-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #21252f;
          padding: 16px 24px;
          border-bottom: 1px solid #2d3240;
        }
        .modal-title {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }
        .payable-amount-box {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .payable-label {
          font-size: 14px;
          color: #94a3b8;
        }
        .payable-value {
          font-size: 17px;
          font-weight: 700;
          color: #ffffff;
        }
        .modal-close-btn {
          background: none;
          color: #94a3b8;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .modal-close-btn:hover {
          color: #ffffff;
        }
        .payment-modal-body {
          display: grid;
          grid-template-columns: 180px 1fr;
          min-height: 280px;
        }
        @media (max-width: 600px) {
          .payment-modal-body {
            grid-template-columns: 1fr;
          }
        }
        .payment-tabs-column {
          background-color: #171920;
          border-right: 1px solid #262a35;
          display: flex;
          flex-direction: column;
        }
        .payment-tab-item {
          background: none;
          text-align: left;
          padding: 14px 18px;
          font-size: 14px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 10px;
          border-left: 3px solid transparent;
          border-bottom: 1px solid #1f222b;
          transition: all 0.15s ease;
        }
        .payment-tab-item:hover {
          color: #f1f5f9;
          background-color: #1e212b;
        }
        .payment-tab-item.active {
          color: #ffffff;
          background-color: #212530;
          border-left-color: #3b82f6;
          font-weight: 600;
        }
        .payment-fields-column {
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .cards-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-label {
          font-size: 12px;
          color: #94a3b8;
        }
        .upi-form-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        .upi-app-badges {
          display: flex;
          gap: 8px;
        }
        .app-badge {
          font-size: 11px;
          background: #252a36;
          color: #94a3b8;
          padding: 4px 10px;
          border-radius: 4px;
        }
        .wallet-options-wrapper {
          margin-bottom: 24px;
        }
        .wallet-desc {
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 12px;
        }
        .wallet-balance-card {
          background: #20242e;
          border: 1px solid #2d3342;
          padding: 14px 18px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .wallet-name {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 2px;
        }
        .wallet-bal {
          font-size: 12px;
          color: #10b981;
        }
        .payment-submit-row {
          display: flex;
          justify-content: flex-end;
        }
        .modal-pay-now-btn {
          background-color: #2563eb;
          color: #ffffff;
          padding: 12px 28px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.4);
        }
        .modal-pay-now-btn:hover {
          background-color: #1d4ed8;
        }
      `}</style>
    </div>
  );
}
