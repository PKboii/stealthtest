export interface Project {
  id: string;
  number: string;
  category: string;
  title: string;
  url: string;
  type: string;
  image: string;
  ctaText: string;
}

export interface Category {
  id: string;
  number: string;
  title: string;
  descriptor: string;
  statement: string[];
  palette: { bg: string; text: string; accent: string };
}

export const projects: Project[] = [
  {
    id: "forma",
    number: "01",
    category: "villas",
    title: "FORMA / 01",
    url: "https://archwebsite-ten.vercel.app/",
    type: "architecture / space / material",
    image: "https://image.qwenlm.ai/generated-images/c9af3011-ffb9-4a8d-9cc6-7e12c9dac419/_result.png",
    ctaText: "ENTER PROJECT ↗"
  },
  {
    id: "cempaka",
    number: "02",
    category: "villas",
    title: "CEMPAKA VILLA BALI",
    url: "https://cempakavillabali.vercel.app/",
    type: "villa / architecture / bali",
    image: "https://image.qwenlm.ai/generated-images/eae5bbd9-5744-451e-9c11-97aad0ee42a2/_result.png",
    ctaText: "ENTER PROJECT ↗"
  },
  {
    id: "cinematic-villa",
    number: "03",
    category: "villas",
    title: "CINEMATIC VILLA EXPERIENCE",
    url: "https://cinematicvillaexp.vercel.app/",
    type: "immersive / architecture / cinematic",
    image: "https://image.qwenlm.ai/generated-images/290d3bd0-a4a9-48e0-9576-ce706c5574fb/_result.png",
    ctaText: "ENTER PROJECT ↗"
  },
  {
    id: "coffee-london",
    number: "04",
    category: "coffee",
    title: "COFFEE SHOP LONDON",
    url: "https://coffeeshoplon.vercel.app/",
    type: "coffee / hospitality / london",
    image: "https://image.qwenlm.ai/generated-images/4608e99d-6184-489e-a9e3-122f45708813/_result.png",
    ctaText: "ENTER PROJECT ↗"
  },
  {
    id: "koppler",
    number: "05",
    category: "coffee",
    title: "KOPPLER COFFEE",
    url: "https://koppler-coffee.vercel.app/",
    type: "coffee / brand / ritual",
    image: "https://image.qwenlm.ai/generated-images/25c1bba9-2003-4a30-8bdc-04590f083a31/_result.png",
    ctaText: "ENTER PROJECT ↗"
  },
  {
    id: "japan-day",
    number: "06",
    category: "nature",
    title: "JAPAN THEMED DAY",
    url: "https://japanthemeday.vercel.app/",
    type: "landscape / immersion / japan",
    image: "https://image.qwenlm.ai/generated-images/aafbddb7-6377-4482-9600-373f8db15e49/_result.png",
    ctaText: "ENTER EXPERIENCE ↗"
  },
  {
    id: "japan-days",
    number: "07",
    category: "nature",
    title: "JAPAN THEMED DAYS",
    url: "https://japanthemedays.vercel.app/",
    type: "landscape / environment / culture",
    image: "https://image.qwenlm.ai/generated-images/63c8a3ea-1c49-4b4b-8ac7-62858aa0c18c/_result.png",
    ctaText: "ENTER EXPERIENCE ↗"
  },
  {
    id: "world-between",
    number: "08",
    category: "cyber",
    title: "WORLD BETWEEN SECONDS",
    url: "https://worldbetweenseconds.vercel.app/",
    type: "experimental / digital / temporal",
    image: "https://image.qwenlm.ai/generated-images/569c8776-d6ea-4552-a522-91ded349f712/_result.png",
    ctaText: "ENTER PROJECT ↗"
  },
  {
    id: "last-internet",
    number: "09",
    category: "cyber",
    title: "THE LAST INTERNET",
    url: "https://the-last-internet.vercel.app/",
    type: "experimental / digital / future",
    image: "https://image.qwenlm.ai/generated-images/569c8776-d6ea-4552-a522-91ded349f712/_result.png",
    ctaText: "ENTER PROJECT ↗"
  },
  {
    id: "city-knows",
    number: "10",
    category: "cyber",
    title: "CITY THAT KNOWS YOU",
    url: "https://citythatknowsyou.vercel.app/",
    type: "interactive / digital / responsive",
    image: "https://image.qwenlm.ai/generated-images/569c8776-d6ea-4552-a522-91ded349f712/_result.png",
    ctaText: "ENTER PROJECT ↗"
  },
  {
    id: "roboson",
    number: "11",
    category: "showroom",
    title: "ROBOSON",
    url: "https://robosonin.vercel.app/",
    type: "product / showroom / design",
    image: "https://image.qwenlm.ai/generated-images/6296e8ea-a35a-4b76-a816-ef0dbbd48e1c/_result.png",
    ctaText: "ENTER PROJECT ↗"
  },
  {
    id: "pizza",
    number: "12",
    category: "dine",
    title: "PIZZA EXPERIENCE",
    url: "https://pizzaexpwebsite.vercel.app/",
    type: "food / experience / brand",
    image: "https://image.qwenlm.ai/generated-images/0fe0418d-0a45-4688-93fc-6dc84157dc6c/_result.png",
    ctaText: "ENTER PROJECT ↗"
  }
];

