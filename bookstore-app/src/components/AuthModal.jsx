import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, Mail, Award, CheckCircle } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, user, setUser } = useStore();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState(user.email || 'daniel.reed@example.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState(user.name || 'Daniel Reed');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({
      isAuthenticated: true,
      name: name || 'Daniel Reed',
      email: email,
      giftPoints: 500,
      phone: '+91 9876543210'
    });
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser({
      isAuthenticated: false,
      name: 'Guest Reader',
      email: '',
      giftPoints: 0,
      phone: ''
    });
    setIsAuthModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h3 className="auth-title">
            {user.isAuthenticated
              ? 'Member Profile'
              : mode === 'login'
              ? 'Sign in to Book Worm'
              : 'Create Member Account'}
          </h3>
          <button
            className="auth-close-btn"
            onClick={() => setIsAuthModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="auth-modal-body">
          {user.isAuthenticated ? (
            <div className="profile-logged-in-view">
              <div className="profile-badge-row">
                <div className="user-avatar-big">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="logged-name">{user.name}</h4>
                  <p className="logged-email">{user.email}</p>
                </div>
              </div>

              <div className="points-member-card">
                <div className="pts-left">
                  <Award size={24} className="text-amber-400" />
                  <div>
                    <span className="pts-big">{user.giftPoints}</span>
                    <span className="pts-sub">Book Worm Reward Points</span>
                  </div>
                </div>
                <div className="pts-value">Value: ${(user.giftPoints * 0.02).toFixed(2)}</div>
              </div>

              <div className="member-perks-list">
                <div className="perk-item">
                  <CheckCircle size={15} className="text-emerald-400" />
                  <span>Free Express Delivery on all orders above $35</span>
                </div>
                <div className="perk-item">
                  <CheckCircle size={15} className="text-emerald-400" />
                  <span>48-Hour No-Questions-Asked Order Cancellation</span>
                </div>
                <div className="perk-item">
                  <CheckCircle size={15} className="text-emerald-400" />
                  <span>Earn 5% points back on every book purchased</span>
                </div>
              </div>

              <button className="btn-secondary logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              {mode === 'register' && (
                <div className="form-group mb-3">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daniel Reed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group mb-3">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="field-icon" />
                  <input
                    type="email"
                    required
                    placeholder="reader@bookworm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group mb-4">
                <label>Password</label>
                <div className="input-with-icon">
                  <Lock size={16} className="field-icon" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-3 mb-3">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <div className="auth-switch-text">
                {mode === 'login' ? (
                  <span>
                    New to Book Worm?{' '}
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => setMode('register')}
                    >
                      Join now & get 500 Gift Points!
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => setMode('login')}
                    >
                      Sign In
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .auth-modal-card {
          background-color: #171920;
          border: 1px solid #232732;
          border-radius: 12px;
          width: 440px;
          max-width: 95vw;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.8);
          animation: slideUp 0.2s ease-out;
        }
        .auth-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          background: #1f222b;
          border-bottom: 1px solid #2a2e3a;
        }
        .auth-title {
          font-size: 17px;
          font-weight: 600;
          color: #ffffff;
        }
        .auth-close-btn {
          background: none;
          color: #94a3b8;
          padding: 4px;
        }
        .auth-close-btn:hover {
          color: #ffffff;
        }
        .auth-modal-body {
          padding: 24px;
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .field-icon {
          position: absolute;
          left: 12px;
          color: #64748b;
          pointer-events: none;
        }
        .input-with-icon input {
          width: 100%;
          padding-left: 38px;
        }
        .auth-switch-text {
          text-align: center;
          font-size: 13px;
          color: #94a3b8;
        }
        .link-btn {
          background: none;
          color: #3b82f6;
          font-weight: 600;
          padding: 0;
        }
        .link-btn:hover {
          text-decoration: underline;
        }
        .profile-badge-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }
        .user-avatar-big {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #2563eb;
          color: #ffffff;
          font-size: 22px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logged-name {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }
        .logged-email {
          font-size: 13px;
          color: #94a3b8;
        }
        .points-member-card {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.25);
          padding: 14px 18px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .pts-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pts-big {
          font-size: 20px;
          font-weight: 700;
          color: #fbbf24;
          display: block;
        }
        .pts-sub {
          font-size: 11px;
          color: #d97706;
        }
        .pts-value {
          font-size: 13px;
          font-weight: 600;
          color: #f59e0b;
        }
        .member-perks-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
        }
        .perk-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: #cbd5e1;
        }
        .logout-btn {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
