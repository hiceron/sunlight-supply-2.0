import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { AuthModal } from '../auth/AuthModal';
import { CheckoutForm } from './CheckoutForm';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShopClick: () => void;
}

export function CartModal({ isOpen, onClose, onShopClick }: CartModalProps) {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setIsCheckoutOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <div className="flex items-center space-x-6">
                <button
                  onClick={onShopClick}
                  className="flex items-center space-x-2 text-[#0056b3] hover:text-[#004494] transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium">Continue Shopping</span>
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {cartItems.length === 0 ? (
                <div className="text-center space-y-4">
                  <p className="text-gray-500">Your cart is empty</p>
                  <button
                    onClick={onShopClick}
                    className="inline-flex items-center space-x-2 text-[#0056b3] hover:text-[#004494] transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span className="font-medium">Start Shopping</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.selectedColor}`}
                      className="flex items-center justify-between py-4 border-b"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: item.selectedColor }}
                        />
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            ${item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item, Number(e.target.value))
                          }
                          className="border border-gray-300 rounded px-2 py-1"
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeFromCart(item)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full mt-4 bg-[#ff9900] hover:bg-[#e68a00] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      {isLoggedIn ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutForm
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </>
  );
}