export const categories: Category[] = [
  {
    id: "villas",
    number: "01",
    title: "VILLAS",
    descriptor: "ARCHITECTURE / HOSPITALITY / SPACE",
    statement: ["PLACES DESIGNED", "TO BE FELT."],
    palette: { bg: "#1a1815", text: "#e8e0d4", accent: "#a09080" }
  },
  {
    id: "coffee",
    number: "02",
    title: "COFFEE SHOPS",
    descriptor: "COFFEE / HOSPITALITY / RITUAL",
    statement: ["SMALL RITUALS.", "BEAUTIFULLY MADE."],
    palette: { bg: "#1c1612", text: "#e8ddd0", accent: "#c4a882" }
  },
  {
    id: "nature",
    number: "03",
    title: "NATURE",
    descriptor: "LANDSCAPE / IMMERSION / ENVIRONMENT",
    statement: ["SOME PLACES", "SHOULD BE ENTERED", "SLOWLY."],
    palette: { bg: "#141a16", text: "#d8e0d8", accent: "#7a9a7a" }
  },
  {
    id: "cyber",
    number: "04",
    title: "CYBER WORLD",
    descriptor: "EXPERIMENTAL / DIGITAL / FUTURE",
    statement: ["THE SCREEN", "IS NOT ALWAYS", "A WINDOW."],
    palette: { bg: "#0a0a0f", text: "#d0d0e0", accent: "#4a5aff" }
  },
  {
    id: "showroom",
    number: "05",
    title: "SHOWROOM & DINE",
    descriptor: "PRODUCT / SHOWROOM / FOOD",
    statement: ["THINGS", "WORTH", "LOOKING AT."],
    palette: { bg: "#0f0f0f", text: "#e8e8e8", accent: "#cc3333" }
  }
];

export function getProjectsByCategory(categoryId: string): Project[] {
  return projects.filter(p => p.category === categoryId);
}

export function getNextProject(currentId: string): Project | null {
  const idx = projects.findIndex(p => p.id === currentId);
  return idx < projects.length - 1 ? projects[idx + 1] : null;
}

export function getPrevProject(currentId: string): Project | null {
  const idx = projects.findIndex(p => p.id === currentId);
  return idx > 0 ? projects[idx - 1] : null;
}

export function getNextCategory(currentId: string): Category | null {
  const idx = categories.findIndex(c => c.id === currentId);
  return idx < categories.length - 1 ? categories[idx + 1] : null;
}
