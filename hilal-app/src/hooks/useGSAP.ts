import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useGSAPFadeIn(delay: number = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay, ease: "power2.out" }
      );
    }
  }, [delay]);

  return ref;
}

export function useGSAPStagger(childrenSelector: string, delay: number = 0) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const children = containerRef.current.querySelectorAll(childrenSelector);
      gsap.fromTo(
        children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay,
          ease: "power2.out",
        }
      );
    }
  }, [childrenSelector, delay]);

  return containerRef;
}

export function useGSAPResultAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, scale: 0.95, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  return ref;
}
