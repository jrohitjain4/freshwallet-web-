import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import CorePhilosophy from '../components/landing/CorePhilosophy';
import ProductOfferings from '../components/landing/ProductOfferings';
import WhatSetsUsApart from '../components/landing/WhatSetsUsApart';
import FAQ from '../components/landing/FAQ';
import ContactSection from '../components/landing/ContactSection';
import Footer from '../components/landing/Footer';

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#1a2b49] selection:bg-primary selection:text-white font-sans">
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />
        <CorePhilosophy />
        <ProductOfferings />
        <WhatSetsUsApart />
        <FAQ />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
