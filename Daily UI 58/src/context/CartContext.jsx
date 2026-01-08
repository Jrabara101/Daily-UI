import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [cartSpeed, setCartSpeed] = useState(1);

  const addItem = useCallback((product, customization = {}, quantity = 1) => {
    setItems(prev => {
      const existingItem = prev.find(
        item => item.id === product.id && 
        JSON.stringify(item.customization) === JSON.stringify(customization)
      );

      if (existingItem) {
        return prev.map(item =>
          item.id === product.id && JSON.stringify(item.customization) === JSON.stringify(customization)
            ? { ...item, quantity: item.quantity + (quantity || 1) }
            : item
        );
      }

      return [...prev, { ...product, quantity, customization }];
    });

    // Increase speed based on cart size
    setCartSpeed(prev => Math.min(prev + 0.2, 3));
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.id !== itemId);
      setCartSpeed(Math.max(1, Math.min(newItems.length * 0.2 + 1, 3)));
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setCartSpeed(1);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        totalItems,
        totalPrice,
        cartSpeed
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
