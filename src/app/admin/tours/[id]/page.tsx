'use client';

import { useParams } from 'next/navigation';
import { TourForm } from '@/components/admin/TourForm';

export default function EditTourPage() {
  const { id } = useParams();
  
  return (
    <div className="p-4 md:p-8">
      <TourForm tourId={id as string} />
    </div>
  );
}
