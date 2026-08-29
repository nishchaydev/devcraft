import { DomainType } from './types';

const DOMAIN_KEYWORDS: Record<DomainType, readonly string[]> = {
  tailor: [
    'kurta', 'kurti', 'kameez', 'shirt', 'pant', 'pent', 'pajama', 'pyjama', 'salwar', 'suit',
    'lehenga', 'sherwani', 'blouse', 'dupatta', 'waistcoat', 'koti', 'stitching', 'alteration',
    'collar', 'chest', 'waist', 'length', 'sleeve', 'fabric', 'fitting', 'fit', 'trouser', 'trousers',
    'कुर्ता', 'कुर्ती', 'कमीज', 'शर्ट', 'पैंट', 'पेंट', 'पजामा', 'पायजामा', 'सलवार', 'सूट', 'लहंगा',
    'शेरवानी', 'ब्लाउज', 'दुपट्टा', 'कोटी', 'सिलाई'
  ],
  tiffin: [
    'thali', 'tiffin', 'dabba', 'meal', 'khana', 'roti', 'chapati', 'dal', 'daal', 'sabzi', 'sabji',
    'paneer', 'samosa', 'jalebi', 'khichdi', 'rajma', 'chole', 'curd', 'dahi', 'paratha', 'poha', 'idli',
    'lunch', 'dinner', 'breakfast', 'dopahar', 'raat', 'jain', 'swaminarayan', 'spicy', 'teekha',
    'थाली', 'थली', 'टिफिन', 'रोटी', 'दाल', 'सब्जी', 'पनीर', 'समोसा', 'समोसे', 'जलेबी', 'खिचड़ी',
    'राजमा', 'छोले', 'दही', 'पराठा', 'पोहा', 'इडली'
  ],
  electrician: [
    'fan', 'pankha', 'ceiling fan', 'exhaust fan', 'ac', 'ac point', 'switch', 'board', 'switchboard',
    'wiring', 'mcb', 'meter', 'light', 'tubelight', 'inverter', 'socket', 'geyser', 'gizer',
    'motor', 'doorbell', 'ghanti', 'current', 'spark', 'fuse', 'short circuit', 'repair', 'earthing',
    'पंखा', 'पंख', 'वायरिंग', 'बिजली', 'मीटर', 'गीजर', 'घंटी', 'इन्वर्टर', 'सॉकेट', 'मोटर', 'फ्यूज'
  ],
  baker: [
    'cake', 'cheesecake', 'pastry', 'cupcake', 'muffin', 'brownie', 'cookies', 'donut', 'flavour',
    'flavor', 'chocolate', 'vanilla', 'strawberry', 'butterscotch', 'pineapple', 'red velvet',
    'black forest', 'rasmalai', 'eggless', 'egg free', 'tier', 'kg', 'kilo', 'fondant', 'pastries',
    'केक', 'पेस्ट्री', 'कपकेक'
  ]
};

export function detectDomain(message: string): DomainType {
  if (!message) return 'tailor';
  const text = message.toLowerCase();

  const scores: Record<DomainType, number> = {
    tailor: 0,
    tiffin: 0,
    electrician: 0,
    baker: 0
  };

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS) as [DomainType, readonly string[]][]) {
    for (const kw of keywords) {
      if (new RegExp(`\\b${kw}\\b`, 'i').test(text) || text.includes(kw)) {
        scores[domain] += (kw.length > 4 ? 3 : 2);
      }
    }
  }

  let bestDomain: DomainType = 'tailor';
  let maxScore = 0;

  for (const [domain, score] of Object.entries(scores) as [DomainType, number][]) {
    if (score > maxScore) {
      maxScore = score;
      bestDomain = domain;
    }
  }

  return bestDomain;
}
