import { useState, useRef } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import TextPressure from './reactbits/TextPressure';
import ClickSpark from './reactbits/ClickSpark';
import AnimatedContent from './reactbits/AnimatedContent';
import { useCart } from '../context/CartContext';
import { useGSAP } from '../hooks/useGSAP';

const ProductCustomizer = ({ product, onClose }) => {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const { gsap } = window;
    if (gsap) {
      gsap.from(containerRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
    }
  }, { scope: containerRef });

  const handleAddToCart = (e) => {
    const cartIcon = document.querySelector('[data-cart-icon]');
    
    if (imageRef.current && cartIcon && window.gsap) {
      const imgRect = imageRef.current.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();
      const clone = imageRef.current.cloneNode(true);
      
      clone.style.position = 'fixed';
      clone.style.top = `${imgRect.top}px`;
      clone.style.left = `${imgRect.left}px`;
      clone.style.width = `${imgRect.width}px`;
      clone.style.height = `${imgRect.height}px`;
      clone.style.zIndex = '9999';
      clone.style.pointerEvents = 'none';
      clone.style.objectFit = 'cover';
      
      document.body.appendChild(clone);
      
      window.gsap.to(clone, {
        x: cartRect.left - imgRect.left + cartRect.width / 2 - imgRect.width / 2,
        y: cartRect.top - imgRect.top + cartRect.height / 2 - imgRect.height / 2,
        scale: 0.2,
        rotation: 360,
        duration: 0.6,
        ease: 'power2.in',
        onComplete: () => {
          document.body.removeChild(clone);
          // Add item with quantity
          addItem(product, { size: selectedSize, color: selectedColor }, quantity);
          onClose();
        }
      });
    } else {
      // Add item with quantity
      addItem(product, { size: selectedSize, color: selectedColor }, quantity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div
        ref={containerRef}
        className="relative bg-dark border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          <AnimatedContent delay={0.1}>
            <div className="relative aspect-square">
              <img
                ref={imageRef}
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </AnimatedContent>

          <div className="space-y-6">
            <AnimatedContent delay={0.2}>
              <TextPressure intensity={0.4}>
                <h2 className="text-3xl font-display font-bold mb-2">{product.name}</h2>
              </TextPressure>
              <p className="text-2xl font-bold text-primary mb-4">${product.price}</p>
              <p className="text-white/60">{product.description}</p>
            </AnimatedContent>

            <AnimatedContent delay={0.3}>
              <div>
                <label className="block text-sm font-medium mb-3">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedSize === size
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white/5 border-white/10 hover:border-primary/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent delay={0.4}>
              <div>
                <label className="block text-sm font-medium mb-3">Color</label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? 'border-white scale-110 ring-2 ring-primary'
                          : 'border-white/30 hover:border-white/50'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent delay={0.5}>
              <div>
                <label className="block text-sm font-medium mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent delay={0.6}>
              <ClickSpark sparkColor={product.primaryColor} sparkCount={12}>
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  ADD TO CART - ${(product.price * quantity).toFixed(2)}
                </button>
              </ClickSpark>
            </AnimatedContent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizer;
