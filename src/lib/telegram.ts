// Telegram Bot notification helper
// Replace BOT_TOKEN and CHAT_ID with your actual values

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID';

interface LeadData {
  type: 'quiz' | 'booking' | 'contact';
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  tourName?: string;
  total?: string;
  date?: string;
  preferences?: Record<string, string>;
  locale?: string;
}

export async function sendTelegramNotification(data: LeadData): Promise<boolean> {
  const emoji: Record<string, string> = {
    quiz: '🎯',
    booking: '📋',
    contact: '📩',
  };

  let text = `${emoji[data.type]} <b>Yangi Mijoz — ${data.type.toUpperCase()}</b>\n\n`;
  
  const flags: Record<string, string> = { es: '🇪🇸', en: '🇬🇧', ru: '🇷🇺', uz: '🇺🇿' };
  if (data.locale) {
    text += `🌐 <b>Til:</b> ${flags[data.locale] || '❓'} (${data.locale.toUpperCase()})\n`;
  }
  
  text += `👤 <b>Ism:</b> ${data.name}\n`;

  if (data.phone) text += `📱 <b>Telefon:</b> ${data.phone}\n`;
  if (data.email) text += `📧 <b>Email:</b> ${data.email}\n`;
  if (data.tourName) text += `🗺 <b>Tur nomi:</b> ${data.tourName}\n`;
  if (data.date) text += `📅 <b>Tanlangan Sana:</b> ${data.date}\n`;
  if (data.total) text += `💰 <b>Hisoblangan narx:</b> ${data.total}\n`;
  if (data.message) text += `💬 <b>Xabar:</b> ${data.message}\n`;

  if (data.preferences) {
    text += `\n📊 <b>Mijoz tanlovlari (Quiz):</b>\n`;
    Object.entries(data.preferences).forEach(([key, value]) => {
      text += `  • ${key}: ${value}\n`;
    });
  }

  text += `\n⏰ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`;

  const inline_keyboard: any[] = [];
  
  if (data.phone) {
    const cleanPhone = data.phone.replace(/[^\d+]/g, '');
    // telegram API faqat http/https/tg havolalarini qabul qiladi. tel: va mailto: mumkin emas.
    inline_keyboard.push([{ text: '💬 WhatsApp orqali yozish', url: `https://wa.me/${cleanPhone.replace('+', '')}` }]);
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML',
          reply_markup: inline_keyboard.length > 0 ? { inline_keyboard } : undefined,
        }),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram API rejected the request:', response.status, errorText, 'CHAT_ID:', TELEGRAM_CHAT_ID);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Telegram notification failed:', error);
    return false;
  }
}
