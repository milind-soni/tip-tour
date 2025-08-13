# TipTour Design Document

## Core Philosophy
**Non-intrusive, context-aware navigation assistant** - Not a traditional tour library, but an intelligent helper that understands your application.

## 🎯 Vision
Transform TipTour from a simple tooltip into a **contextual AI navigator** that knows your entire application's workflows, without being intrusive or controlling the user's focus.

## 🚫 What We're NOT Building
- No forced focus stealing
- No modal overlays that block interaction
- No rigid step-by-step tours
- No intrusive highlights or spotlights

## ✨ What We ARE Building
A subtle, intelligent assistant that:
- **Floats alongside** the user's natural navigation
- **Understands context** about buttons, workflows, and features
- **Responds to questions** like "How do I export data?" or "Where is the settings button?"
- **Points the way** with our V-arrow without taking control

## 📋 Key Features

### 1. Context Mapping System
Instead of defining tours, developers define **context maps**:

```javascript
TipTour.context({
  elements: {
    '#export-btn': {
      name: 'Export Button',
      description: 'Exports data in CSV, JSON, or PDF formats',
      workflows: ['data-export', 'reporting'],
      related: ['#import-btn', '#settings-export']
    },
    '.dashboard-card': {
      name: 'Dashboard Cards',
      description: 'Interactive metrics displays',
      workflows: ['monitoring', 'analytics'],
      tips: ['Click to drill down', 'Drag to rearrange']
    }
  },
  
  workflows: {
    'data-export': {
      name: 'Export Data',
      steps: ['Select data range', 'Choose format', 'Click export'],
      elements: ['#date-picker', '#format-select', '#export-btn']
    },
    'user-onboarding': {
      name: 'Getting Started',
      steps: ['Create profile', 'Connect data', 'View dashboard'],
      elements: ['#profile', '#connections', '#dashboard']
    }
  }
});
```

### 2. Natural Language Understanding
Users can ask questions naturally:
- "How do I export my data?"
- "Where is the settings button?"
- "What does this button do?"
- "Show me how to create a report"
- "What can I do on this page?"

The AI assistant:
1. Understands the question
2. Searches the context map
3. Points arrow to relevant element(s)
4. Provides contextual explanation

### 3. Smart Arrow Behavior
The V-arrow becomes smarter:
- **Multi-target support**: Can point to sequence of elements
- **Path visualization**: Shows workflow paths between elements
- **Proximity awareness**: Gets excited near relevant elements
- **Color coding**: Different colors for different types (buttons, inputs, navigation)

### 4. Developer Integration

#### Simple Mode
```javascript
// Just provide context, let AI handle everything
TipTour.init({
  context: 'app-context.json',  // Load pre-defined context
  apiKey: 'openai-key'
});
```

#### Advanced Mode
```javascript
TipTour.init({
  // Custom element detection
  scanner: {
    autoDetect: true,  // Auto-scan for buttons, links, inputs
    patterns: {
      actions: '[data-action], button, .btn',
      navigation: 'nav a, .menu-item',
      inputs: 'input, select, textarea'
    }
  },
  
  // AI Enhancement
  ai: {
    model: 'gpt-4',
    customPrompts: {
      workflow: 'You are helping users navigate a CRM system...',
      troubleshoot: 'Help users solve common issues...'
    },
    embeddings: true  // Use embeddings for better context matching
  },
  
  // Arrow customization
  arrow: {
    style: 'minimal',  // or 'playful', 'professional'
    animations: true,
    multiTarget: true
  }
});
```

### 5. Learning Mode
TipTour can learn from usage:
```javascript
TipTour.learn({
  // Record user interactions
  recordClicks: true,
  recordQuestions: true,
  
  // Build workflow patterns from actual usage
  detectPatterns: true,
  
  // Export learned workflows
  exportLearnings: () => {
    return TipTour.getLearnings();
  }
});
```

## 🏗️ Implementation Phases

### Phase 1: Context System
- [ ] Element mapping structure
- [ ] Workflow definition system
- [ ] Context loader (JSON/Object)
- [ ] Basic element scanner

### Phase 2: AI Integration
- [ ] Natural language query processing
- [ ] Context searching with AI
- [ ] Intelligent response generation
- [ ] Multi-element navigation

### Phase 3: Advanced Arrow
- [ ] Sequential pointing
- [ ] Path visualization
- [ ] Multi-target support
- [ ] Workflow animation

### Phase 4: Developer Tools
- [ ] Visual context builder
- [ ] Auto-scanning system
- [ ] TypeScript definitions
- [ ] Framework adapters

### Phase 5: Learning System
- [ ] Usage pattern detection
- [ ] Workflow learning
- [ ] Context improvement suggestions
- [ ] Analytics dashboard

## 💡 Unique Selling Points

1. **Non-Intrusive**: Never takes control away from user
2. **Context-Aware**: Understands your entire app, not just predefined tours
3. **Natural Language**: Users can ask questions naturally
4. **Visual Navigation**: Arrow provides subtle visual guidance
5. **Learning System**: Gets smarter over time
6. **Developer Friendly**: Simple to integrate, powerful to customize

## 🎨 UI/UX Principles

1. **Subtle Presence**: Tooltip appears only when needed
2. **Natural Movement**: Smooth, organic animations
3. **Clear Communication**: Concise, helpful responses
4. **Visual Hierarchy**: Arrow draws attention without being loud
5. **User Control**: Easy to dismiss, never blocks interaction

## 📊 Use Cases

### E-commerce Platform
```javascript
// User asks: "How do I apply a discount code?"
// TipTour: Points to cart → discount input → apply button
```

### SaaS Dashboard
```javascript
// User asks: "Show me this month's reports"
// TipTour: Points to date filter → report type → generate button
```

### Developer Documentation
```javascript
// User asks: "Where are the API examples?"
// TipTour: Points to sidebar → API section → examples tab
```

## 🔮 Future Ideas

1. **Voice Input**: "Hey TipTour, how do I..."
2. **Gesture Recognition**: Draw a question mark to activate
3. **Collaborative Tours**: Share workflows with team members
4. **A/B Testing**: Test different workflow explanations
5. **Accessibility Mode**: Enhanced support for screen readers
6. **Mobile Gestures**: Swipe to navigate between elements

## 📝 Notes

- Keep the tooltip small and unobtrusive
- Prioritize speed - responses should be instant
- Consider offline mode with pre-computed contexts
- Allow customization but provide smart defaults
- Focus on developer experience - easy integration is key

---



## Future Plans
- Users will be able to submit their Docs and it will automatically generate the worflows json and all the steps, 
- After it is generated the user can then review the tours one by one and accept, reject or modify the tours and deploy, 
- Tours can get updated as the documentation changes
- Chrome extension maybe?? Support for major CRMS and tools
- CTA for Landing Pages 
- Changing text on hover, fast ai models and all 

*This is a living document. As we build TipTour, we'll update this design to reflect new insights and decisions.*