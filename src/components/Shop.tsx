import React, { useState } from 'react';
import { ProductModal } from './shop/ProductModal';
import { CartModal } from './shop/CartModal';
import { useCart } from '../hooks/useCart';

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Shop({ isOpen, onClose }: ShopProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(true);

  const openCart = () => {
    setIsProductsOpen(false);
    setIsCartOpen(true);
  };

  const openProducts = () => {
    setIsCartOpen(false);
    setIsProductsOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Products Modal */}
      <ProductModal
        isOpen={isProductsOpen}
        onClose={onClose}
        onCartClick={openCart}
      />

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={onClose}
        onShopClick={openProducts}
      />
    </>
  );
}