import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Perform a simple query to keep the Supabase project active
    const { data, error } = await supabase.from('site_settings').select('id').limit(1);
    
    if (error) {
      console.error('Keepalive error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase keepalive successful',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Unexpected keepalive error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
