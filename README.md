# Tip-Tour

An interactive AI-powered tooltip that follows your cursor with dynamic navigation features and playful hand-drawn UI elements.

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

- 🖱️ **Smooth Mouse Tracking** - Tooltip follows cursor with buttery smooth animations
- ⚡ **Auto-Focus Input** - Start typing anywhere to instantly interact with AI
- 🎯 **Dynamic Arrow Navigation** - V-shaped arrow that points to interactive elements
- 🎨 **Hand-Drawn UI Elements** - Excalidraw-inspired sketchy button design
- 🟢 **Interactive Visual Feedback** - Arrow changes color and size based on proximity
- 🎮 **Gamified Navigation** - Two-button chase game with visual celebrations
- 🚀 **Hardware Accelerated** - Uses CSS transforms for optimal performance
- 🤖 **OpenAI Integration** - Built-in GPT-4o-mini support with response caching
- 📱 **Smart Positioning** - Prevents tooltip from going off-screen
- ⌨️ **Keyboard Friendly** - Full keyboard navigation support

## 🎥 Demo

Experience the interactive tooltip with dynamic arrow navigation:
- Move your mouse to see the tooltip follow you
- Watch the V-shaped arrow point to interactive buttons
- Click buttons to see the arrow switch targets
- Arrow grows larger as you approach targets
- Arrow turns green when hovering over the target button
- Type anywhere to instantly interact with the AI assistant

## 🚀 Quick Start

### Installation

```bash
npm install tiptour
```

### Usage

```javascript
import TipTour from 'tiptour';
import 'tiptour/styles';

// Initialize the tooltip
const tooltip = new TipTour({
  smoothRadius: 30,      // Pixels before movement starts
  friction: 0.92,        // Smoothing factor (0-1)
  hideDelay: 5000,       // Auto-hide after 5 seconds
  offset: { x: 20, y: 20 }
});

// Set custom content
tooltip.setContent('<p>Hello from TipTour!</p>');

// Add interactive input
tooltip.addInput('Ask me anything...', async (value) => {
  // Handle user input
  console.log('User typed:', value);
  return 'Response to user';
});

// Add arrow pointing to elements
tooltip.addArrow(['#button1', '#button2']);
```

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/milind-soni/tip-tour.git
   cd tip-tour
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure OpenAI API (Optional)**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_OPENAI_API_KEY=your-openai-api-key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3001
   ```

## 🎮 Usage

### Interactive Features

The tooltip automatically initializes when the page loads:

**Tooltip Behavior:**
- **Mouse Movement**: Tooltip appears and follows your cursor smoothly
- **Auto-Hide**: Disappears after 5 seconds of inactivity  
- **Typing**: Start typing anywhere to focus the input
- **Send Message**: Press `Enter` to send your message to AI
- **Escape**: Press `Esc` to hide the tooltip

**Arrow Navigation:**
- **Dynamic Pointing**: V-shaped arrow always points to the active target button
- **Proximity Scaling**: Arrow grows larger as you approach the target (1x to 1.4x scale)
- **Hover Feedback**: Arrow turns green and scales to 1.5x when hovering over target
- **Click Response**: Arrow immediately points to the next button after clicking

**Button Interaction:**
- **Hand-Drawn Style**: Buttons have sketchy borders inspired by Excalidraw
- **Click Feedback**: Visual celebration when buttons are clicked
- **Sequential Flow**: "Click me!" → "Then me!" creates a playful navigation loop

### Customization

#### Styling

Modify the CSS variables in `index.html`:

```css
#tooltip {
    width: 300px;              /* Tooltip width */
    border-radius: 12px;       /* Corner radius */
    padding: 16px;             /* Internal padding */
}
```

#### AI Integration

The project uses OpenAI's GPT-4o-mini model. Configure in `src/api.ts`:

```typescript
// Set your API key in .env.local
VITE_OPENAI_API_KEY=your-api-key

// The system includes:
- Response caching (5-minute TTL)
- Rate limit handling
- Fallback responses when API is unavailable
- Max 150 tokens per response for quick interactions
```

#### Positioning & Timing

```typescript
// Modify these values in the constructor or methods:
private followBoxOffset = 20;     // Distance from cursor
private hideTimeout = 2000;       // Auto-hide delay (ms)
```

## 🛠️ API Reference

### AITooltip Class

| Method | Description |
|--------|-------------|
| `showTooltip()` | Display the tooltip |
| `hideTooltip()` | Hide the tooltip |
| `setContent(message)` | Update tooltip message |
| `updateTooltipPosition()` | Recalculate position |

### Events

| Event | Trigger | Description |
|-------|---------|-------------|
| `mousemove` | Mouse movement | Shows tooltip and updates position |
| `keydown` | Keyboard input | Handles typing and shortcuts |
| `Enter` | Input field | Sends message to AI |
| `Escape` | Anywhere | Hides tooltip |

## 🎨 Customization Examples

### Change Theme Colors

```css
body {
    background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
}

#tooltip {
    background: #2c3e50;
    color: white;
}
```

### Adjust Animation Speed

```css
#tooltip {
    transition: transform 0.3s ease-out; /* Slower animation */
}
```

### Custom Tooltip Size

```css
#tooltip {
    width: 400px;
    max-width: 90vw;
}
```

## 🔧 Development

### Build for Production

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

### Project Structure

```
tiptour/
├── src/
│   ├── main.ts          # Main tooltip & navigation logic
│   └── api.ts           # OpenAI integration & caching
├── index.html           # Demo page with styles
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── tsconfig.json        # TypeScript config
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with TypeScript and Vite
- Inspired by modern tooltip libraries
- Designed for seamless AI integration

## 📞 Contact

**Milind Soni** - [@milind-soni](https://github.com/milind-soni) - milindsoni201@gmail.com

Project Link: [https://github.com/milind-soni/tiptour](https://github.com/milind-soni/tiptour)

---

⭐ **Star this repo if you found it helpful!**
