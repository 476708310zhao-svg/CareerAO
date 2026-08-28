export type AnalyticsValue = string | number | boolean | null | undefined;

type AnalyticsProperties = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: 'event', eventName: string, properties?: Record<string, AnalyticsValue>) => void;
  }
}

export function trackEvent(eventName: string, properties: AnalyticsProperties = {}) {
  if (typeof window === 'undefined') return;

  const cleanProperties = Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
  const payload = {
    event: eventName,
    page_path: window.location.pathname,
    ...cleanProperties,
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, cleanProperties);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  window.dispatchEvent(new CustomEvent('zhiyin:analytics', { detail: payload }));

  if (import.meta.env.DEV) console.debug('[analytics]', payload);
}
