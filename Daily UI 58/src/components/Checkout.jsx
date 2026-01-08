import { useState, useRef } from 'react';
import { CreditCard, Mail, MapPin, User, ArrowRight } from 'lucide-react';
import TextPressure from './reactbits/TextPressure';
import ClickSpark from './reactbits/ClickSpark';
import AnimatedContent from './reactbits/AnimatedContent';
import HyperSpeed from './reactbits/HyperSpeed';
import { useCart } from '../context/CartContext';
import { useGSAP } from '../hooks/useGSAP';

const Checkout = ({ onComplete, onBack }) => {
  const { items, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const containerRef = useRef(null);
  const [warpSpeed, setWarpSpeed] = useState(1);

  useGSAP(() => {
    if (!containerRef.current) return;
    const { gsap } = window;
    if (gsap) {
      gsap.from(containerRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  }, { scope: containerRef });

  const handleChange = (e) => {
    let value = e.target.value;
    
    // Format card number
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.slice(0, 19);
    }
    
    // Format expiry date
    if (e.target.name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
    }

    setFormData({
      ...formData,
      [e.target.name]: value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.zip) newErrors.zip = 'Zip code is required';
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Valid card number is required';
    if (!formData.cardName) newErrors.cardName = 'Cardholder name is required';
    if (!formData.expiry) newErrors.expiry = 'Expiry date is required';
    if (!formData.cvv || formData.cvv.length < 3) newErrors.cvv = 'Valid CVV is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Start warp speed animation
      setWarpSpeed(10);
      
      // Wait for animation, then complete
      setTimeout(() => {
        clearCart();
        onComplete();
      }, 2000);
    }
  };

  return (
    <section className="min-h-screen relative overflow-hidden py-20">
      <HyperSpeed 
        speed={warpSpeed} 
        color="#FF6B35" 
        opacity={Math.min(warpSpeed / 10, 0.8)} 
        intensity={Math.min(warpSpeed / 5, 2)}
      />
      
      <div ref={containerRef} className="relative z-10 container mx-auto px-6 max-w-5xl">
        <button
          onClick={onBack}
          className="text-white/60 hover:text-white mb-6 transition-colors flex items-center gap-2"
        >
          ← Back to Cart
        </button>

        <AnimatedContent delay={0.1}>
          <TextPressure intensity={0.4}>
            <h1 className="text-5xl font-display font-bold mb-2">CHECKOUT</h1>
          </TextPressure>
          <p className="text-white/60 mb-8">Complete your high-octane purchase</p>
        </AnimatedContent>

        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedContent delay={0.2}>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Shipping Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        placeholder="123 Main Street"
                      />
                    </div>
                    {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        placeholder="New York"
                      />
                      {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Zip Code</label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        placeholder="10001"
                      />
                      {errors.zip && <p className="text-red-400 text-sm mt-1">{errors.zip}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Payment Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      maxLength="19"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    />
                    {errors.cardNumber && <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      placeholder="JOHN DOE"
                    />
                    {errors.cardName && <p className="text-red-400 text-sm mt-1">{errors.cardName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry</label>
                      <input
                        type="text"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      />
                      {errors.expiry && <p className="text-red-400 text-sm mt-1">{errors.expiry}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        maxLength="4"
                        placeholder="123"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      />
                      {errors.cvv && <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </AnimatedContent>

          <AnimatedContent delay={0.3}>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 sticky top-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-white/10">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      {item.customization && (
                        <p className="text-sm text-white/60">
                          {item.customization.size && `Size: ${item.customization.size}`}
                          {item.customization.color && ` • `}
                          {item.customization.color && (
                            <span
                              className="inline-block w-3 h-3 rounded-full border border-white/30"
                              style={{ backgroundColor: item.customization.color }}
                            />
                          )}
                        </p>
                      )}
                      <p className="text-sm text-white/60">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <ClickSpark sparkColor="#FF6B35" sparkCount={16}>
                <button
                  type="button"
                  onClick={(e) => {
                    const form = document.getElementById('checkout-form');
                    if (form) {
                      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                      form.dispatchEvent(submitEvent);
                    }
                    handleSubmit(e);
                  }}
                  className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  COMPLETE PURCHASE
                  <ArrowRight className="w-5 h-5" />
                </button>
              </ClickSpark>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
};

export default Checkout;

