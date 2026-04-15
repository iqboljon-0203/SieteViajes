import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sieteviajessilkroad.com'
  
  // Fetch dynamic slugs safely
  let tourUrls: any[] = []
  if (supabase) {
    try {
      const { data: tours } = await supabase.from('tours').select('slug, updated_at')
      
      tourUrls = (tours || []).map((tour: any) => ({
        url: `${baseUrl}/tour/${tour.slug}`,
        lastModified: tour.updated_at || new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    } catch (e) {
      console.error('Sitemap generation: tour fetch failed:', e)
    }
  }

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tour-catalog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/air-tickets`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/train-tickets`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/transport`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  return [...staticUrls, ...tourUrls]
}
