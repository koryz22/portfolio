# React Portfolio Website

my personal portfolio! :)

a modern, responsive portfolio website built with React and TypeScript.

## Features

- 🍔 Hamburger navigation menu with smooth animations
- 🏠 Home logo ("kz") in the top left
- 📱 Fully responsive design
- 🎨 Minimalistic midnight dark blue theme
- ⚡ Smooth scrolling between sections
- 🎯 Three main sections: Home, About Me, Contact

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── Navigation.tsx      # Hamburger menu and navigation
│   ├── Navigation.css
│   ├── Home.tsx           # Home section
│   ├── Home.css
│   ├── About.tsx          # About section
│   ├── About.css
│   ├── Contact.tsx        # Contact section
│   └── Contact.css
├── App.tsx                # Main app component
├── App.css
├── index.tsx              # Entry point
└── index.css              # Global styles
```

## Customization

- Update the content in each component to match your information
- Modify colors in the CSS files to match your brand
- Add more sections by creating new components and adding them to the navigation

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (not recommended)

## Technologies Used

- React 18
- TypeScript
- CSS3 with modern features
- Create React App
