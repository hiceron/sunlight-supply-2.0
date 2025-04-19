import React, { useState, useEffect } from 'react';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { Link } from './Link';
import { Shop } from './Shop';
import { Profile } from './Profile';
import { AuthModal } from './auth/AuthModal';
import { auth } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const { cartCount } = useCart();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleProfileClick = () => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        setIsProfileOpen(true);
      }
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (isAdmin) {
      navigate('/admin');
    } else {
      setIsProfileOpen(true);
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#0056b3] shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/icons/sunlight_supply_logo.png" 
              alt="Sunlight Supply Logo" 
              className="h-12 w-auto"
              style={{ objectFit: 'contain' }}
            />
            <span className="text-white font-bold text-xl">Sunlight Supply</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Home', 'About Us', 'Sustainability', 'Clients & Partners', 'Export', 'Contact Us'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="text-white hover:text-[#ff9900] transition-colors"
              >
                {item}
              </Link>
            ))}
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Shop Button */}
              <button
                onClick={() => setIsShopOpen(true)}
                className="relative text-white hover:text-[#ff9900] transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff9900] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile Button */}
              <button
                onClick={handleProfileClick}
                className="text-white hover:text-[#ff9900] transition-colors"
                aria-label={user ? 'View Profile' : 'Sign In'}
              >
                <User className="w-6 h-6" />
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4">
            {['Home', 'About Us', 'Sustainability', 'Clients & Partners', 'Export', 'Contact Us'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="block py-2 text-white hover:text-[#ff9900] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="flex items-center space-x-4 py-2">
              {/* Mobile Shop Button */}
              <button
                onClick={() => {
                  setIsShopOpen(true);
                  setIsMenuOpen(false);
                }}
                className="relative text-white hover:text-[#ff9900] transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff9900] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Profile Button */}
              <button
                onClick={() => {
                  handleProfileClick();
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-[#ff9900] transition-colors"
                aria-label={user ? 'View Profile' : 'Sign In'}
              >
                <User className="w-6 h-6" />
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Modals */}
      {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}
      {isShopOpen && (
        <Shop
          isOpen={isShopOpen}
          onClose={() => setIsShopOpen(false)}
        />
      )}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </header>
  );
}