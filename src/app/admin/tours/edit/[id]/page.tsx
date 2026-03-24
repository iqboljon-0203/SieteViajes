'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { TourForm } from '@/components/admin/TourForm';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EditTourProps {
  params: Promise<{ id: string }>;
}

export default function EditTourPage({ params }: EditTourProps) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: tour, error } = await supabase
        .from('tours')
        .select(`
          *,
          itinerary:itineraries(*)
        `)
        .eq('id', id)
        .single();
      
      if (!error && tour) {
        // Sort itinerary by day_number
        if (tour.itinerary) {
          tour.itinerary.sort((a: any, b: any) => a.day_number - b.day_number);
        }
        setData(tour);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <Loader2 className="w-10 h-10 text-azure animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-10">
      <header className="max-w-4xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <Link href="/admin/tours" className="flex items-center gap-2 text-slate-500 hover:text-azure transition-colors mb-4 font-bold text-sm">
            <ArrowLeft size={16} /> Back to Tours
          </Link>
          <h1 className="text-3xl font-bold">Edit Tour</h1>
          <p className="text-slate-500">Updating: {data?.title || 'Unknown Tour'}</p>
        </div>
      </header>

      {id && <TourForm tourId={id} />}
    </div>
  );
}
