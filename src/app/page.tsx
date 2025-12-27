// src/app/page.tsx
'use client';

import HeroSectionHome from '@/components/Home/HeroSectionHome';
import ContactSection from '@/components/Home/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSectionHome />
      <ContactSection />
    </>
  );
}
