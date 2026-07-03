# Component Development Guide

## 🎨 UI Component System

### Creating a New Component

#### 1. Button-like Component
```jsx
import React from 'react';
import styles from './MyComponent.module.css';

export function MyComponent({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) {
  const buttonClass = `
    ${styles.component}
    ${styles[`variant-${variant}`]}
    ${styles[`size-${size}`]}
    ${className}
  `.trim();

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}
```

#### 2. Container Component
```jsx
import React from 'react';
import styles from './Container.module.css';

export function Container({ children, className = '', ...props }) {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      {children}
    </div>
  );
}
```

### CSS Module Best Practices

#### Good ✅
```css
.button {
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.2s;
}

.button:hover {
  background: #f3f4f6;
}
```

#### Avoid ❌
```css
button {  /* Global selector */
  padding: 10px;
}

.button button {  /* Nested selectors */
  color: red;
}
```

## 🎯 Naming Conventions

### Files
- Components: `PascalCase.js` (e.g., `ChatMessage.js`)
- Styles: `PascalCase.module.css` (e.g., `ChatMessage.module.css`)
- Pages: `PascalCase.js` (e.g., `ChatPage.js`)
- Utils: `camelCase.js` (e.g., `messageUtils.js`)

### CSS Classes
- `.component-name` for main component
- `.component-name-section` for sections
- `.is-active`, `.is-loading` for states
- `--color-primary` for CSS variables

### Props
- `isActive`, `isLoading` (boolean)
- `variant`, `size` (string)
- `onClick`, `onChange` (handlers)
- `className` (style overrides)

## 🔧 Testing Components

### Test a Button Variant
```jsx
import { Button } from './ui/Button';

function ButtonTest() {
  return (
    <div style={{ display: 'flex', gap: '10px', padding: '20px' }}>
      <Button variant="default">Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="success">Success</Button>
      <Button variant="emergency">Emergency</Button>
      <Button variant="outline" disabled>Disabled</Button>
    </div>
  );
}
```

## 📱 Responsive Design

### Breakpoints
```css
/* Desktop: 1024px and up */
.desktop-only {
  display: block;
}

/* Tablet: 768px to 1023px */
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  .tablet-visible {
    display: block;
  }
}

/* Mobile: Below 480px */
@media (max-width: 480px) {
  .mobile-full-width {
    width: 100%;
  }
}
```

## ♿ Accessibility Checklist

- [ ] Semantic HTML (`button`, `input`, `label`)
- [ ] ARIA labels for icons
- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Text alternatives for images
- [ ] Reduced motion support
- [ ] Touch target size ≥ 44x44px

### Example with Accessibility
```jsx
import { Button } from './ui/Button';

export function AccessibleButton() {
  return (
    <Button 
      aria-label="Send message"
      aria-pressed="false"
      onClick={handleClick}
    >
      Send
    </Button>
  );
}
```

## 🎨 Styling Best Practices

### Use CSS Variables
```css
:root {
  --color-primary: #16a34a;
  --color-primary-dark: #15803d;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --radius-sm: 4px;
  --radius-md: 8px;
}

.button {
  padding: var(--spacing-md);
  background: var(--color-primary);
  border-radius: var(--radius-md);
}
```

### Consistent Spacing
```css
/* Use 8px grid */
.small { padding: 8px; }      /* 1x */
.medium { padding: 16px; }    /* 2x */
.large { padding: 24px; }     /* 3x */
.xlarge { padding: 32px; }    /* 4x */
```

### Animations
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.component {
  animation: fadeIn 0.3s ease;
}

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .component {
    animation: none;
  }
}
```

## 🚀 Performance Tips

1. **Use CSS Modules** - Avoid global style conflicts
2. **Minimize Reflows** - Batch DOM updates
3. **Lazy Load Components** - Use React.lazy() for large components
4. **Optimize Images** - Use appropriate formats and sizes
5. **Cache Static Assets** - Leverage browser caching
6. **Minify CSS/JS** - Production build handles this

## 📚 Component Examples

### Alert Component Usage
```jsx
import { Alert } from './components/Alert';

<Alert 
  type="error"
  title="Error"
  message="Failed to send message"
  onClose={() => setShowAlert(false)}
/>
```

### Toast Component Usage
```jsx
import { ToastContainer, Toast } from './components/Toast';

const [toasts, setToasts] = useState([]);

const addToast = (message, type) => {
  setToasts(prev => [...prev, {
    id: Date.now(),
    message,
    type
  }]);
};

return (
  <ToastContainer 
    toasts={toasts}
    onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
  />
);
```

### Card Component Usage
```jsx
import { Card, CardHeader, CardContent, CardFooter } from './components/Card';

<Card>
  <CardHeader>
    <h3>Support Resources</h3>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    <button>Close</button>
  </CardFooter>
</Card>
```

## 🔄 Component Lifecycle

### Mounting
1. Import component
2. Initialize state
3. Set up effects
4. Render UI

### Updating
1. State/props change
2. Re-render
3. Update DOM
4. Trigger effects

### Unmounting
1. Clean up effects
2. Remove event listeners
3. Clear timers
4. Component removed

## 🐛 Debugging

### Common Issues

**Styles not applying?**
```css
/* Check if CSS Module is imported */
import styles from './Component.module.css';
/* Use className={styles.className} not className="className" */
```

**Component not updating?**
```jsx
/* Use functional updates for state depending on previous state */
setItems(prev => [...prev, newItem]); // Good
setItems([...items, newItem]);       // Bad if items changed
```

**Event handler not firing?**
```jsx
/* Bind methods or use arrow functions */
<button onClick={() => handleClick()}>Click</button>  // Good
<button onClick={handleClick}>Click</button>           // Also good with arrow function

// Class component needs binding
constructor(props) {
  this.handleClick = this.handleClick.bind(this);
}
```

## 📖 Further Reading

- [React Documentation](https://react.dev)
- [CSS Tricks](https://css-tricks.com)
- [Web Accessibility](https://www.w3.org/WAI/)
- [MDN Web Docs](https://developer.mozilla.org)

---

**Happy component building! 🎨**
