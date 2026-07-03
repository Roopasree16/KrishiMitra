# 🎨 UI Component Reference Guide

## Component Showcase & Usage Examples

### 📚 Table of Contents
1. [Buttons](#buttons)
2. [Badges](#badges)
3. [Messages](#messages)
4. [Modals](#modals)
5. [Forms](#forms)
6. [Cards](#cards)
7. [Alerts](#alerts)
8. [Colors](#colors)
9. [Spacing](#spacing)
10. [Animations](#animations)

---

## Buttons

### Button Variants

#### Default Button
```jsx
import { Button } from './components/ui/Button';

<Button variant="default">Default Button</Button>
```
- Background: #16a34a (Green)
- Hover: #15803d (Dark Green)
- Use for: Primary actions

#### Primary Button
```jsx
<Button variant="primary">Primary Button</Button>
```
- Background: #0ea5e9 (Blue)
- Hover: #0284c7 (Dark Blue)
- Use for: Secondary actions

#### Secondary Button
```jsx
<Button variant="secondary">Secondary Button</Button>
```
- Background: #f3f4f6 (Light Gray)
- Border: #d1d5db (Gray border)
- Use for: Alternative actions

#### Ghost Button
```jsx
<Button variant="ghost">Ghost Button</Button>
```
- Background: Transparent
- Use for: Subtle actions, navigation

#### Outline Button
```jsx
<Button variant="outline">Outline Button</Button>
```
- Background: White
- Border: #d1d5db (Gray border)
- Use for: Important but not primary

#### Emergency Button
```jsx
<Button variant="emergency">Emergency Button</Button>
```
- Background: #dc2626 (Red)
- Hover: #b91c1c (Dark Red)
- Use for: Crisis, alerts

#### Success Button
```jsx
<Button variant="success">Success Button</Button>
```
- Background: #10b981 (Green)
- Hover: #059669 (Dark Green)
- Use for: Confirmations

#### Warning Button
```jsx
<Button variant="warning">Warning Button</Button>
```
- Background: #f59e0b (Yellow)
- Hover: #d97706 (Dark Yellow)
- Use for: Warnings

### Button Sizes

#### Small Button
```jsx
<Button size="sm">Small</Button>
// 6px 12px padding, 14px font
```

#### Medium Button
```jsx
<Button size="md">Medium</Button>
// 10px 16px padding, 15px font (default)
```

#### Large Button
```jsx
<Button size="lg">Large</Button>
// 12px 24px padding, 16px font
```

#### Icon Button
```jsx
<Button size="icon">
  <MicIcon />
</Button>
// 40x40px square, circular
```

### Button States

#### Disabled State
```jsx
<Button disabled>Disabled Button</Button>
// opacity: 0.5, cursor: not-allowed
```

#### Loading State
```jsx
<Button disabled>
  <LoadingDots />
  Sending...
</Button>
```

---

## Badges

### Badge Variants

```jsx
import { Badge } from './components/ui/Badge';

<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="emergency">Emergency</Badge>
```

### Badge Usage Examples

#### Language Badge
```jsx
<Badge variant="secondary" className="flex items-center gap-1">
  <Globe className="h-3 w-3" />
  हिंदी (Hindi)
</Badge>
```

#### Status Badge
```jsx
<Badge variant="success" className="flex items-center gap-1">
  <CheckCircle className="h-3 w-3" />
  Active
</Badge>
```

---

## Messages

### Chat Message Component

```jsx
import ChatMessage from './components/ChatMessage';

// User Message
<ChatMessage message="Hello, I need help" isUser={true} />

// Bot Message
<ChatMessage message="I'm here to help. What's concerning you?" isUser={false} />

// Loading State
<ChatMessage isLoading={true} />
```

### Message Features
- **Copy Button**: Click to copy message text
- **Speak Button**: Click to hear message aloud
- **Loading Animation**: Three bouncing dots
- **Animations**: Smooth slide-in effect

---

## Modals

### Emergency Modal

```jsx
import EmergencyModal from './components/EmergencyModal';

<EmergencyModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  isCritical={true}
  helplines={helplineData}
  nearbyServices={servicesData}
  onCallHelpline={handleCall}
/>
```

### Modal Features
- **Overlay**: Semi-transparent backdrop (50% opacity)
- **Animation**: Slide-up on open, fade-out on close
- **Scrollable**: Content scrolls if too long
- **Responsive**: Adapts to mobile screens

---

## Forms

### Text Input

```jsx
<textarea
  className="text-input"
  placeholder="Type your message..."
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }}
  rows={1}
/>
```

### Input Features
- **Focus State**: Border color changes to green (#16a34a)
- **Focus Shadow**: Subtle green glow
- **Placeholder**: Light gray text (#9ca3af)
- **Resize**: No manual resize (handled via JS)
- **Auto-expand**: Up to 120px max height

### Keyboard Input

```jsx
<div className="mic-button">
  {isListening ? <MicOff /> : <Mic />}
</div>
```

### Keyboard States
- **Normal**: Outlined button with gray text
- **Listening**: Red background with pulse animation
- **Disabled**: Reduced opacity

---

## Cards

### Card Component

```jsx
import { Card, CardHeader, CardContent, CardFooter } from './components/Card';

<Card>
  <CardHeader>
    <h3>Support Resources</h3>
  </CardHeader>
  <CardContent>
    <p>Available mental health resources...</p>
  </CardContent>
  <CardFooter>
    <Button>Learn More</Button>
  </CardFooter>
</Card>
```

### Card Features
- **Subtle Shadow**: `0 1px 3px rgba(0, 0, 0, 0.1)`
- **Border**: 1px solid #e5e7eb
- **Hover Effect**: Shadow increases on hover
- **Sections**: Header, content, footer with borders

---

## Alerts

### Alert Component

```jsx
import { Alert } from './components/Alert';

// Error Alert
<Alert 
  type="error"
  title="Error"
  message="Failed to send message"
  onClose={() => setShowAlert(false)}
/>

// Success Alert
<Alert 
  type="success"
  title="Success"
  message="Message sent successfully"
/>

// Warning Alert
<Alert 
  type="warning"
  title="Warning"
  message="Please check your input"
/>

// Info Alert
<Alert 
  type="info"
  title="Information"
  message="Here's something you should know"
/>
```

### Alert Features
- **Icon**: Automatic icon based on type
- **Close Button**: Optional close button
- **Custom Actions**: Pass custom action buttons
- **Animation**: Slide-in from top

---

## Colors

### Color Palette

```css
/* Primary Colors */
--color-primary: #16a34a;           /* Main actions */
--color-primary-dark: #15803d;      /* Hover state */
--color-primary-light: #dcfce7;     /* Background */

/* Semantic Colors */
--color-error: #dc2626;             /* Errors, alerts */
--color-success: #10b981;           /* Success, confirmed */
--color-warning: #f59e0b;           /* Warnings */
--color-info: #0ea5e9;              /* Information */

/* Grays */
--color-gray-50: #f9fafb;           /* Lightest gray */
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-800: #1f2937;
--color-gray-900: #111827;          /* Darkest gray */
```

### Using Colors

```jsx
// In CSS
.button {
  background: var(--color-primary);
}

.button:hover {
  background: var(--color-primary-dark);
}

// Directly in code
<div style={{ color: '#16a34a' }}>
  Green text
</div>
```

---

## Spacing

### Spacing Scale

```css
/* 8px Base Unit */
--spacing-0: 0;
--spacing-1: 4px;       /* Extra small */
--spacing-2: 8px;       /* Small */
--spacing-3: 12px;      /* Small-medium */
--spacing-4: 16px;      /* Medium */
--spacing-5: 20px;      /* Medium-large */
--spacing-6: 24px;      /* Large */
--spacing-7: 28px;
--spacing-8: 32px;      /* Extra large */
--spacing-9: 36px;
--spacing-10: 40px;     /* Extra extra large */
```

### Usage Examples

```jsx
// Padding
style={{ padding: '16px' }}      /* spacing-4 */
style={{ padding: '8px 16px' }}  /* spacing-2, spacing-4 */

// Margin
style={{ margin: '24px' }}       /* spacing-6 */
style={{ marginBottom: '12px' }} /* spacing-3 */

// Gap
style={{ gap: '8px' }}           /* spacing-2 */
style={{ gap: '16px' }}          /* spacing-4 */
```

---

## Animations

### Fade In Animation
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.component {
  animation: fadeIn 0.3s ease;
}
```

### Slide Up Animation
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal {
  animation: slideUp 0.3s ease;
}
```

### Bounce Animation
```css
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.loading-dot {
  animation: bounce 1.4s infinite;
}
```

### Pulse Animation
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.icon {
  animation: pulse 2s ease-in-out infinite;
}
```

### Spin Animation
```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
```

### Font Sizes

```css
/* Headings */
h1 { font-size: 36px; font-weight: 700; }
h2 { font-size: 28px; font-weight: 700; }
h3 { font-size: 22px; font-weight: 700; }
h4 { font-size: 18px; font-weight: 700; }

/* Body Text */
body { font-size: 15px; line-height: 1.6; }
p { font-size: 15px; line-height: 1.6; }

/* Small Text */
small, .text-sm { font-size: 14px; line-height: 1.5; }

/* Code */
code { font-size: 13px; font-family: monospace; }
```

### Responsive Typography

```css
@media (max-width: 768px) {
  h1 { font-size: 28px; }
  h2 { font-size: 22px; }
  body { font-size: 14px; }
}

@media (max-width: 480px) {
  h1 { font-size: 24px; }
  h2 { font-size: 18px; }
  body { font-size: 14px; }
}
```

---

## Accessibility Utilities

### Focus States
```css
button:focus-visible,
input:focus-visible {
  outline: 2px solid #16a34a;
  outline-offset: 2px;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### High Contrast
```css
@media (prefers-contrast: more) {
  :root {
    --color-primary: #006622;
    --color-text: #000000;
    --color-background: #ffffff;
  }
}
```

---

## Responsive Breakpoints

### Desktop (1024px and up)
```css
/* All features visible */
/* Full-width layouts */
/* Multiple columns */
```

### Tablet (768px to 1023px)
```css
@media (max-width: 768px) {
  /* Adjusted layouts */
  /* 2-column grids become single column */
  /* Larger touch targets */
}
```

### Mobile (Below 480px)
```css
@media (max-width: 480px) {
  /* Full-width layouts */
  /* Single column */
  /* Large touch targets (44x44px minimum) */
}
```

---

## Quick Reference

### Most Used Components
- `<Button>` - For all clickable actions
- `<Card>` - For content containers
- `<Alert>` - For messages and notifications
- `<Badge>` - For status indicators
- `<ChatMessage>` - For chat display

### Most Used Colors
- Primary: `#16a34a` (Green)
- Error: `#dc2626` (Red)
- Success: `#10b981` (Green)
- Info: `#0ea5e9` (Blue)
- Gray: `#6b7280` (Medium)

### Most Used Spacing
- Small gap: `8px`
- Medium gap: `16px`
- Large gap: `24px`
- Extra large: `32px`

---

## Common Patterns

### Form with Button
```jsx
<div style={{ display: 'flex', gap: '12px' }}>
  <input className="text-input" />
  <Button variant="primary">Submit</Button>
</div>
```

### Card with Alert
```jsx
<Card>
  <CardContent>
    <Alert type="success" title="Complete" />
  </CardContent>
</Card>
```

### Message List
```jsx
<div className="chatpage-messages">
  {messages.map(msg => (
    <ChatMessage 
      key={msg.id} 
      message={msg.text} 
      isUser={msg.sender === 'user'}
    />
  ))}
</div>
```

---

**Last Updated**: January 2026  
**Version**: 2.0
