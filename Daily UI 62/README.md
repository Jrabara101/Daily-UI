# Daily UI 62 - The Velocity Ticket: Dynamic Coupon System

A high-fidelity, interactive coupon component with advanced features including click-to-copy functionality, confetti animations, countdown timer, and state persistence.

## ✨ Features

### Visual Design
- **Physical Ticket Aesthetic**: CSS clip-path implementation with cut-out notches on the sides
- **Neumorphic & Glassmorphic Blend**: Soft shadows and subtle gradients for a premium look
- **3D Kinetic Hover Effects**: Subtle tilt and lift animation on hover using CSS perspective
- **Animated Perforation**: Dashed line glows and animates when ready to copy

### Functionality
- **Click-to-Copy**: Modern `navigator.clipboard` API with fallback support for older browsers
- **Visual Feedback**: Animated "COPIED!" text transformation with success indicators
- **Confetti Burst**: Lightweight particle animation triggered on successful copy
- **Dynamic Countdown Timer**: 24-hour expiration timer with real-time updates
- **State Persistence**: localStorage integration to remember claimed status across page refreshes

### Accessibility
- Semantic HTML structure
- ARIA labels and roles for screen readers
- Keyboard navigation support (Enter/Space)
- Focus indicators for keyboard users
- Reduced motion support

### Error Handling
- Fallback copy method for browsers without clipboard API support
- Error messages for failed copy attempts
- Expiration state handling with visual feedback

## 🚀 Getting Started

1. Open `index.html` in a modern web browser
2. Click on the coupon to copy the code
3. Watch the confetti animation and visual feedback
4. The coupon status is saved in localStorage

## 📁 File Structure

```
Daily UI 62/
├── index.html      # Semantic HTML structure
├── styles.css      # Advanced CSS with animations and effects
├── script.js       # Vanilla JavaScript implementation
└── README.md       # This file
```

## 🎨 Design Specifications

### Color Palette
- Primary Blue: `#007bff`
- Background Soft: `#f4f7f6`
- Success Green: `#28a745`
- Text Primary: `#2c3e50`

### Typography
- Font Family: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)
- Code Font: 'Courier New', monospace

## 🔧 Technical Implementation

### CSS Techniques
- `clip-path` for ticket notches
- CSS Variables for theming
- `transform-style: preserve-3d` for 3D effects
- CSS animations and transitions
- Responsive design with media queries

### JavaScript Features
- ES6+ class-based architecture
- Async/await for clipboard operations
- Event delegation
- LocalStorage state management
- Timer-based countdown logic
- Dynamic confetti particle system

## 📱 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Fallback support for older browsers (IE11+)
- Mobile responsive design

## ♿ Accessibility Features

- WCAG 2.1 AA compliant
- Screen reader compatible
- Keyboard navigable
- Focus indicators
- ARIA labels and roles
- Reduced motion support

## 🎯 Usage

The coupon automatically:
- Starts a 24-hour countdown timer
- Saves state to localStorage
- Handles copy operations
- Shows visual feedback
- Manages expiration states

## 🔄 State Management

The coupon state is saved in localStorage with:
- Copy status (whether code has been copied)
- Expiration time (24 hours from first visit)

To reset the coupon, clear localStorage:
```javascript
localStorage.removeItem('coupon_state');
```

## 📝 Notes

- The coupon expires 24 hours after first visit
- Once copied, the coupon is marked as "Claimed"
- The confetti animation uses lightweight CSS animations
- All animations respect `prefers-reduced-motion` settings

