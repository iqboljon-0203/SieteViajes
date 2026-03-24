import { NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate basic requirements
    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // First attempt: try inserting into all columns (assuming patch was applied)
    const insertData: any = {
      type: body.type,
      name: body.name,
      phone: body.phone,
      email: body.email || null,
      tour_name: body.tourName || null,
      num_people: body.people ? Number(body.people) : null,
      message: body.message || null,
      preferences: body.preferences || {},
      locale: body.locale || 'es',
      status: 'new'
    };

    let { data, error: dbError } = await supabase.from('leads').insert([insertData]);

    // If it fails with column mismatch, try a more resilient approach
    if (dbError) {
      console.warn('DB Insert failed, trying fallback mapping:', dbError.message);
      
      const fallbackData = {
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        tour_name: body.tourName || null,
        locale: body.locale || 'es',
        status: 'new',
        preferences: {
          ...body.preferences,
          type: body.type,
          num_people: body.people,
          message: body.message,
          debug_info: 'Column mismatch fallback'
        }
      };
      
      const { error: fallbackError } = await supabase.from('leads').insert([fallbackData]);
      dbError = fallbackError;
    }

    const success = await sendTelegramNotification(body);

    if (success || !dbError) {
      return NextResponse.json({ success: true });
    } else {
      console.error('Final Failure - DB:', dbError, 'Telegram:', success);
      return NextResponse.json(
        { error: 'Failed to process lead', detail: dbError?.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
