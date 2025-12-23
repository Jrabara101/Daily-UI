# Advanced Toast Notification System

A production-grade, stackable notification (toast) system built with React, TypeScript, CSS Modules, and Framer Motion.

## Features

- ✅ **Stackable Notifications** - Support for multiple notifications visible at once (max 5)
- ✅ **Four Variants** - Success, Error, Warning, and Info with distinct visual styles and icons
- ✅ **Smooth Animations** - Slide-in from right and fade-out animations using Framer Motion
- ✅ **Progress Bar** - Visual countdown timer showing remaining time
- ✅ **Pause on Hover** - Auto-dismiss timer pauses when user hovers over notification
- ✅ **Manual Close** - Dismissible with close (X) button
- ✅ **React Portal** - Rendered at document body level to avoid z-index issues
- ✅ **Accessibility** - ARIA roles and screen-reader friendly
- ✅ **TypeScript** - Fully typed with comprehensive type definitions
- ✅ **CSS Modules** - Scoped styles with camelCase naming
- ✅ **Memory Leak Prevention** - Proper cleanup of timers and effects

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Usage

### Basic Setup

Wrap your app with the `NotificationProvider`:

```tsx
import { NotificationProvider } from './context/NotificationContext';
import { NotificationContainer } from './components/NotificationContainer/NotificationContainer';

function App() {
  return (
    <NotificationProvider>
      <YourApp />
      <NotificationContainer />
    </NotificationProvider>
  );
}
```

### Triggering Notifications

Use the `useNotification` hook in any component:

```tsx
import { useNotification } from './hooks/useNotification';

function MyComponent() {
  const notify = useNotification();

  const handleSuccess = () => {
    notify.success('Operation completed successfully!');
  };

  const handleError = () => {
    notify.error('Something went wrong!');
  };

  // Or use the generic notify function
  const handleCustom = () => {
    notify('Custom message', { type: 'info', duration: 3000 });
  };

  return (
    <button onClick={handleSuccess}>Show Success</button>
  );
}
```

### Notification Options

```tsx
interface NotificationOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // in milliseconds (0 = persistent)
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  dismissible?: boolean; // show close button (default: true)
  pauseOnHover?: boolean; // pause timer on hover (default: true)
}
```

### Convenience Methods

The `useNotification` hook provides convenience methods:

```tsx
const notify = useNotification();

notify.success('Success message');
notify.error('Error message');
notify.warning('Warning message');
notify.info('Info message');
```

### Advanced Examples

```tsx
// Persistent notification (no auto-dismiss)
notify.info('This will not auto-dismiss', { duration: 0 });

// Custom duration
notify.success('Custom duration', { duration: 10000 });

// No pause on hover
notify.info('Timer continues on hover', { pauseOnHover: false });

// Not dismissible
notify.error('Must wait for auto-dismiss', { dismissible: false });
```

## Architecture

### Components

- **NotificationProvider** - Context provider managing notification state
- **NotificationContainer** - Container component using React Portal for rendering
- **Toast** - Individual notification component with animations and progress bar
- **useNotification** - Custom hook for triggering notifications

### File Structure

```
src/
├── components/
│   ├── Toast/
│   │   ├── Toast.tsx
│   │   └── Toast.module.css
│   ├── NotificationContainer/
│   │   ├── NotificationContainer.tsx
│   │   └── NotificationContainer.module.css
│   └── Demo/
│       ├── Demo.tsx
│       └── Demo.module.css
├── context/
│   └── NotificationContext.tsx
├── hooks/
│   └── useNotification.ts
├── types/
│   └── notification.ts
├── App.tsx
├── App.module.css
├── main.tsx
└── index.css
```

## Stacking Logic

The system supports up to 5 visible notifications. When a 6th notification is added, the oldest notification is automatically removed to maintain the limit.

## Accessibility

- Uses appropriate ARIA roles (`role="alert"` for errors, `role="status"` for others)
- `aria-live="polite"` for announcements
- `aria-atomic="true"` for complete message reading
- Close buttons include `aria-label` attributes
- Icons marked with `aria-hidden="true"`

## Browser Support

Modern browsers with support for:
- React 18+
- CSS Modules
- ES2020 features

## License

MIT

