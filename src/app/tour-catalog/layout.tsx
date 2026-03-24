import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Silk Road Tours | SieteViajes Silk Road',
  description: 'Browse our exclusive collection of Silk Road experiences. From Samarkand to Khiva, find your perfect luxury or adventure tour in Uzbekistan.',
  openGraph: {
    title: 'Silk Road Tour Catalog | SieteViajes',
    description: 'Exclusive tours through the heart of Uzbekistan.',
    images: ['/images/hero-registan.png'],
  },
};

export default function TourCatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
