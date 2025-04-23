'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface LazyHydrateProps {
  children: ReactNode;
  rootMargin?: string;
}

export default function LazyHydrate({ children, rootMargin = '0px' }: LazyHydrateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return <div ref={ref}>{inView ? children : null}</div>;
}
