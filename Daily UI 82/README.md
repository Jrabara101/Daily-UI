# Genesis — Intelligent Project Creation Wizard

A high-fidelity, context-aware form for creating new projects with advanced UI/UX features and senior-level front-end engineering.

![Genesis Form](https://via.placeholder.com/1200x600/FAFAFA/4A90E2?text=Genesis+Form)

## 🎯 Features

### UI/UX Excellence
- **Focus Mode**: Active field glows while others dim to reduce cognitive load
- **Floating Labels**: Smooth spring animations with validation icons
- **Progressive Disclosure**: Dynamic fields appear based on project type selection
- **Glassmorphic Tooltips**: Frosted glass error messages with specific guidance
- **Premium Aesthetics**: Inter typography, harmonious colors, physics-based animations

### Front-end Engineering
- **Debounced Async Validation**: Optimized API calls for project name uniqueness
- **Custom Select Component**: Full keyboard navigation (Arrow keys, Enter, Escape)
- **Input Masking**: Real-time currency formatting ($125,000)
- **Dirty State Tracker**: Prevents data loss with unsaved changes warnings
- **Local Storage**: Auto-saves form drafts for session recovery

### Accessibility
- ✅ Full keyboard navigation (Tab, Arrow keys, Enter, Escape)
- ✅ ARIA attributes for screen readers
- ✅ Logical tab index flow
- ✅ Error announcements with `aria-live`
- ✅ Focus management

## 🚀 Quick Start

1. **Open the form**
   ```
   Open index.html in your browser
   ```

2. **Interact with the form**
   - Click any field to see floating label animation
   - Select a project type to reveal dynamic fields
   - Type in budget field to see currency masking
   - Try invalid email/password to see error tooltips

## 📋 Form Fields

| Field | Type | Validation | Features |
|-------|------|------------|----------|
| **Venture Nomenclature** | Text | Async uniqueness check | Debounced validation, loading states |
| **Strategic Category** | Custom Select | Required | Keyboard navigation, progressive disclosure |
| **Capital Allocation** | Text | Required | Currency masking ($125,000) |
| **Primary Contact** | Email | Email format | Real-time validation, checkmark icon |
| **Security Credentials** | Password | Strength requirements | Specific error messages |

### Dynamic Fields (Progressive Disclosure)

**Marketing Projects:**
- Social Media Channels
- Target Audience

**SaaS Projects:**
- Technology Stack

**Enterprise Projects:**
- Department

**Research Projects:**
- Research Area

## 🎨 Design System

### Colors
```css
--color-bg-primary: #FAFAFA
--color-bg-secondary: #FFFFFF
--color-accent-blue: #4A90E2
--color-success: #4CAF50
--color-error: #E53935
--color-warning: #FFA726
```

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: 11px - 56px
- **Weights**: 300 - 700
- **Letter Spacing**: 0.05em - 0.12em

### Animations
- **Spring Transition**: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Glow Pulse**: 2s infinite on focus
- **Slide Down**: 350ms for dynamic fields
- **Checkmark Pop**: 300ms with overshoot

## 🧪 Testing Guide

### Manual Testing Checklist

1. **Floating Labels**
   - [ ] Labels float up when typing
   - [ ] Spring animation is smooth
   - [ ] Labels change color (gray → blue → green/red)

2. **Focus Mode**
   - [ ] Active field receives blue glow
   - [ ] Other fields dim to 40% opacity
   - [ ] Transition is smooth

3. **Custom Select**
   - [ ] Dropdown opens on click
   - [ ] Arrow keys navigate options
   - [ ] Enter selects, Escape closes
   - [ ] Selected value displays correctly

4. **Progressive Disclosure**
   - [ ] Marketing shows 2 extra fields
   - [ ] Other types show appropriate fields
   - [ ] Slide-down animation is smooth

5. **Input Masking**
   - [ ] Budget formats as currency
   - [ ] Cursor position preserved

6. **Validation**
   - [ ] Email shows error for invalid format
   - [ ] Password shows specific requirements
   - [ ] Project name checks uniqueness (500ms delay)
   - [ ] Checkmarks appear for valid inputs

7. **Dirty State**
   - [ ] Autosave indicator changes to "UNSAVED CHANGES"
   - [ ] Browser warns on refresh
   - [ ] Modal appears on navigation attempt

8. **Form Submission**
   - [ ] Button shows spinner
   - [ ] Button becomes disabled
   - [ ] Form validates before submit

## 💻 Code Structure

```
Daily UI 82/
├── index.html          # Semantic HTML with ARIA attributes
├── styles.css          # 650+ lines of custom CSS
└── script.js           # 440+ lines of Vanilla JavaScript
```

### Key Components

#### FormStateManager Class
Tracks form changes and manages dirty state:
```javascript
const formStateManager = new FormStateManager(form);
console.log(formStateManager.isDirty); // true/false
```

#### CustomSelect Class
Fully accessible dropdown with keyboard support:
```javascript
const select = new CustomSelect(element);
// Supports: ArrowDown, ArrowUp, Enter, Space, Escape
```

#### InputMask Class
Real-time input formatting:
```javascript
InputMask.currency(budgetInput);
// 125000 → $125,000
```

#### Debounce Utility
Optimizes expensive operations:
```javascript
const debouncedValidate = debounce(validateFunction, 500);
// Waits 500ms after user stops typing
```

## 🔧 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Required Features
- CSS Custom Properties
- CSS Grid
- Backdrop Filter (for glassmorphism)
- ES6+ JavaScript (async/await, classes, arrow functions)
- Local Storage API

## 📱 Responsive Breakpoints

```css
/* Desktop: 1024px+ */
Two-column layout, floating tooltips

/* Tablet: 640px - 1024px */
Single column, inline tooltips

/* Mobile: < 640px */
Condensed header, stacked actions
```

## 🎓 Learning Resources

### CSS Techniques Used
- Floating label pattern
- Glassmorphism with backdrop-filter
- Focus-within pseudo-class
- Custom properties for theming
- GPU-accelerated animations

### JavaScript Patterns
- Debouncing for performance
- Class-based components
- Event delegation
- Async/await for validation
- Local storage persistence

## 📄 License

This is a Daily UI challenge project for educational purposes.

## 🙏 Credits

- **Design Inspiration**: Genesis Review Board aesthetic
- **Typography**: Inter by Rasmus Andersson
- **Icons**: Unicode characters (✦, ✓, ▼, 🌐, ☁)

---

**Built with ❤️ using Vanilla HTML, CSS, and JavaScript**

No frameworks. No libraries. Just pure web fundamentals.
