/* FLYBOO.COM — Travel Visa: curated destination list.
   Used by the hero autocomplete, the enquiry form's destination menu and the
   popular-destination cards.

   Each entry:
     slug     unique id, also used in ?destination=<slug>
     name     display name
     aliases  other names people may type (matched in autocomplete only)
     page     URL of the destination's visa detail page, or null.
              While null, choosing the destination opens the enquiry form
              pre-filled with it. Set `page` once a verified detail page exists.

   NOTE: this file lists destinations only. It contains no visa fees, processing
   times or entry rules — those must be verified against official government or
   embassy sources before being added to any detail page. */
window.FLYBOO_VISA_DESTINATIONS = [
  { slug: 'uae', name: 'United Arab Emirates', aliases: ['UAE', 'Dubai', 'Abu Dhabi', 'Sharjah'], page: null },
  { slug: 'singapore', name: 'Singapore', aliases: [], page: null },
  { slug: 'thailand', name: 'Thailand', aliases: ['Bangkok', 'Phuket'], page: null },
  { slug: 'malaysia', name: 'Malaysia', aliases: ['Kuala Lumpur'], page: null },
  { slug: 'uk', name: 'United Kingdom', aliases: ['UK', 'Britain', 'Great Britain', 'England', 'London', 'Scotland', 'Wales'], page: null },
  { slug: 'schengen', name: 'Schengen Area', aliases: ['Europe', 'France', 'Germany', 'Italy', 'Spain', 'Switzerland', 'Netherlands', 'Austria', 'Greece', 'Portugal', 'Belgium', 'Norway', 'Sweden', 'Finland', 'Denmark', 'Iceland', 'Czech Republic', 'Poland', 'Hungary'], page: null },
  { slug: 'usa', name: 'United States', aliases: ['USA', 'US', 'America', 'United States of America'], page: null },
  { slug: 'canada', name: 'Canada', aliases: [], page: null },
  { slug: 'australia', name: 'Australia', aliases: [], page: null },
  { slug: 'new-zealand', name: 'New Zealand', aliases: [], page: null },
  { slug: 'ireland', name: 'Ireland', aliases: [], page: null },
  { slug: 'japan', name: 'Japan', aliases: ['Tokyo'], page: null },
  { slug: 'south-korea', name: 'South Korea', aliases: ['Korea', 'Seoul'], page: null },
  { slug: 'china', name: 'China', aliases: [], page: null },
  { slug: 'hong-kong', name: 'Hong Kong', aliases: [], page: null },
  { slug: 'vietnam', name: 'Vietnam', aliases: [], page: null },
  { slug: 'cambodia', name: 'Cambodia', aliases: [], page: null },
  { slug: 'indonesia', name: 'Indonesia', aliases: ['Bali'], page: null },
  { slug: 'philippines', name: 'Philippines', aliases: [], page: null },
  { slug: 'sri-lanka', name: 'Sri Lanka', aliases: [], page: null },
  { slug: 'nepal', name: 'Nepal', aliases: [], page: null },
  { slug: 'bhutan', name: 'Bhutan', aliases: [], page: null },
  { slug: 'maldives', name: 'Maldives', aliases: [], page: null },
  { slug: 'mauritius', name: 'Mauritius', aliases: [], page: null },
  { slug: 'turkey', name: 'Turkey', aliases: ['Türkiye', 'Turkiye', 'Istanbul'], page: null },
  { slug: 'egypt', name: 'Egypt', aliases: [], page: null },
  { slug: 'saudi-arabia', name: 'Saudi Arabia', aliases: ['KSA'], page: null },
  { slug: 'qatar', name: 'Qatar', aliases: ['Doha'], page: null },
  { slug: 'oman', name: 'Oman', aliases: [], page: null },
  { slug: 'bahrain', name: 'Bahrain', aliases: [], page: null },
  { slug: 'kuwait', name: 'Kuwait', aliases: [], page: null },
  { slug: 'jordan', name: 'Jordan', aliases: [], page: null },
  { slug: 'azerbaijan', name: 'Azerbaijan', aliases: ['Baku'], page: null },
  { slug: 'georgia', name: 'Georgia', aliases: ['Tbilisi'], page: null },
  { slug: 'kazakhstan', name: 'Kazakhstan', aliases: [], page: null },
  { slug: 'uzbekistan', name: 'Uzbekistan', aliases: [], page: null },
  { slug: 'south-africa', name: 'South Africa', aliases: [], page: null },
  { slug: 'kenya', name: 'Kenya', aliases: [], page: null },
  { slug: 'tanzania', name: 'Tanzania', aliases: ['Zanzibar'], page: null },
  { slug: 'mexico', name: 'Mexico', aliases: [], page: null },
  { slug: 'brazil', name: 'Brazil', aliases: [], page: null }
];

/* Shown when the search box is focused but empty. */
window.FLYBOO_VISA_POPULAR = ['uae', 'singapore', 'thailand', 'malaysia', 'uk', 'schengen'];

/* Visa categories offered in the enquiry form. Availability varies by destination. */
window.FLYBOO_VISA_CATEGORIES = [
  { value: 'tourist', label: 'Tourist' },
  { value: 'business', label: 'Business' },
  { value: 'transit', label: 'Transit' },
  { value: 'student', label: 'Student' },
  { value: 'other', label: 'Other / not sure' }
];
