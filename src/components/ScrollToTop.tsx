import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = window.setTimeout(() => {
      const announcer = document.getElementById('route-announcer');
      if (announcer) announcer.textContent = `已进入${document.title.replace(/\s*\|\s*职引$/, '')}`;
    }, 100);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return <div id="route-announcer" className="sr-only" aria-live="polite" aria-atomic="true" />;
}
