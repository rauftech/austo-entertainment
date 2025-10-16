# Webflow Custom Code Starter

A Vite-powered starter for adding custom CSS and JavaScript to Webflow projects. CSS loads in `<head>` for performance, JS conditionally loads per page.

## Quick Start

```bash
npm create vite@latest my-project -- --template vanilla
cd my-project
npm install
npm run dev
```

## Project Structure

```bash
src/
├── main.js              # Entry point - handles routing logic
├── styles/              # CSS files (loaded in <head>)
│   ├── global.css       # All pages
│   ├── about-home.css   # About & Home only
│   └── work.css         # Work & Services only
└── js/                  # JavaScript modules
    ├── global.js        # Runs on all pages
    ├── about.js         # About page only
    └── work.js          # Work page only
```

## How It Works

**CSS**: Loaded via `<link>` tags in Webflow's `<head>` for optimal performance
**JS**: Dynamic imports in `main.js` based on current page URL

### URL-Based Routing

```javascript
// main.js checks URL and loads matching modules
if (isCurrentPage(['about'])) {
  await import('./js/about.js');
}
```

### Page Detection

```javascript
function isCurrentPage(pageList) {
  const path = paths[paths.length - 1];
  // Matches: /about, /about/, collection detail pages
  return pageList.includes(path) || 
         pageList.includes('detail_' + itemPath) || 
         pageList.includes(itemPath + '/item');
}
```

## Webflow Integration

### Development (localhost:5173)

**Header Code:**

```html
<link rel="stylesheet" href="http://localhost:5173/src/styles/global.css">
<script>
  const path = window.location.pathname.split('/').pop();
  if (path === 'about' || path === '') {
    document.write('<link rel="stylesheet" href="http://localhost:5173/src/styles/about-home.css">');
  }
</script>
```

**Footer Code:**

```html
<script type="module" src="http://localhost:5173/src/main.js"></script>
```

### Production (GitHub Pages)

**Header Code:**

```html
<link rel="stylesheet" href="https://USERNAME.github.io/REPO/global.css">
<script>
  const path = window.location.pathname.split('/').pop();
  const base = 'https://USERNAME.github.io/REPO';
  if (path === 'about' || path === '') {
    document.write('<link rel="stylesheet" href="' + base + '/about-home.css">');
  }
</script>
```

**Footer Code:**

```html
<script type="module" src="https://USERNAME.github.io/REPO/main.js"></script>
```

## Key Files

### vite.config.js

Configures CSS output as separate files for conditional loading:

```javascript
input: {
  main: resolve(__dirname, 'src/main.js'),
  global: resolve(__dirname, 'src/styles/global.css'),
  'about-home': resolve(__dirname, 'src/styles/about-home.css'),
}
```

### src/main.js

Entry point with routing logic:

- Parses URL pathname
- Loads global JS first (await)
- Conditionally loads page-specific JS
- Wrapped in DOMContentLoaded for safety

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Build for production → `dist/` |
| `npm run preview` | Preview production build |

## Deploy to GitHub Pages

```bash
npm run build
git subtree push --prefix dist origin gh-pages
```

Or use GitHub Actions (see `.github/workflows/deploy.yml` in full setup).

## Adding a New Page

1. Create `src/styles/blog.css` and `src/js/blog.js`
2. Add to `vite.config.js` inputs: `blog: resolve(__dirname, 'src/styles/blog.css')`
3. Add to `src/main.js`: `if (isCurrentPage(['blog'])) await import('./js/blog.js');`
4. Add to Webflow Header Code CSS conditional
5. Rebuild: `npm run build`

## Architecture Decisions

**Why CSS in `<head>`?**

- No FOUC (Flash of Unstyled Content)
- Parallel loading with HTML parsing
- Better Core Web Vitals scores

**Why separate CSS files?**

- Conditional loading per page
- Better caching (unchanged files stay cached)
- Smaller initial payload

**Why dynamic JS imports?**

- Code splitting automatically
- Only load what's needed per page
- Maintains execution order with async/await

**Why await for global.js?**

- Guarantees global code runs before page-specific code
- Prevents race conditions
- Predictable initialization order

## Browser Support

Requires ES modules support (Chrome 61+, Firefox 60+, Safari 11+, Edge 79+)

## License

MIT
