# TipTour

A smooth, interactive tooltip library that follows your cursor with customizable behavior and optional AI integration.

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## Features

- Smooth mouse tracking with configurable friction and smoothing radius
- Auto-focus input field for instant interaction
- Dynamic arrow navigation that points to elements
- Hardware accelerated animations using CSS transforms
- Smart positioning to prevent off-screen rendering
- Full keyboard navigation support
- Optional AI integration for interactive responses

## Installation

```bash
npm install tiptour
```

## Basic Usage

Add TipTour to any webpage with just a few lines:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Import TipTour styles -->
  <link rel="stylesheet" href="node_modules/tiptour/dist/style.css">
</head>
<body>
  <h1>My Landing Page</h1>
  <button id="cta-button">Get Started</button>

  <!-- Import and initialize TipTour -->
  <script type="module">
    import TipTour from 'tiptour';
    
    // Create tooltip instance
    const tooltip = new TipTour({
      smoothRadius: 30,    // Start following after 30px movement
      friction: 0.92,      // Smoothing factor (0-1)
      hideDelay: 5000      // Hide after 5 seconds
    });
    
    // Optional: Set custom content
    tooltip.setContent('Welcome! Move your mouse around.');
    
    // Optional: Add input field for user interaction
    tooltip.addInput('Type something...', async (value) => {
      console.log('User typed:', value);
      return `You said: ${value}`;
    });
    
    // Optional: Add arrow pointing to elements
    tooltip.addArrow(['#cta-button']);
  </script>
</body>
</html>
```

## Configuration Options

```javascript
const tooltip = new TipTour({
  smoothRadius: 30,        // Pixels of movement before tooltip follows
  friction: 0.92,          // Smoothing factor (0 = instant, 1 = never moves)
  hideDelay: 5000,         // Milliseconds before auto-hide
  offset: { x: 20, y: 20 } // Offset from cursor position
});
```

## API Methods

### Core Methods

```javascript
// Set tooltip content
tooltip.setContent('<p>Custom HTML content</p>');

// Show/hide tooltip
tooltip.show();
tooltip.hide();

// Update configuration
tooltip.setOptions({ friction: 0.85 });
```

### Interactive Features

```javascript
// Add input field with handler
tooltip.addInput('placeholder text', async (value) => {
  // Process user input
  return 'response';
});

// Add arrow pointing to elements
tooltip.addArrow(['#element1', '#element2']);

// Remove arrow
tooltip.removeArrow();
```

## Styling

Override default styles with CSS:

```css
.tiptour-tooltip {
  background: #2c3e50;
  color: white;
  border-radius: 8px;
  padding: 12px;
}

.tiptour-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}
```

## React Example

```jsx
import { useEffect } from 'react';
import TipTour from 'tiptour';
import 'tiptour/styles';

function App() {
  useEffect(() => {
    const tooltip = new TipTour({
      smoothRadius: 30,
      friction: 0.92
    });
    
    tooltip.setContent('Interactive tooltip active!');
    
    return () => tooltip.destroy();
  }, []);
  
  return <div>Your app content</div>;
}
```

## Development

```bash
# Clone the repository
git clone https://github.com/milind-soni/tip-tour.git
cd tip-tour

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT

## Author

Milind Soni - [@milind-soni](https://github.com/milind-soni)

Project Link: [https://github.com/milind-soni/tip-tour](https://github.com/milind-soni/tip-tour)