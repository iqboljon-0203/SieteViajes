import { ServicePage } from '@/components/sections/ServicePage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VIP Transport | SieteViajes Silk Road',
  description: 'Luxury private transfers and transport services in Uzbekistan. Professional drivers, VIP vehicles, and airport transfers.',
};

export default function TransportPage() {
  return <ServicePage type="transport" image="/images/services/transport.png" />;
}
