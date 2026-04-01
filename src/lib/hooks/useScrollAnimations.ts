'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Hook that applies scroll-triggered GSAP animations to elements
 * with data-animate attributes inside a container ref.
 *
 * Usage:
 *   const ref = useScrollAnimations();
 *   <div ref={ref}>
 *     <h2 data-animate="fade-up">Title</h2>
 *     <div data-animate="fade-up" data-delay="0.2">Card</div>
 *     <div data-animate="stagger-children">
 *       <div>Child 1</div>
 *       <div>Child 2</div>
 *     </div>
 *   </div>
 */
export function useScrollAnimations() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // fade-up: fade in + slide up
    const fadeUps = containerRef.current.querySelectorAll('[data-animate="fade-up"]');
    fadeUps.forEach((el) => {
      const delay = parseFloat((el as HTMLElement).dataset.delay || '0');
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    // fade-left: fade in + slide from left
    const fadeLefts = containerRef.current.querySelectorAll('[data-animate="fade-left"]');
    fadeLefts.forEach((el) => {
      const delay = parseFloat((el as HTMLElement).dataset.delay || '0');
      gsap.from(el, {
        x: -60,
        opacity: 0,
        duration: 0.8,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    // fade-right: fade in + slide from right
    const fadeRights = containerRef.current.querySelectorAll('[data-animate="fade-right"]');
    fadeRights.forEach((el) => {
      const delay = parseFloat((el as HTMLElement).dataset.delay || '0');
      gsap.from(el, {
        x: 60,
        opacity: 0,
        duration: 0.8,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    // scale-in: scale from small
    const scaleIns = containerRef.current.querySelectorAll('[data-animate="scale-in"]');
    scaleIns.forEach((el) => {
      const delay = parseFloat((el as HTMLElement).dataset.delay || '0');
      gsap.from(el, {
        scale: 0.85,
        opacity: 0,
        duration: 0.9,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    // stagger-children: stagger animate direct children
    const staggerContainers = containerRef.current.querySelectorAll('[data-animate="stagger-children"]');
    staggerContainers.forEach((el) => {
      const staggerDelay = parseFloat((el as HTMLElement).dataset.stagger || '0.1');
      gsap.from(el.children, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: staggerDelay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });
  }, { scope: containerRef });

  return containerRef;
}
