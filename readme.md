# Full Circle

A stunning, professional-grade React application celebrating your journey together. Featuring interactive 3D spheres, an immersive 2-player Snakes & Ladders game, and a beautiful calendar interface.

## Features

- **Interactive 3D Spheres**: 10 beautifully animated spheres with particle effects
- **Professional Calendar**: Full calendar view with month/day selection and moment highlighting
- **2-Player Snakes & Ladders**: Enhanced game with visible snakes, ladders, and animated moments
- **Whimsical-Inspired Design**: Grainy gradients, smooth animations, dark theme with vibrant accents
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Modern React Architecture**: Built with React 18, Framer Motion, and Vite
- **Performance Optimized**: Smooth 60fps animations, lazy loading

## Tech Stack

- React 18
- Vite
- Framer Motion
- date-fns
- CSS3 with custom properties

## Project Structure

```
full-circle/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles/
│   │   └── index.css
│   └── components/
│       ├── GrainOverlay.jsx
│       ├── Hero.jsx
│       ├── BalloonsScene.jsx
│       ├── Balloon.jsx
│       ├── Modal.jsx
│       ├── PhotoModal.jsx
│       ├── VideoModal.jsx
│       ├── CalendarModal.jsx
│       └── GameModal.jsx
├── data/
│   └── content.json
└── assets/
    ├── photos/
    └── videos/
```

## Getting Started

Install dependencies:
```bash
npm install
```

Build for production:
```bash
npm run build
```

## Design Philosophy

This application draws inspiration from industry-leading design systems like Whimsical, featuring:

- Dark theme with vibrant gradient accents
- Grainy texture overlay for depth
- Smooth, purposeful animations
- Clean, modern component architecture
- Professional typography and spacing

## Content Management
All content is managed through `/data/content.json`. Edit this file to update:
- Site title and subtitle
- Balloon content and media
- Game configuration
- Timeline moments
