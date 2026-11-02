import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_BOOKS, INITIAL_REVIEWS, INITIAL_ORDERS } from '../data/booksData';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [books] = useState(INITIAL_BOOKS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [formatFilter, setFormatFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');

  // Navigation views: 'home' | 'product-detail' | 'cart-checkout' | 'confirmation' | 'orders' | 'wishlist'
  const [currentView, setCurrentView] = useState('home');
  const [selectedBookId, setSelectedBookId] = useState('book-7'); // Default to 'Joy of Minimalism'

  // Pre-seed cart with 2 items from wireframe image13.png
  // Pre-seed cart with 2 items matching wireframe
  const [cart, setCart] = useState([
    {
      id: 'book-7',
      book: INITIAL_BOOKS.find((b) => b.id === 'book-7'),
      quantity: 1,
      price: 14.99
    },
    {
      id: 'book-3',
      book: INITIAL_BOOKS.find((b) => b.id === 'book-3'),
      quantity: 1,
      price: 22.50
    }
  ]);

  const [wishlist, setWishlist] = useState(['book-1', 'book-5']);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // Authentication & Member Profile
  const [user, setUser] = useState({
    isAuthenticated: true,
    name: 'Daniel Reed',
    email: 'daniel.reed@example.com',
    giftPoints: 500, // 500 gift points available ($10 value)
    phone: '+1 (415) 555-2671'
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Delivery Address
  const [address, setAddress] = useState({
    useSaved: true,
    firstName: 'Daniel',
    lastName: 'Reed',
    addressLine2: '742 Evergreen Terrace, Apt 12B',
    email: 'daniel.reed@example.com',
    city: 'San Francisco',
    pin: '94107',
    countryCode: '+1',
    phoneNumber: '4155552671',
    state: 'California',
    country: 'United States'
  });

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState({
    code: 'WELCOME10',
    discount: 10.00,
    applied: true
  });

  const [useGiftPoints, setUseGiftPoints] = useState(false);

  // Navigation Helpers
  const navigateTo = (view, bookId = null) => {
    if (bookId) setSelectedBookId(bookId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (book, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: book.id, book, quantity, price: book.price }];
    });
  };

  const updateQuantity = (bookId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === bookId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => prev.filter((item) => item.id !== bookId));
  };

  const clearCart = () => setCart([]);

  // Wishlist operations
  const toggleWishlist = (bookId) => {
    setWishlist((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  // Review submission
  const addReview = (bookId, { rating, comment, reviewerName }) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      reviewerName: reviewerName || user.name || 'Anonymous Reader',
      rating,
      comment,
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };
    setReviews((prev) => ({
      ...prev,
      [bookId]: [newRev, ...(prev[bookId] || [])]
    }));
  };

  // Financial calculations (in USD $)
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const tax = useMemo(() => {
    return Math.round(cartSubtotal * 0.08 * 100) / 100; // 8% sales tax
  }, [cartSubtotal]);

  const deliveryCharges = cartSubtotal >= 35 || cartSubtotal === 0 ? 0 : 3.99;

  const couponDiscount = appliedCoupon.applied ? appliedCoupon.discount : 0;
  // 500 gift points = $10.00 discount ($0.02 per point)
  const giftPointsDiscount = useGiftPoints ? Math.min(user.giftPoints * 0.02, cartSubtotal) : 0;

  const grandTotal = useMemo(() => {
    const raw = cartSubtotal + tax + deliveryCharges - couponDiscount - giftPointsDiscount;
    return Math.max(0, Math.round(raw * 100) / 100);
  }, [cartSubtotal, tax, deliveryCharges, couponDiscount, giftPointsDiscount]);

  // Place Order
  const placeOrder = (paymentMethod = 'Credit Card') => {
    const now = new Date();
    const cancellationDeadline = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 Hours

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `BW-${Math.floor(10000 + Math.random() * 90000)}`,
      date: now.toISOString(),
      status: 'Confirmed',
      cancellationDeadline: cancellationDeadline.toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      tax,
      deliveryCharges,
      discount: couponDiscount + giftPointsDiscount,
      totalAmount: grandTotal,
      deliveryAddress: `${address.addressLine2}, ${address.city}, ${address.state} - ${address.pin}`,
      paymentMethod,
      trackingNumber: `BW-TRK-${Math.floor(100000 + Math.random() * 900000)}`
    };

    if (useGiftPoints && giftPointsDiscount > 0) {
      setUser((prev) => ({
        ...prev,
        giftPoints: Math.max(0, prev.giftPoints - giftPointsDiscount)
      }));
    }

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    setCart([]);
    setIsPaymentModalOpen(false);
    setCurrentView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Order within 48 Hours
  const cancelOrder = (orderId, reason = 'Customer requested cancellation') => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const isWithin48h = new Date() < new Date(ord.cancellationDeadline);
          if (!isWithin48h) {
            alert('Cancellation window has expired (exceeded 48 hours).');
            return ord;
          }
          return {
            ...ord,
            status: 'Cancelled',
            cancelledAt: new Date().toISOString(),
            cancellationReason: reason
          };
        }
        return ord;
      })
    );
  };

  // Buy It Again Feature (Slide 5, 8, 10)
  const buyItAgain = (orderId) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    targetOrder.items.forEach((item) => {
      addToCart(item.book || item, item.quantity);
    });

    navigateTo('cart-checkout');
  };

  // Filtered & Sorted Books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Category filter
      if (activeCategory !== 'All' && book.category !== activeCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(q);
        const matchesAuthor = book.author.toLowerCase().includes(q);
        const matchesTags = book.tags.some((t) => t.toLowerCase().includes(q));
        const matchesSynopsis = book.synopsis.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor && !matchesTags && !matchesSynopsis) {
          return false;
        }
      }

      // Language
      if (languageFilter !== 'All' && book.language !== languageFilter) {
        return false;
      }

      // Format
      if (formatFilter !== 'All' && book.format !== formatFilter) {
        return false;
      }

      // Price range (USD)
      if (priceFilter === 'under-15' && book.price >= 15) return false;
      if (priceFilter === '15-25' && (book.price < 15 || book.price > 25)) return false;
      if (priceFilter === '25-35' && (book.price < 25 || book.price > 35)) return false;
      if (priceFilter === 'above-35' && book.price <= 35) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.publishedYear || 0) - (a.publishedYear || 0);
      return 0; // relevance
    });
  }, [books, activeCategory, searchQuery, languageFilter, formatFilter, priceFilter, sortBy]);

  const value = {
    books,
    filteredBooks,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    languageFilter,
    setLanguageFilter,
    formatFilter,
    setFormatFilter,
    priceFilter,
    setPriceFilter,
    sortBy,
    setSortBy,
    currentView,
    setCurrentView,
    navigateTo,
    selectedBookId,
    setSelectedBookId,
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
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
    wishlist,
    toggleWishlist,
    reviews,
    addReview,
    orders,
    placeOrder,
    cancelOrder,
    buyItAgain,
    lastPlacedOrder,
    user,
    setUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    address,
    setAddress
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
