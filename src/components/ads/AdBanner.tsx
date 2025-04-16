
import { useState, useEffect } from 'react';

interface AdBannerProps {
  className?: string;
  format?: 'horizontal' | 'vertical' | 'square';
}

const AdBanner = ({ className = '', format = 'horizontal' }: AdBannerProps) => {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Simulate ad loading
    const timer = setTimeout(() => {
      setAdLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getAdDimensions = () => {
    switch (format) {
      case 'vertical':
        return 'h-[600px] w-[160px]';
      case 'square':
        return 'h-[250px] w-[250px]';
      case 'horizontal':
      default:
        return 'h-[90px] w-full';
    }
  };

  return (
    <div className={`ad-container ${getAdDimensions()} ${className} flex items-center justify-center bg-muted text-muted-foreground border border-dashed border-border rounded`}>
      {!adLoaded ? (
        <div className="text-sm">Loading ad...</div>
      ) : (
        <div className="text-sm">Advertisement Space</div>
      )}
    </div>
  );
};

export default AdBanner;
