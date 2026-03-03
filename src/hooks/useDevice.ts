import { useState, useEffect } from 'react';

type Device = 'desktop' | 'mobile';

/** Returns 'desktop' or 'mobile' based on viewport width (768px breakpoint) */
export const useDevice = (breakpoint = 768): Device => {
  const [device, setDevice] = useState<Device>(
    window.innerWidth > breakpoint ? 'desktop' : 'mobile'
  );

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => {
      setDevice(e.matches ? 'mobile' : 'desktop');
    };
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, [breakpoint]);

  return device;
};
