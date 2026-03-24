import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Data may not be dynamic.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TourDB {
  id: string;
  slug: string;
  title: string;
  title_en: string;
  title_ru?: string;
  title_uz?: string;
  subtitle: string;
  subtitle_en: string;
  subtitle_ru?: string;
  subtitle_uz?: string;
  image_url: string;
  price_usd: number;
  original_price_usd?: number;
  duration_days: number;
  nights_count: number;
  stars_rating: number;
  tour_type: 'cultural' | 'adventure' | 'luxury' | 'gastronomic';
  is_featured: boolean;
  is_hot_deal: boolean;
  hot_deal_end_date?: string;
  highlights_js: string[];
  highlights_en_js: string[];
  highlights_ru_js?: string[];
  highlights_uz_js?: string[];
  addon_prices_js: {
    visa: number;
    transport: number;
    guide: number;
  };
  child_discount_pct: number;
  created_at: string;
}

export interface ItineraryDB {
  id: string;
  tour_id: string;
  day_number: number;
  title: string;
  title_en: string;
  title_ru?: string;
  title_uz?: string;
  description: string;
  description_en: string;
  description_ru?: string;
  description_uz?: string;
  image_url?: string;
}
