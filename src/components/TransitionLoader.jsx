import { useState, useEffect } from 'react';

export default function TransitionLoader({ 
  isLoading, 
  children, 
  LoadingSkeleton, 
  duration = 300,
  staggerDelay = 100 
}) {
  const [showSkeleton, setShowSkeleton] = useState(isLoading);
  const [showContent, setShowContent] = useState(!isLoading);

  useEffect(() => {
    if (isLoading) {
      setShowContent(false);
      setTimeout(() => setShowSkeleton(true), 50);
    } else {
      setShowSkeleton(false);
      setTimeout(() => setShowContent(true), duration);
    }
  }, [isLoading, duration]);

  if (showSkeleton && isLoading) {
    return <LoadingSkeleton />;
  }

  if (showContent && !isLoading) {
    return (
      <div className="opacity-0 fade-in-up" style={{ animationDelay: `${staggerDelay}ms` }}>
        {children}
      </div>
    );
  }

  return null;
}
