import { ServicePage } from '@/components/sections/ServicePage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Train Tickets | SieteViajes Silk Road',
  description: 'Exclusive Afrosiyob high-speed train tickets for your Uzbekistan journey. Fast booking for Samarkand, Bukhara, and Khiva.',
};

export default function TrainTicketsPage() {
  return <ServicePage type="train" image="/images/services/rail.png" />;
}
