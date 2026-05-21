export type HeroSlide = {
  id: string;
  image: string;
  chapter: string;
  headline: [string, string];
  subline: string;
};

const IMG = (id: string, w = 1600, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'a',
    image: IMG('1490481651871-ab68de25d43d', 2000),
    chapter: 'Chapter I',
    headline: ['The', 'Constellation'],
    subline: 'A study in restraint',
  },
  {
    id: 'b',
    image: IMG('1581338834647-b0fb40704e21', 2000),
    chapter: 'Chapter II',
    headline: ['Quiet', 'Authority'],
    subline: 'Tailoring as language',
  },
  {
    id: 'c',
    image: IMG('1469334031218-e382a71b716b', 2000),
    chapter: 'Chapter III',
    headline: ['Long', 'Silhouettes'],
    subline: 'Drawn from the archive',
  },
  {
    id: 'd',
    image: IMG('1483985988355-763728e1935b', 2000),
    chapter: 'Chapter IV',
    headline: ['Hand', 'Finished'],
    subline: 'Eleven seamstresses, one room',
  },
];

export const ATELIER_IMAGE = IMG('1496747611176-843222e1e57c', 2200);

export const SUGGESTED_TERMS = ['Trench', 'Cashmere', 'Silk Slip', 'Evening Glove', 'Tailoring', 'Eyewear'];
export const RECENT_TERMS = ['Halcyon coat', 'Margaux dress', 'Florentine leather'];
