import { ServicePage } from '@/components/sections/ServicePage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Air Tickets | SieteViajes Silk Road',
  description: 'Book domestic and international flights in Uzbekistan with SieteViajes. Best rates for Tashkent, Samarkand, Bukhara and more.',
};

export default function AirTicketsPage() {
  return <ServicePage type="air" image="/images/services/air.png" />;
}
