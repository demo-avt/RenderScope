import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface AdBannerProps {
  cameraId: string;
  isPremium?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({ cameraId, isPremium = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { resolvedTheme } = useTheme();
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if ad was dismissed in the last 24 hours
    const dismissedKey = `ad_dismissed_${cameraId}`;
    const dismissedTime = localStorage.getItem(dismissedKey);

    if (dismissedTime) {
      const dismissedAt = parseInt(dismissedTime);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (now - dismissedAt < twentyFourHours) {
        setIsDismissed(true);
        setIsVisible(false);
        return;
      }
    }

    // Set up intersection observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            setIsLoaded(true);
            // Simulate ad loading
            setTimeout(() => {
              setIsVisible(true);
            }, 500);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [cameraId, isLoaded]);

  const handleDismiss = () => {
    const dismissedKey = `ad_dismissed_${cameraId}`;
    localStorage.setItem(dismissedKey, Date.now().toString());
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (isPremium || isDismissed || !isVisible) {
    return null;
  }

  return (
    <div ref={adRef} className="mt-3 relative">
      <div className="ad-container bg-secondary border border-primary rounded-lg p-3 relative overflow-hidden">
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute top-1 right-1 p-1 text-secondary hover:text-primary hover:bg-tertiary rounded transition-colors z-10"
          title="Dismiss ad for 24 hours"
        >
          <X className="h-3 w-3" />
        </button>

        {/* Ad content */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm font-medium text-blue-300 mb-1">
              🚀 ArchViz Trader Pro Tools
            </div>
            <div className="text-xs text-secondary">
              Professional 3D assets & render optimization
            </div>
          </div>
          <div className="ml-4">
            <button className="px-3 py-1 bg-accent text-white text-xs rounded hover:opacity-80 transition-opacity">
              Learn More
            </button>
          </div>
        </div>

        {/* Google AdSense Integration */}
        <div className="mt-2">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '50px' }}
            data-ad-client="ca-pub-YOUR-ADSENSE-ID"
            data-ad-slot="YOUR-AD-SLOT-ID"
            data-ad-format="horizontal"
            data-full-width-responsive="true"
            data-adtest={resolvedTheme === 'dark' ? 'on' : 'off'}
          />
        </div>

        {/* Loading state */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-secondary animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-xs text-secondary">Loading ad...</div>
          </div>
        )}
      </div>
    </div>
  );
};