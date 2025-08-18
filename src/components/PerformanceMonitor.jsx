'use client';

import { useEffect, useState } from 'react';

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderCount: 0,
    lastRender: 0
  });

  useEffect(() => {
    const renderStart = performance.now();
    
    setMetrics(prev => ({
      ...prev,
      renderCount: prev.renderCount + 1,
      lastRender: renderStart - prev.lastRender || 0
    }));

    // Measure initial load time
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            setMetrics(prev => ({
              ...prev,
              loadTime: entry.loadEventEnd - entry.fetchStart
            }));
          }
        });
      });
      observer.observe({ type: 'navigation', buffered: true });

      return () => observer.disconnect();
    }
  }, []);

  // Only show in development
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-3 rounded-lg font-mono z-50">
      <div>Load: {(metrics.loadTime / 1000).toFixed(2)}s</div>
      <div>Renders: {metrics.renderCount}</div>
      <div>Last: {metrics.lastRender.toFixed(1)}ms</div>
    </div>
  );
}
