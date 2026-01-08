import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import TextPressure from './reactbits/TextPressure';
import ClickSpark from './reactbits/ClickSpark';
import AnimatedContent from './reactbits/AnimatedContent';
import HyperSpeed from './reactbits/HyperSpeed';

const SignUp = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Handle signup logic here
      alert('Sign up successful! Welcome to Velocity Vibe!');
      onBack();
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
      <HyperSpeed speed={0.5} color="#004E89" opacity={0.2} />
      
      <AnimatedContent delay={0.2}>
        <div className="relative z-10 w-full max-w-md mx-6">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            <button
              onClick={onBack}
              className="text-white/60 hover:text-white mb-6 transition-colors"
            >
              ← Back
            </button>

            <TextPressure intensity={0.4}>
              <h2 className="text-4xl font-display font-bold mb-2">JOIN THE VIBE</h2>
            </TextPressure>
            <p className="text-white/60 mb-8">Create your account and get exclusive access</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatedContent delay={0.3}>
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
              </AnimatedContent>

              <AnimatedContent delay={0.4}>
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
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
              </AnimatedContent>

              <AnimatedContent delay={0.5}>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                </div>
              </AnimatedContent>

              <AnimatedContent delay={0.6}>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </AnimatedContent>

              <AnimatedContent delay={0.7}>
                <ClickSpark sparkColor="#FF6B35" sparkCount={12}>
                  <button
                    type="submit"
                    className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    CREATE ACCOUNT
                  </button>
                </ClickSpark>
              </AnimatedContent>
            </form>
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
};

export default SignUp;
