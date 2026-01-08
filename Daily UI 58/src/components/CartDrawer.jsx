import { useRef, useEffect } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useGSAP } from '../hooks/useGSAP';
import ClickSpark from './reactbits/ClickSpark';

const CartDrawer = ({ isOpen, onClose, onCheckout }) => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  const cartItemsRef = useRef([]);

  useGSAP(() => {
    if (!drawerRef.current || !overlayRef.current) return;
    const { gsap } = window;
    if (!gsap) return;

    if (isOpen) {
      // Open animation
      const tl = gsap.timeline();
      
      tl.set([drawerRef.current, overlayRef.current], { display: 'block' })
        .to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
        .to(drawerRef.current, {
          x: 0,
          duration: 0.5,
          ease: 'back.out(1.7)'
        }, '-=0.2')
        .from(cartItemsRef.current, {
          x: 50,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out'
        }, '-=0.3');
    } else {
      // Close animation
      const tl = gsap.timeline();
      
      tl.to(drawerRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power2.in'
      })
        .to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        }, '-=0.2')
        .set([drawerRef.current, overlayRef.current], { display: 'none' });
    }
  }, { dependencies: [isOpen, items.length] });

  useEffect(() => {
    // Update cart items refs
    cartItemsRef.current = cartItemsRef.current.slice(0, items.length);
  }, [items.length]);

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
        style={{ display: 'none' }}
      />
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-dark border-l border-white/10 z-50 overflow-y-auto"
        style={{ transform: 'translateX(100%)', display: 'none' }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">YOUR CART</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 mb-4">Your cart is empty</p>
              <ClickSpark sparkColor="#FF6B35">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  START SHOPPING
                </button>
              </ClickSpark>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item, index) => {
                  const itemRef = (el) => {
                    if (el) cartItemsRef.current[index] = el;
                  };
                  
                  return (
                    <div
                      key={`${item.id}-${index}`}
                      ref={itemRef}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">{item.name}</h3>
                          {item.customization && (
                            <p className="text-sm text-white/60 mb-2">
                              {item.customization.size && `Size: ${item.customization.size}`}
                              {item.customization.color && ` • Color: `}
                              {item.customization.color && (
                                <span
                                  className="inline-block w-4 h-4 rounded-full border border-white/30"
                                  style={{ backgroundColor: item.customization.color }}
                                />
                              )}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-white/10 rounded"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-white/10 rounded"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-1 hover:bg-red-500/20 rounded text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>TOTAL</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
                <ClickSpark sparkColor="#FF6B35" sparkCount={12}>
                  <button
                    onClick={() => {
                      onClose();
                      if (onCheckout) onCheckout();
                    }}
                    className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    CHECKOUT
                  </button>
                </ClickSpark>
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-white/60 hover:text-white transition-colors text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
