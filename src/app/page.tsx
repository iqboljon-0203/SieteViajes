import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedTours } from '@/components/sections/FeaturedTours';
import { ServiceBento } from '@/components/sections/ServiceBento';
import { QuizEngine } from '@/components/sections/QuizEngine';
import { EarlyBirdCountdown } from '@/components/sections/EarlyBirdCountdown';
import { Testimonials } from '@/components/sections/Testimonials';
import { InstagramFeed } from '@/components/sections/InstagramFeed';
import { ContactCTA } from '@/components/sections/ContactCTA';

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "SieteViajes Silk Road",
            "url": "https://sieteviajes.com",
            "logo": "https://sieteviajes.com/logo.svg",
            "description": "Exclusive Silk Road adventures through Uzbekistan. Guided tours in Samarkand, Bukhara, and Khiva.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Tashkent",
              "addressCountry": "UZ"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+998-90-963-8875",
              "contactType": "customer service"
            }
          })
        }}
      />
      <HeroSection />
      <FeaturedTours />
      <ServiceBento />
      <Testimonials />
      <EarlyBirdCountdown />
      <QuizEngine />
      <ContactCTA />
      <InstagramFeed />
    </>
  );
}
