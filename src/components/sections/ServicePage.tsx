'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { ServiceInquiryForm } from './ServiceInquiryForm';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ServicePageProps {
  type: 'air' | 'train' | 'transport';
  image: string;
}

export function ServicePage({ type, image }: ServicePageProps) {
  const { t } = useLanguage();

  const title = t(`services.${type}.title`);
  const subtitle = t(`services.${type}.subtitle`);

  return (
    <div className="min-h-screen bg-pearl pt-32 pb-20 relative overflow-hidden transition-colors duration-500">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-azure/10 opacity-50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 opacity-50 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {/* Hero Image Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-video rounded-[3rem] overflow-hidden border border-border group shadow-2xl"
            >
              <Image 
                src={image} 
                alt={title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 glass-card-dark dark:bg-surface/50 backdrop-blur-md rounded-full border border-border text-gold text-[10px] font-bold uppercase tracking-[0.2em] italic">
                <Sparkles className="w-3 h-3" />
                Specialized Service
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold font-heading text-text-dark italic uppercase tracking-tight leading-[1.1]">
                {title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 === 1 ? 'text-azure' : 'text-text-dark'}>
                    {word} <br className="hidden md:block" />
                  </span>
                ))}
              </h1>

              <p className="text-xl text-text-muted font-medium italic leading-relaxed max-w-xl">
                {subtitle}
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {[
                { icon: ShieldCheck, title: 'Safe & Secure', desc: 'Official ticketing with insurance coverage.' },
                { icon: Clock, title: '24/7 Priority', desc: 'Real-time booking and changes assistance.' },
                { icon: MapPin, title: 'Across Uzbekistan', desc: 'Every city, airport and station covered.' },
                { icon: Sparkles, title: 'VIP Class', desc: 'The most comfortable options available.' },
              ].map((feature, i) => (
                <div key={i} className="group p-6 bg-surface backdrop-blur-lg rounded-3xl border border-border hover:border-gold/30 transition-all duration-500 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-text-dark font-bold text-sm uppercase tracking-wide mb-1">{feature.title}</h3>
                  <p className="text-text-muted text-[11px] font-medium leading-relaxed italic">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Form Backdrop */}
              <div className="absolute -inset-1 gold-gradient blur-xl opacity-10 rounded-[2.5rem]" />
              
              <div className="relative bg-surface p-8 md:p-10 rounded-[2.5rem] border border-border shadow-xl">
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-bold font-heading text-text-dark italic uppercase tracking-tight mb-2">
                    Request <span className="text-gold">Details</span>
                  </h2>
                  <div className="w-12 h-1 gold-gradient mx-auto rounded-full" />
                </div>

                <ServiceInquiryForm serviceType={type} />
              </div>

              {/* Trust Badges */}
              <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase text-text-dark tracking-widest leading-none">Safe Travel</span>
                    <span className="text-[8px] font-medium text-gold uppercase mt-0.5 tracking-tighter italic">Certified Provider</span>
                 </div>
                 <div className="w-px h-8 bg-border" />
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase text-text-dark tracking-widest leading-none">Instant Support</span>
                    <span className="text-[8px] font-medium text-gold uppercase mt-0.5 tracking-tighter italic">24/7 Concierge</span>
                 </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
