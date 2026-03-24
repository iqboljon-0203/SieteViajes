import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { TourDetailClient } from '@/components/sections/TourDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getTourWithItinerary(slug: string) {
  const { data: tour, error } = await supabase
    .from('tours')
    .select('*, itineraries(*)')
    .eq('slug', slug)
    .single();

  if (error || !tour) return null;
  
  // Sort itineraries by day_number
  if (tour.itineraries) {
    tour.itineraries.sort((a: any, b: any) => a.day_number - b.day_number);
  }
  
  return tour;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourWithItinerary(slug);

  if (!tour) {
    return {
      title: 'Tour Not Found | SieteViajes Silk Road',
    };
  }

  const title = tour.title_en || tour.title;
  const subtitle = tour.subtitle_en || tour.subtitle;

  return {
    title: `${title} | SieteViajes Silk Road`,
    description: subtitle,
    openGraph: {
      title: title,
      description: subtitle,
      images: [{ url: tour.image_url || tour.image }],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const tour = await getTourWithItinerary(slug);

  if (!tour) {
    notFound();
  }

  const title = tour.title_en || tour.title;
  const description = tour.subtitle_en || tour.subtitle;
  const image = tour.image_url || tour.image;
  const price = tour.price_usd || tour.priceUSD;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            "name": title,
            "description": description,
            "image": image,
            "itinerary": tour.itineraries?.map((it: any) => ({
              "@type": "City",
              "name": it.title_en || it.title
            })),
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": price,
              "availability": "https://schema.org/InStock",
              "url": `https://sieteviajes.com/tour/${slug}`
            },
            "provider": {
              "@type": "TravelAgency",
              "name": "SieteViajes Silk Road",
              "url": "https://sieteviajes.com"
            }
          })
        }}
      />
      <TourDetailClient tour={tour} />
    </>
  );
}
