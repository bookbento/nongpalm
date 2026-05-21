export type HeroSlide = {
  id: string;
  image: string;
  chapter: string;
  headline: [string, string];
  subline: string;
};

export type Piece = {
  id: number;
  name: string;
  cat: string;
  price: string;
  img: string;
};

export type FloatingPiece = {
  id: number;
  name: string;
  meta: string;
  img: string;
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

export const COLLECTION: Piece[] = [
  { id: 1, name: 'Halcyon Trench, Camel', cat: 'Outerwear', price: '€ 4,280', img: IMG('1487222477894-8943e31ef7b2', 1200) },
  { id: 2, name: 'Estelle Leather Tote', cat: 'Leather Goods', price: '€ 3,120', img: IMG('1601121141461-9d6647bca1ed', 1200) },
  { id: 3, name: 'Margaux Silk Slip', cat: 'Ready-to-Wear', price: '€ 2,640', img: IMG('1551803091-e20673f15770', 1200) },
  { id: 4, name: 'Notte Cashmere Coat', cat: 'Outerwear', price: '€ 5,950', img: IMG('1496747611176-843222e1e57c', 1200) },
  { id: 5, name: 'Solenne Pump, Ink', cat: 'Footwear', price: '€ 1,890', img: IMG('1591047139829-d91aecb6caea', 1200) },
  { id: 6, name: 'Aurore Frame Sunglass', cat: 'Eyewear', price: '€ 690', img: IMG('1572635196237-14b3f281503f', 1200) },
];

export const FLOATING: FloatingPiece[] = [
  { id: 1, name: 'The Eden Trouser', meta: '03 / 24 — Tailoring', img: IMG('1485231183945-fffde7cc051e', 1200) },
  { id: 2, name: 'Camille Wool Knit', meta: '07 / 24 — Knitwear', img: IMG('1469371670807-013ccf25f16a', 1200) },
  { id: 3, name: 'Vesper Evening Glove', meta: '11 / 24 — Accessories', img: IMG('1515886657613-9f3515b0c78f', 1200) },
  { id: 4, name: 'Soraya Slip Dress', meta: '14 / 24 — Ready-to-Wear', img: IMG('1485518882345-15568b007407', 1200) },
];

export const ATELIER_IMAGE = IMG('1496747611176-843222e1e57c', 2200);

export type SearchResult = {
  id: number;
  name: string;
  cat: string;
  price: string;
  img: string;
};

export const SEARCH_INDEX: SearchResult[] = [
  ...COLLECTION,
  ...FLOATING.map((p) => ({
    id: p.id + 100,
    name: p.name,
    cat: p.meta.split('— ')[1] || 'Atelier',
    price: '— On request',
    img: p.img,
  })),
];

export const SUGGESTED_TERMS = ['Trench', 'Cashmere', 'Silk Slip', 'Evening Glove', 'Tailoring', 'Eyewear'];
export const RECENT_TERMS = ['Halcyon coat', 'Margaux dress', 'Florentine leather'];
