'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Button from '../ui/Button';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HeroSectionHome() {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Entry timeline
    tl.from('.hero-title-line', {
      y: 60,
      opacity: 0,
      duration: 0.9,
      stagger: 0.18,
    })
    .from('.hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.7,
    }, '-=0.3')
    .from('.hero-cta', {
      y: 20,
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
    }, '-=0.3');

    // Parallax: video moves slower than content on scroll
    gsap.to('.hero-video', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Content fades out on scroll
    gsap.to('.hero-content', {
      y: -50,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: '60% top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, { scope: heroRef });

  return (
    <section
      ref={heroRef}
      className="relative w-full max-w-[100vw] flex items-center justify-start overflow-hidden h-[calc(100vh-64px)] min-h-[500px]"
    >
      {/* Video de fondo */}
      <div className="hero-video absolute top-0 left-0 w-full h-full z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Contenido */}
      <div className="hero-content relative z-10 w-full flex flex-col justify-between md:justify-start items-start space-y-0 md:space-y-6 max-w-xl px-5 md:px-0 md:pl-20 h-full py-6 md:py-8">
        <div className="space-y-3 md:space-y-6 pt-6 md:pt-12 w-full">
          <h1 className="text-[1.6rem] xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight break-words [text-wrap:balance]">
            <span className="hero-title-line block">No hablamos de comida rápida</span>
            <span className="hero-title-line block text-amber-500">…hablamos de alta cocina</span>
          </h1>

          <p className="hero-subtitle text-sm sm:text-base md:text-lg text-gray-200 max-w-md md:hidden">
            Carne madurada, ingredientes locales y un sabor que trasciende.
          </p>
        </div>

        <p className="hero-subtitle hidden md:block text-sm sm:text-base md:text-lg text-gray-200 max-w-md">
          Carne madurada, ingredientes locales y un sabor que trasciende.
        </p>

        <div className="hero-cta flex gap-3 md:gap-4 pb-20 md:pb-8 md:-translate-y-4">
          <Link href="/carta">
            <Button
              variant="secondary"
              className="px-6 md:px-8 py-3 md:py-3 text-sm md:text-base font-semibold rounded-full"
            >
              Nuestra Carta
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
