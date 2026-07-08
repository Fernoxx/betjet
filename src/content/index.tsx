import { createRoot } from 'react-dom/client';
import { Widget } from '../components/Widget';
import { WIDGET_CSS } from './styles';

// Mount the widget inside a shadow root so the host page's CSS can't touch it
// (and vice-versa). One host node, fixed to the viewport.
const HOST_ID = 'betjet-widget-host';

function mount() {
  if (document.getElementById(HOST_ID)) return;

  const host = document.createElement('div');
  host.id = HOST_ID;
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = WIDGET_CSS;
  shadow.appendChild(style);

  const mountPoint = document.createElement('div');
  shadow.appendChild(mountPoint);

  createRoot(mountPoint).render(<Widget />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true });
} else {
  mount();
}
