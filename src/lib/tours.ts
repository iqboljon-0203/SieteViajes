export interface TourDay {
  day: number;
  title: string;
  titleEn: string;
  titleRu?: string;
  titleUz?: string;
  description: string;
  descriptionEn: string;
  descriptionRu?: string;
  descriptionUz?: string;
  image?: string;
}

export interface Tour {
  slug: string;
  title: string;
  titleEn: string;
  titleRu?: string;
  titleUz?: string;
  subtitle: string;
  subtitleEn: string;
  subtitleRu?: string;
  subtitleUz?: string;
  image: string;
  gallery: string[];
  priceUSD: number;
  originalPriceUSD?: number;
  duration: number;
  nights: number;
  stars: number;
  cities: string[];
  citiesEn: string[];
  citiesRu?: string[];
  citiesUz?: string[];
  type: 'cultural' | 'adventure' | 'luxury' | 'gastronomic';
  highlights: string[];
  highlightsEn: string[];
  highlightsRu?: string[];
  highlightsUz?: string[];
  itinerary: TourDay[];
  addonPrices: {
    visa: number;
    transport: number;
    guide: number;
  };
  childDiscount: number; // percentage
  featured?: boolean;
  hotDeal?: boolean;
  hotDealEndDate?: string;
}

export const tours: Tour[] = [
  {
    slug: 'ruta-clasica-uzbekistan',
    title: 'Ruta Clásica de Uzbekistán',
    titleEn: 'Classic Uzbekistan Route',
    titleRu: 'Классический маршрут Узбекистана',
    titleUz: 'Oʻzbekistonning klassik yoʻnalishi',
    subtitle: 'Descubre las joyas de la Ruta de la Seda en 8 días inolvidables',
    subtitleEn: 'Discover the jewels of the Silk Road in 8 unforgettable days',
    subtitleRu: 'Откройте жемчужины Шелкового пути за 8 незабываемых дней',
    subtitleUz: '8 unutilmas kun ichida Ipak yoʻli gavharlarini kashf eting',
    image: '/images/hero-registan.png',
    gallery: ['/images/hero-registan.png', '/images/tour-bukhara.png', '/images/tour-khiva.png'],
    priceUSD: 2450,
    originalPriceUSD: 2950,
    duration: 8,
    nights: 7,
    stars: 4,
    cities: ['Taskent', 'Samarcanda', 'Bujará', 'Jiva'],
    citiesEn: ['Tashkent', 'Samarkand', 'Bukhara', 'Khiva'],
    citiesRu: ['Ташкент', 'Самарканд', 'Бухара', 'Хива'],
    citiesUz: ['Toshkent', 'Samarqand', 'Buxoro', 'Xiva'],
    type: 'cultural',
    highlights: [
      'Visita guiada al Registán',
      'Cena tradicional en Bujará',
      'Paseo por la fortaleza de Jiva',
      'Hotel boutique 4 estrellas',
    ],
    highlightsEn: [
      'Guided visit to Registan',
      'Traditional dinner in Bukhara',
      'Walk through Khiva fortress',
      '4-star boutique hotel',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Llegada a Taskent: El Portal de la Seda',
        titleEn: 'Arrival in Tashkent: The Silk Gateway',
        description: 'Recepción en el aeropuerto y traslado al hotel boutique. Paseo por el casco antiguo y visita al bazar Chorsu. Cena de bienvenida con gastronomía uzbeka.',
        descriptionEn: 'Airport reception and transfer to boutique hotel. Stroll through the old town and visit Chorsu bazaar. Welcome dinner with Uzbek cuisine.',
        image: '/images/tour-tashkent.png',
      },
      {
        day: 2,
        title: 'Taskent - Samarcanda: Ciudad de las Estrellas',
        titleEn: 'Tashkent - Samarkand: City of Stars',
        description: 'Tren de alta velocidad Afrosiyob a Samarcanda. Visita a la Plaza del Registán, Gur-e-Amir y la Mezquita de Bibi-Khanym.',
        descriptionEn: 'High-speed Afrosiyob train to Samarkand. Visit Registan Square, Gur-e-Amir and Bibi-Khanym Mosque.',
        image: '/images/hero-registan.png',
      },
      {
        day: 3,
        title: 'Samarcanda: Necrópolis y Observatorio',
        titleEn: 'Samarkand: Necropolis & Observatory',
        description: 'Exploración de Shah-i-Zinda, el Observatorio de Ulugh Beg y talleres artesanales de seda y papel.',
        descriptionEn: 'Explore Shah-i-Zinda, Ulugh Beg Observatory and artisanal silk and paper workshops.',
        image: '/images/tour-samarkand.png',
      },
      {
        day: 4,
        title: 'Samarcanda - Bujará: Cruzando el Desierto',
        titleEn: 'Samarkand - Bukhara: Crossing the Desert',
        description: 'Viaje escénico a Bujará. Llegada y paseo por el centro histórico. Visita nocturna al estanque Lyabi-Hauz.',
        descriptionEn: 'Scenic journey to Bukhara. Arrival and stroll through the historic center. Evening visit to Lyabi-Hauz pond.',
        image: '/images/tour-silk-road.png',
      },
      {
        day: 5,
        title: 'Bujará: La Perla de la Ruta de la Seda',
        titleEn: 'Bukhara: The Pearl of the Silk Road',
        description: 'Tour completo: Minarete Kalón, Madrasa Mir-i-Arab, la Fortaleza Ark y los bazares cubiertos. Cena tradicional con espectáculo folclórico.',
        descriptionEn: 'Full tour: Kalon Minaret, Mir-i-Arab Madrasa, Ark Fortress and covered bazaars. Traditional dinner with folk show.',
        image: '/images/tour-bukhara.png',
      },
      {
        day: 6,
        title: 'Bujará - Jiva: La Ciudad Museo',
        titleEn: 'Bukhara - Khiva: The Museum City',
        description: 'Traslado a Jiva cruzando el desierto de Kyzylkum. Llegada y primer contacto con la ciudadela amurallada de Itchan Kala.',
        descriptionEn: 'Transfer to Khiva crossing the Kyzylkum desert. Arrival and first contact with the walled citadel of Itchan Kala.',
        image: '/images/tour-khiva.png',
      },
      {
        day: 7,
        title: 'Jiva: Palacios y Minaretes',
        titleEn: 'Khiva: Palaces & Minarets',
        description: 'Día completo explorando Itchan Kala: Minarete Kalta Minor, Palacio Tash Khovli, Madrasa Muhammad Amin Khan. Atardecer desde las murallas.',
        descriptionEn: 'Full day exploring Itchan Kala: Kalta Minor Minaret, Tash Khovli Palace, Muhammad Amin Khan Madrasa. Sunset from the walls.',
        image: '/images/tour-khiva.png',
      },
      {
        day: 8,
        title: 'Regreso y Despedida',
        titleEn: 'Return & Farewell',
        description: 'Vuelo doméstico a Taskent. Tiempo libre para compras de recuerdos. Traslado al aeropuerto. ¡Hasta la próxima aventura!',
        descriptionEn: 'Domestic flight to Tashkent. Free time for souvenir shopping. Airport transfer. Until the next adventure!',
      },
    ],
    addonPrices: {
      visa: 80,
      transport: 350,
      guide: 200,
    },
    childDiscount: 30,
    featured: true,
    hotDeal: true,
    hotDealEndDate: '2026-04-15T23:59:59',
  },
  {
    slug: 'samarcanda-esencial',
    title: 'Samarcanda Esencial',
    titleEn: 'Essential Samarkand',
    subtitle: 'Una inmersión profunda en la joya de la Ruta de la Seda',
    subtitleEn: 'A deep immersion into the jewel of the Silk Road',
    image: '/images/tour-samarkand.png',
    gallery: ['/images/tour-samarkand.png', '/images/hero-registan.png'],
    priceUSD: 1280,
    duration: 5,
    nights: 4,
    stars: 4,
    cities: ['Taskent', 'Samarcanda'],
    citiesEn: ['Tashkent', 'Samarkand'],
    type: 'cultural',
    highlights: [
      'Registán al atardecer',
      'Taller de cerámica artesanal',
      'Gastronomía local auténtica',
      'Hotel boutique 4 estrellas',
    ],
    highlightsEn: [
      'Registan at sunset',
      'Artisanal ceramics workshop',
      'Authentic local cuisine',
      '4-star boutique hotel',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Llegada a Taskent',
        titleEn: 'Arrival in Tashkent',
        description: 'Recepción y traslado al hotel. Paseo por la ciudad moderna.',
        descriptionEn: 'Reception and hotel transfer. Stroll through the modern city.',
        image: '/images/tour-tashkent.png',
      },
      {
        day: 2,
        title: 'Taskent - Samarcanda',
        titleEn: 'Tashkent - Samarkand',
        description: 'Tren Afrosiyob a Samarcanda. Visita al Registán y Gur-e-Amir.',
        descriptionEn: 'Afrosiyob train to Samarkand. Visit Registan and Gur-e-Amir.',
        image: '/images/hero-registan.png',
      },
      {
        day: 3,
        title: 'Samarcanda en Profundidad',
        titleEn: 'Samarkand in Depth',
        description: 'Shah-i-Zinda, Observatorio de Ulugh Beg y talleres artesanales.',
        descriptionEn: 'Shah-i-Zinda, Ulugh Beg Observatory and artisan workshops.',
        image: '/images/tour-samarkand.png',
      },
      {
        day: 4,
        title: 'Día Libre en Samarcanda',
        titleEn: 'Free Day in Samarkand',
        description: 'Día libre para explorar a tu ritmo. Opción: taller de cerámica.',
        descriptionEn: 'Free day to explore at your own pace. Option: ceramics workshop.',
      },
      {
        day: 5,
        title: 'Regreso a Taskent',
        titleEn: 'Return to Tashkent',
        description: 'Tren de regreso y traslado al aeropuerto.',
        descriptionEn: 'Return train and airport transfer.',
      },
    ],
    addonPrices: {
      visa: 80,
      transport: 200,
      guide: 150,
    },
    childDiscount: 25,
    featured: true,
  },
  {
    slug: 'aventura-desierto-kyzylkum',
    title: 'Aventura en el Desierto de Kyzylkum',
    titleEn: 'Kyzylkum Desert Adventure',
    subtitle: 'Camellos, estrellas y la inmensidad del desierto de la Ruta de la Seda',
    subtitleEn: 'Camels, stars and the vastness of the Silk Road desert',
    image: '/images/tour-silk-road.png',
    gallery: ['/images/tour-silk-road.png', '/images/tour-bukhara.png'],
    priceUSD: 1890,
    duration: 6,
    nights: 5,
    stars: 3,
    cities: ['Bujará', 'Desierto Kyzylkum'],
    citiesEn: ['Bukhara', 'Kyzylkum Desert'],
    type: 'adventure',
    highlights: [
      'Noche en campamento del desierto',
      'Paseo en camello al atardecer',
      'Observación de estrellas',
      'Cocina nómada tradicional',
    ],
    highlightsEn: [
      'Night in desert camp',
      'Camel ride at sunset',
      'Stargazing session',
      'Traditional nomadic cuisine',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Llegada a Bujará',
        titleEn: 'Arrival in Bukhara',
        description: 'Recepción y check-in en hotel tradicional.',
        descriptionEn: 'Reception and check-in at traditional hotel.',
        image: '/images/tour-bukhara.png',
      },
      {
        day: 2,
        title: 'Bujará Histórica',
        titleEn: 'Historic Bukhara',
        description: 'Tour por el centro histórico de Bujará.',
        descriptionEn: 'Tour through the historic center of Bukhara.',
        image: '/images/tour-bukhara.png',
      },
      {
        day: 3,
        title: 'Hacia el Desierto',
        titleEn: 'Into the Desert',
        description: 'Viaje al desierto. Paseo en camello y campamento bajo las estrellas.',
        descriptionEn: 'Journey to the desert. Camel ride and camp under the stars.',
        image: '/images/tour-silk-road.png',
      },
      {
        day: 4,
        title: 'Amanecer en el Desierto',
        titleEn: 'Desert Sunrise',
        description: 'Amanecer en las dunas. Exploración de antiguos caravasares.',
        descriptionEn: 'Sunrise on the dunes. Explore ancient caravanserais.',
      },
      {
        day: 5,
        title: 'Regreso a Bujará',
        titleEn: 'Return to Bukhara',
        description: 'Regreso a la ciudad. Tiempo libre y cena de despedida.',
        descriptionEn: 'Return to the city. Free time and farewell dinner.',
      },
      {
        day: 6,
        title: 'Despedida',
        titleEn: 'Farewell',
        description: 'Traslado al aeropuerto.',
        descriptionEn: 'Airport transfer.',
      },
    ],
    addonPrices: {
      visa: 80,
      transport: 300,
      guide: 180,
    },
    childDiscount: 20,
  },
  {
    slug: 'lujo-silk-road',
    title: 'Lujo en la Ruta de la Seda',
    titleEn: 'Silk Road Luxury',
    subtitle: 'La experiencia premium con hoteles 5 estrellas y servicio VIP',
    subtitleEn: 'The premium experience with 5-star hotels and VIP service',
    image: '/images/tour-bukhara.png',
    gallery: ['/images/tour-bukhara.png', '/images/hero-registan.png', '/images/tour-khiva.png'],
    priceUSD: 4200,
    duration: 10,
    nights: 9,
    stars: 5,
    cities: ['Taskent', 'Samarcanda', 'Bujará', 'Jiva'],
    citiesEn: ['Tashkent', 'Samarkand', 'Bukhara', 'Khiva'],
    type: 'luxury',
    highlights: [
      'Hoteles 5 estrellas en cada ciudad',
      'Transporte privado con chofer',
      'Cenas privadas en monumentos',
      'Guía personal hispanohablante',
    ],
    highlightsEn: [
      '5-star hotels in every city',
      'Private transport with driver',
      'Private dinners at monuments',
      'Personal Spanish-speaking guide',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Bienvenida VIP en Taskent',
        titleEn: 'VIP Welcome in Tashkent',
        description: 'Recepción VIP con limusina. Check-in en el mejor hotel de Taskent.',
        descriptionEn: 'VIP reception with limousine. Check-in at the best hotel in Tashkent.',
        image: '/images/tour-tashkent.png',
      },
      {
        day: 2,
        title: 'Taskent Exclusiva',
        titleEn: 'Exclusive Tashkent',
        description: 'Tour privado por lo mejor de Taskent con guía personal.',
        descriptionEn: 'Private tour of the best of Tashkent with personal guide.',
      },
      {
        day: 3,
        title: 'Primera Clase a Samarcanda',
        titleEn: 'First Class to Samarkand',
        description: 'Tren en primera clase. Suite en hotel 5 estrellas.',
        descriptionEn: 'First class train. Suite at 5-star hotel.',
        image: '/images/hero-registan.png',
      },
      {
        day: 4,
        title: 'Samarcanda VIP',
        titleEn: 'VIP Samarkand',
        description: 'Tour privado del Registán. Cena exclusiva en el Gur-e-Amir.',
        descriptionEn: 'Private Registan tour. Exclusive dinner at Gur-e-Amir.',
        image: '/images/tour-samarkand.png',
      },
      {
        day: 5,
        title: 'Artesanía de Lujo',
        titleEn: 'Luxury Craftsmanship',
        description: 'Visita a talleres de seda y cerámica con maestros artesanos.',
        descriptionEn: 'Visit silk and ceramic workshops with master artisans.',
      },
      {
        day: 6,
        title: 'Viaje a Bujará',
        titleEn: 'Journey to Bukhara',
        description: 'Traslado privado con paradas en caravasares históricos.',
        descriptionEn: 'Private transfer with stops at historic caravanserais.',
        image: '/images/tour-bukhara.png',
      },
      {
        day: 7,
        title: 'Bujará de Ensueño',
        titleEn: 'Dreamy Bukhara',
        description: 'Tour VIP por Bujará. Cena privada junto al estanque Lyabi-Hauz.',
        descriptionEn: 'VIP Bukhara tour. Private dinner by Lyabi-Hauz pond.',
      },
      {
        day: 8,
        title: 'Vuelo Privado a Jiva',
        titleEn: 'Private Flight to Khiva',
        description: 'Vuelo exclusivo a Jiva. Check-in al Palacio convertido en hotel.',
        descriptionEn: 'Exclusive flight to Khiva. Check-in at Palace-turned-hotel.',
        image: '/images/tour-khiva.png',
      },
      {
        day: 9,
        title: 'Jiva Monumental',
        titleEn: 'Monumental Khiva',
        description: 'Tour privado por Itchan Kala. Cena de despedida en la terraza.',
        descriptionEn: 'Private Itchan Kala tour. Farewell dinner on the terrace.',
      },
      {
        day: 10,
        title: 'Regreso VIP',
        titleEn: 'VIP Return',
        description: 'Vuelo a Taskent y traslado VIP al aeropuerto internacional.',
        descriptionEn: 'Flight to Tashkent and VIP transfer to international airport.',
      },
    ],
    addonPrices: {
      visa: 0, // included
      transport: 0, // included
      guide: 0, // included
    },
    childDiscount: 35,
    featured: true,
  },
  {
    slug: 'sabores-uzbekistan',
    title: 'Sabores de Uzbekistán',
    titleEn: 'Flavors of Uzbekistan',
    subtitle: 'Un viaje gastronómico por los sabores de la Ruta de la Seda',
    subtitleEn: 'A gastronomic journey through the flavors of the Silk Road',
    image: '/images/tour-tashkent.png',
    gallery: ['/images/tour-tashkent.png', '/images/tour-bukhara.png'],
    priceUSD: 1650,
    duration: 7,
    nights: 6,
    stars: 4,
    cities: ['Taskent', 'Samarcanda', 'Bujará'],
    citiesEn: ['Tashkent', 'Samarkand', 'Bukhara'],
    type: 'gastronomic',
    highlights: [
      'Clases de cocina con chefs locales',
      'Tour de mercados y bazares',
      'Degustación de vinos uzbekos',
      'Cena con familia local',
    ],
    highlightsEn: [
      'Cooking classes with local chefs',
      'Market and bazaar tours',
      'Uzbek wine tasting',
      'Dinner with a local family',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Llegada Gastronómica',
        titleEn: 'Gastronomic Arrival',
        description: 'Llegada y cena de bienvenida con platos típicos uzbekos.',
        descriptionEn: 'Arrival and welcome dinner with typical Uzbek dishes.',
        image: '/images/tour-tashkent.png',
      },
      {
        day: 2,
        title: 'Bazar de Sabores',
        titleEn: 'Bazaar of Flavors',
        description: 'Visita al Bazar Chorsu. Clase de plov con chef local.',
        descriptionEn: 'Visit Chorsu Bazaar. Plov cooking class with local chef.',
      },
      {
        day: 3,
        title: 'Taskent - Samarcanda',
        titleEn: 'Tashkent - Samarkand',
        description: 'Viaje a Samarcanda. Degustación de pan Samarkandí.',
        descriptionEn: 'Journey to Samarkand. Tasting of Samarkand bread.',
        image: '/images/hero-registan.png',
      },
      {
        day: 4,
        title: 'Cocina Samarcandí',
        titleEn: 'Samarkand Cuisine',
        description: 'Clase de cocina: preparación de manti y lagman.',
        descriptionEn: 'Cooking class: manti and lagman preparation.',
      },
      {
        day: 5,
        title: 'Ruta a Bujará',
        titleEn: 'Route to Bukhara',
        description: 'Viaje a Bujará. Cena con familia local.',
        descriptionEn: 'Journey to Bukhara. Dinner with a local family.',
        image: '/images/tour-bukhara.png',
      },
      {
        day: 6,
        title: 'Secretos de Bujará',
        titleEn: 'Bukhara Secrets',
        description: 'Exploración culinaria de Bujará. Vinos y postres.',
        descriptionEn: 'Culinary exploration of Bukhara. Wine and desserts.',
      },
      {
        day: 7,
        title: 'Despedida Culinaria',
        titleEn: 'Culinary Farewell',
        description: 'Última clase de cocina y traslado al aeropuerto.',
        descriptionEn: 'Final cooking class and airport transfer.',
      },
    ],
    addonPrices: {
      visa: 80,
      transport: 250,
      guide: 180,
    },
    childDiscount: 25,
  },
  {
    slug: 'jiva-la-ciudad-museo',
    title: 'Jiva: La Ciudad Museo',
    titleEn: 'Khiva: The Museum City',
    subtitle: 'Tres días en la ciudad amurallada más preservada de Asia Central',
    subtitleEn: 'Three days in the best-preserved walled city in Central Asia',
    image: '/images/tour-khiva.png',
    gallery: ['/images/tour-khiva.png'],
    priceUSD: 890,
    duration: 3,
    nights: 2,
    stars: 3,
    cities: ['Jiva'],
    citiesEn: ['Khiva'],
    type: 'cultural',
    highlights: [
      'Itchan Kala al atardecer',
      'Minarete Kalta Minor',
      'Palacio Tash Khovli',
      'Artesanía en madera tallada',
    ],
    highlightsEn: [
      'Itchan Kala at sunset',
      'Kalta Minor Minaret',
      'Tash Khovli Palace',
      'Carved wood craftsmanship',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Llegada a Jiva',
        titleEn: 'Arrival in Khiva',
        description: 'Llegada y primer paseo por Itchan Kala.',
        descriptionEn: 'Arrival and first stroll through Itchan Kala.',
        image: '/images/tour-khiva.png',
      },
      {
        day: 2,
        title: 'Jiva Monumental',
        titleEn: 'Monumental Khiva',
        description: 'Tour completo por la ciudadela amurallada.',
        descriptionEn: 'Full tour of the walled citadel.',
      },
      {
        day: 3,
        title: 'Despedida de Jiva',
        titleEn: 'Farewell to Khiva',
        description: 'Últimas compras y traslado.',
        descriptionEn: 'Final shopping and transfer.',
      },
    ],
    addonPrices: {
      visa: 80,
      transport: 150,
      guide: 120,
    },
    childDiscount: 20,
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}

export function getFeaturedTours(): Tour[] {
  return tours.filter((t) => t.featured);
}

export function getHotDealTour(): Tour | undefined {
  return tours.find((t) => t.hotDeal);
}

export function getTourTranslation(tour: Tour, locale: string) {
  if (locale === 'es') {
    return {
      title: tour.title,
      subtitle: tour.subtitle,
      cities: tour.cities,
      highlights: tour.highlights,
    };
  }
  if (locale === 'ru') {
    return {
      title: tour.titleRu || tour.titleEn,
      subtitle: tour.subtitleRu || tour.subtitleEn,
      cities: tour.citiesRu || tour.citiesEn,
      highlights: tour.highlightsRu || tour.highlightsEn,
    };
  }
  if (locale === 'uz') {
    return {
      title: tour.titleUz || tour.titleEn,
      subtitle: tour.subtitleUz || tour.subtitleEn,
      cities: tour.citiesUz || tour.citiesEn,
      highlights: tour.highlightsUz || tour.highlightsEn,
    };
  }
  // Default (en)
  return {
    title: tour.titleEn,
    subtitle: tour.subtitleEn,
    cities: tour.citiesEn,
    highlights: tour.highlightsEn,
  };
}
