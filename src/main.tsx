import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure orange CM favicon is active in browser tab
try {
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23fbbf24"/><stop offset="100%" stop-color="%23d97706"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(%23g)"/><rect x="2" y="2" width="60" height="60" rx="12" fill="none" stroke="%23fef3c7" stroke-width="1.5" stroke-opacity="0.7"/><text x="32" y="42" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-weight="900" font-size="30" letter-spacing="-1" fill="%230b1329">CM</text></svg>`;
  const faviconDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgFavicon)}`;

  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/svg+xml';
  link.href = faviconDataUri;
} catch {
  // Ignored in SSR or test environments
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

