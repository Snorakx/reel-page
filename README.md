# Animation Hub - Modern Astro + React Template

A lightweight, performance-focused template built with Astro and React, optimized for animations and multi-language support. This template is designed to be highly interactive while maintaining excellent performance across all devices.

## Features

- 🚀 **Built with Astro** - Enjoy the performance benefits of static site generation with dynamic islands
- ⚛️ **React Components** - Interactive UI components powered by React
- 🎭 **Animation-focused** - Integrated with Framer Motion and GSAP for stunning animations
- 🌐 **Multi-language Support** - Built-in internationalization with URL-based language routing
- 🖌️ **TailwindCSS** - Utility-first CSS framework for rapid UI development
- 🔄 **Smooth Scrolling** - Powered by Lenis for butter-smooth scrolling experiences
- 📱 **Fully Responsive** - Works beautifully on all devices and screen sizes
- 🌓 **Dark Mode Support** - Automatic dark mode based on system preferences

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/animation-hub.git
cd animation-hub

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Project Structure

```
/
├── public/             # Static assets
├── src/
│   ├── assets/         # Project assets (images, etc.)
│   ├── components/     # React components
│   │   └── animations/ # Animation-specific components
│   ├── hooks/          # Custom React hooks
│   ├── i18n/           # Internationalization configuration
│   ├── layouts/        # Page layouts
│   ├── pages/          # Page components and routes
│   │   └── [lang]/     # Language-specific routes
│   ├── styles/         # Global styles
│   └── utils/          # Utility functions
└── package.json        # Project dependencies
```

## Animation Features

This template includes several animation utilities:

1. **Framer Motion Components** - Ready-to-use animation components
2. **GSAP Integration** - For complex timeline-based animations
3. **Smooth Scrolling** - Using Lenis for smooth scroll experiences
4. **Animation Hooks** - Custom hooks for reusable animations

## Internationalization

The template supports multiple languages through URL-based routing:

- `/en/` - English (default)
- `/pl/` - Polish
- `/de/` - German
- `/fr/` - French

To add more languages, update the `languages` object in `src/i18n/config.ts`.

## Customization

### Adding New Pages

Create new `.astro` files in the `src/pages/[lang]/` directory to add new pages.

### Adding New Components

Create new React components in the `src/components/` directory.

### Modifying Styles

Global styles are defined in `src/styles/global.css`. The template uses TailwindCSS for styling.

## License

MIT

## Acknowledgements

- [Astro](https://astro.build)
- [React](https://reactjs.org)
- [TailwindCSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [GSAP](https://greensock.com/gsap/)
- [Lenis](https://github.com/studio-freight/lenis)

```sh
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
