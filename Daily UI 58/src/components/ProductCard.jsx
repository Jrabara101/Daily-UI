import { useRef, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import TextPressure from './reactbits/TextPressure';
import ClickSpark from './reactbits/ClickSpark';
import AnimatedContent from './reactbits/AnimatedContent';
import { useCart } from '../context/CartContext';
import { useGSAP } from '../hooks/useGSAP';

const ProductCard = ({ product, index, onCustomize }) => {
  const { addItem } = useCart();
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    // Fly-to-cart animation
    if (imageRef.current && window.gsap) {
      const imgRect = imageRef.current.getBoundingClientRect();
      const cartIcon = document.querySelector('[data-cart-icon]');
      
      if (cartIcon) {
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
            addItem(product, { size: product.sizes[0], color: product.colors[0] });
          }
        });
      } else {
        addItem(product, { size: product.sizes[0], color: product.colors[0] });
      }
    } else {
      addItem(product, { size: product.sizes[0], color: product.colors[0] });
    }
  };

  useGSAP(() => {
    if (!cardRef.current) return;
    const { gsap } = window;
    if (gsap) {
      gsap.from(cardRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'back.out(1.7)'
      });
    }
  }, { scope: cardRef, dependencies: [index] });

  return (
    <AnimatedContent delay={index * 0.1} from={{ y: 100, opacity: 0 }} to={{ y: 0, opacity: 1 }}>
      <div
        ref={cardRef}
        className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onCustomize(product)}
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            ref={imageRef}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-4">
          <TextPressure intensity={0.3}>
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
          </TextPressure>
          <p className="text-white/60 text-sm mb-4 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">${product.price}</span>
            <ClickSpark sparkColor={product.primaryColor} sparkCount={8}>
              <button
                onClick={handleAddToCart}
                className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                aria-label="Add to cart"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </ClickSpark>
          </div>
        </div>
      </div>
    </AnimatedContent>
  );
};

export default ProductCard;
