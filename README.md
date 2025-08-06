# 🎯 AI Tooltip

A smooth, mouse-following AI tooltip component that provides contextual assistance with real-time interaction capabilities.

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

- 🖱️ **Smooth Mouse Tracking** - Tooltip follows cursor with buttery smooth animations
- ⚡ **Auto-Focus Input** - Start typing anywhere to instantly interact with AI
- 🎨 **Modern UI Design** - Clean, responsive design with beautiful gradients
- 🚀 **Hardware Accelerated** - Uses CSS transforms for optimal performance
- 🤖 **AI Ready** - Built-in integration points for any AI API
- 📱 **Smart Positioning** - Prevents tooltip from going off-screen
- ⌨️ **Keyboard Friendly** - Full keyboard navigation support

## 🎥 Demo

Move your mouse around to see the tooltip in action. The tooltip appears on mouse movement and you can immediately start typing to interact with the AI assistant.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/milind-soni/tiptour.git
   cd tiptour
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎮 Usage

### Basic Implementation

The tooltip automatically initializes when the page loads. Here's how it works:

- **Mouse Movement**: Tooltip appears and follows your cursor
- **Auto-Hide**: Disappears after 2 seconds of inactivity  
- **Typing**: Start typing anywhere to focus the input
- **Send Message**: Press `Enter` to send your message to AI
- **Escape**: Press `Esc` to hide the tooltip

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

Replace the mock AI function in `src/main.ts`:

```typescript
private async callAI(prompt: string): Promise<string> {
    // Replace with your AI API call
    const response = await fetch('/api/your-ai-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });
    
    const data = await response.json();
    return data.response;
}
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
│   └── main.ts          # Main tooltip logic
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