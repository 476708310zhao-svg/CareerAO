import { trackEvent } from './analytics';

type VitalName = 'CLS' | 'FCP' | 'INP' | 'LCP' | 'TTFB';

let initialized = false;

const ratingFor = (name: VitalName, value: number) => {
  const limits: Record<VitalName, [number, number]> = {
    CLS: [0.1, 0.25],
    FCP: [1800, 3000],
    INP: [200, 500],
    LCP: [2500, 4000],
    TTFB: [800, 1800],
  };
  if (value <= limits[name][0]) return 'good';
  if (value <= limits[name][1]) return 'needs_improvement';
  return 'poor';
};

const report = (name: VitalName, value: number) => {
  const normalizedValue = name === 'CLS' ? Math.round(value * 1000) / 1000 : Math.round(value);
  trackEvent('web_vital', {
    metric: name,
    value: normalizedValue,
    rating: ratingFor(name, value),
  });
};

export function initPerformanceMonitoring() {
  if (initialized || typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;
  if (navigator.userAgent === 'ReactSnap') return;
  initialized = true;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (navigation) report('TTFB', Math.max(0, navigation.responseStart));

  try {
    const paintObserver = new PerformanceObserver((list) => {
      const fcp = list.getEntries().find((entry) => entry.name === 'first-contentful-paint');
      if (fcp) {
        report('FCP', fcp.startTime);
        paintObserver.disconnect();
      }
    });
    paintObserver.observe({ type: 'paint', buffered: true });
  } catch {
    // The browser does not expose paint timing.
  }

  let lcpValue = 0;
  let clsValue = 0;
  let inpValue = 0;
  const observers: PerformanceObserver[] = [];

  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const latest = list.getEntries().at(-1);
      if (latest) lcpValue = latest.startTime;
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    observers.push(lcpObserver);
  } catch {
    // LCP is not supported in this browser.
  }

  try {
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!shift.hadRecentInput) clsValue += shift.value || 0;
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    observers.push(clsObserver);
  } catch {
    // Layout shift timing is not supported in this browser.
  }

  try {
    const inpObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const interaction = entry as PerformanceEntry & { duration?: number; interactionId?: number };
        if (interaction.interactionId && interaction.duration) inpValue = Math.max(inpValue, interaction.duration);
      });
    });
    inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 40 } as PerformanceObserverInit);
    observers.push(inpObserver);
  } catch {
    // Event timing is not supported in this browser.
  }

  const flush = () => {
    if (document.visibilityState !== 'hidden') return;
    if (lcpValue) report('LCP', lcpValue);
    report('CLS', clsValue);
    if (inpValue) report('INP', inpValue);
    observers.forEach((observer) => observer.disconnect());
    document.removeEventListener('visibilitychange', flush);
  };

  document.addEventListener('visibilitychange', flush);
}
