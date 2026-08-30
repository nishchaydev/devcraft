import { InputRecord, OrderItem, OrderRecord, DomainType } from './types';
import { resolveDate } from './dateResolver';
import { sanitizeAttributes } from './vocabMatcher';
import { detectDomain } from './domainDetector';

const HINDI_NUMBER_WORDS: Record<string, number> = {
  ek: 1, do: 2, teen: 3, char: 4, chaar: 4, paanch: 5, panch: 5, chhe: 6, saat: 7, aath: 8, nau: 9, das: 10,
  gyarah: 11, barah: 12, terah: 13, chaudah: 14, pandrah: 15, solah: 16, satrah: 17, atharah: 18, unnees: 19, bees: 20,
  ikees: 21, baees: 22, teees: 23, chaubees: 24, pachis: 25, chhabees: 26, sattatees: 27, athais: 28, unatis: 29,
  tees: 30, iktis: 31, battis: 32, teyntis: 33, chautis: 34, paintis: 35, chhattis: 36, saintis: 37, aadtis: 38, untalis: 39,
  chalis: 40, iktalis: 41, bayalis: 42, teyntalis: 43, chavalis: 44, pahtalis: 45, chhiyalis: 46, sahtalis: 47, adtalis: 48, unchas: 49,
  pachas: 50, saath: 60, sattar: 70, assi: 80, nabbe: 90, sau: 100, hazaar: 1000,
  '१': 1, '२': 2, '३': 3, '४': 4, '५': 5, '६': 6, '७': 7, '८': 8, '९': 9, '०': 0
};

const DEVANAGARI_DIGITS: Record<string, string> = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
};

const DEVANAGARI_WORDS: Record<string, string> = {
  'राजमा': 'rajma',
  'पेस्ट्री': 'pastry',
  'कमीज': 'kameez',
  'शर्ट': 'shirt',
  'दही': 'curd',
  'मोटर': 'motor',
  'दुपट्टा': 'dupatta',
  'तारीख': 'tarikh',
  'पंखा': 'fan',
  'पंख': 'fan',
  'रोटी': 'roti',
  'सब्जी': 'sabzi',
  'थाली': 'thali',
  'थली': 'thali',
  'कुर्ता': 'kurta',
  'कुर्ती': 'kurta',
  'पजामा': 'pajama',
  'पायजामा': 'pajama',
  'पैंट': 'pant',
  'पेंट': 'pant',
  'समोसा': 'samosa',
  'समोसे': 'samosa',
  'जलेबी': 'jalebi',
  'दाल': 'dal',
  'केक': 'cake',
  'गीजर': 'geyser',
  'वायरिंग': 'wiring',
  'ब्रांड': 'brand'
};

const DOMAIN_ITEMS_ORDERED: Record<DomainType, { name: string; aliases: string[] }[]> = {
  tailor: [
    { name: 'kurta', aliases: ['kurta', 'kurti', 'korta', 'कुर्ता', 'कुर्ती'] },
    { name: 'kameez', aliases: ['kameez', 'kamees', 'कमीज'] },
    { name: 'shirt', aliases: ['shirt', 'shart', 'शर्ट'] },
    { name: 'pant', aliases: ['pant', 'pent', 'trousers', 'trouser', 'पैंट', 'पेंट'] },
    { name: 'pajama', aliases: ['pajama', 'pyjama', 'pajamas', 'पजामा', 'पायजामा'] },
    { name: 'salwar', aliases: ['salwar', 'सलवार'] },
    { name: 'suit', aliases: ['suit', 'सूट'] },
    { name: 'lehenga', aliases: ['lehenga', 'lahanga', 'लहंगा'] },
    { name: 'sherwani', aliases: ['sherwani', 'शेरवानी'] },
    { name: 'blouse', aliases: ['blouse', 'ब्लाउज'] },
    { name: 'dupatta', aliases: ['dupatta', 'दुपट्टा'] },
    { name: 'waistcoat', aliases: ['waistcoat', 'koti', 'कोटी'] }
  ],
  tiffin: [
    { name: 'paneer sabzi', aliases: ['paneer sabzi', 'paneer sabji', 'paneer', 'पनीर'] },
    { name: 'bread loaf', aliases: ['bread loaf', 'bread', 'ब्रेड'] },
    { name: 'samosa', aliases: ['samosa', 'samoses', 'समोसा', 'समोसे'] },
    { name: 'jalebi', aliases: ['jalebi', 'जलेबी'] },
    { name: 'thali', aliases: ['thali', 'tiffin', 'dabba', 'meal', 'थाली', 'थली', 'टिफिन'] },
    { name: 'khichdi', aliases: ['khichdi', 'खिचड़ी'] },
    { name: 'dal', aliases: ['dal', 'daal', 'दाल'] },
    { name: 'rajma', aliases: ['rajma', 'राजमा'] },
    { name: 'chole', aliases: ['chole', 'छोले'] },
    { name: 'curd', aliases: ['curd', 'dahi', 'दही'] },
    { name: 'roti', aliases: ['roti', 'chapati', 'रोटी'] },
    { name: 'paratha', aliases: ['paratha', 'parantha', 'पराठा'] },
    { name: 'poha', aliases: ['poha', 'पोहा'] },
    { name: 'idli', aliases: ['idli', 'इडली'] },
    { name: 'sabzi', aliases: ['sabzi', 'sabji', 'सब्जी'] }
  ],
  electrician: [
    { name: 'ceiling fan', aliases: ['ceiling fan'] },
    { name: 'exhaust fan', aliases: ['exhaust fan'] },
    { name: 'ac point', aliases: ['ac point'] },
    { name: 'switch board', aliases: ['switch board', 'switchboard'] },
    { name: 'water motor', aliases: ['water motor'] },
    { name: 'tube light', aliases: ['tube light', 'tubelight'] },
    { name: 'doorbell', aliases: ['doorbell', 'ghanti', 'घंटी'] },
    { name: 'geyser', aliases: ['geyser', 'gizer', 'गीजर'] },
    { name: 'ac', aliases: ['ac'] },
    { name: 'fan', aliases: ['fan', 'pankha', 'पंखा', 'पंख'] },
    { name: 'wiring', aliases: ['wiring', 'वायरिंग'] },
    { name: 'motor', aliases: ['motor', 'मोटर'] },
    { name: 'socket', aliases: ['socket', 'सॉकेट'] },
    { name: 'mcb', aliases: ['mcb'] },
    { name: 'inverter', aliases: ['inverter', 'इन्वर्टर'] }
  ],
  baker: [
    { name: 'cake', aliases: ['cake', 'केक'] },
    { name: 'birthday cake', aliases: ['birthday cake'] },
    { name: 'cheesecake', aliases: ['cheesecake', 'cheese cake'] },
    { name: 'bread loaf', aliases: ['bread loaf', 'bread'] },
    { name: 'pastry', aliases: ['pastry', 'पेस्ट्री'] },
    { name: 'cupcake', aliases: ['cupcake', 'कपकेक'] },
    { name: 'muffin', aliases: ['muffin'] },
    { name: 'brownie', aliases: ['brownie'] },
    { name: 'cookies', aliases: ['cookies', 'cookie'] },
    { name: 'donut', aliases: ['donut', 'doughnut'] }
  ]
};

const BRANDS = ['Anchor', 'Bajaj', 'Crompton', 'Havells', 'Orient', 'Polycab', 'Usha'];
const APPLIANCES_LIST = ['fan', 'ceiling fan', 'exhaust fan', 'motor', 'geyser', 'fridge', 'fridge point', 'pump', 'inverter', 'ac', 'light', 'tube light', 'socket'];

const NON_CUSTOMER_TERMS = [
  'bhaiya', 'uncle', 'aunty', 'sir', 'madam', 'boss', 'namaste', 'hello', 'hi', 'aaj', 'kal', 'parso',
  'ek', 'do', 'teen', 'char', 'paanch', 'chhe', 'saat', 'aath', 'nau', 'das', 'mujhe', 'chahiye',
  'cake', 'kg', 'kilo', 'tier', 'chocolate', 'pastry', 'thali', 'samosa', 'jalebi', 'kurta', 'pant', 'ca'
];

function normalizeText(text: string): string {
  let s = text.toLowerCase();
  s = s.replace(/[०-९]/g, m => DEVANAGARI_DIGITS[m] || m);
  for (const [k, v] of Object.entries(DEVANAGARI_WORDS)) {
    s = s.replaceAll(k, v);
  }
  return s;
}

function wordToNumber(word: string): number | null {
  if (!word) return null;
  const w = word.toLowerCase().trim();
  if (/^\d+$/.test(w)) return parseInt(w, 10);
  if (HINDI_NUMBER_WORDS[w] !== undefined) return HINDI_NUMBER_WORDS[w];
  return null;
}

function formatCustomerName(name: string): string {
  return name.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export function generateWhatsAppReply(record: OrderRecord): string {
  const cust = record.customer ? `Ji ${record.customer} ji, ` : 'Ji, ';
  if (record.items.length === 0) {
    return `${cust}aapka order clear nahi tha. Kripya item ka naam aur details firse bhej de!`;
  }
  const itemSummary = record.items.map(it => {
    const attrsStr = Object.entries(it.attributes).map(([k, v]) => `${k}: ${v}`).join(', ');
    return `${it.quantity} ${it.description}${attrsStr ? ` (${attrsStr})` : ''}`;
  }).join(' aur ');

  const dateStr = record.due_date ? `Delivery Date: ${record.due_date}. ` : '';
  const amtStr = record.amount ? `Total Amount: ₹${record.amount}. ` : '';

  return `${cust}aapka order (${itemSummary}) confirm kar liya hai! ${dateStr}${amtStr}Shukriya!`;
}

export function runOfflineParser(message: string, options: { received_at: string; domain?: DomainType }): OrderRecord {
  return parseOfflineRecord({
    id: `eval-${Date.now()}`,
    message,
    received_at: options.received_at,
    domain: options.domain
  });
}

export function parseOfflineRecord(input: InputRecord): OrderRecord {
  const startTime = Date.now();
  const rawMsg = input.message;
  const msg = normalizeText(rawMsg);
  const domain = input.domain || detectDomain(rawMsg);

  let needsClarification = false;
  let ruleExplanation = 'Record parsed successfully against schema.json contracts.';

  // 1. Date Resolution
  const dateRes = resolveDate(msg, input.received_at);
  if (dateRes.needsClarification) {
    needsClarification = true;
    ruleExplanation = 'Rule 3c: Deadline referenced in message is imprecise or unresolvable.';
  }

  // 2. references_prior_order
  let referencesPrior = false;
  if (/\b(last time jaisa|pichli baar wala|pichle baar wala|last order jaisa|same as last time|pehle jaisa)\b/.test(msg)) {
    const idx = msg.search(/\b(last time jaisa|pichli baar wala|pichle baar wala|last order jaisa|same as last time|pehle jaisa)\b/);
    const windowBefore = msg.substring(Math.max(0, idx - 20), idx);
    if (!/\b(nahi|not)\b/.test(windowBefore)) {
      referencesPrior = true;
    }
  }

  // 3. Customer extraction (preserving honorifics)
  let customer: string | null = null;
  const customerDecoyMatch = rawMsg.match(/([a-zA-Z\u0900-\u097F\s]+)\s+ke liye nahi,\s*([a-zA-Z\u0900-\u097F\s]+)\s+ke liye/i);
  if (customerDecoyMatch) {
    customer = customerDecoyMatch[2].trim();
  } else {
    const custMatch = rawMsg.match(/^([a-zA-Z\u0900-\u097F]+(?:\s+(?:ji|didi|aunty|bhai|uncle))?)\s*(?:ke\s+liye|ka|ki|ke|ko|bol\s+raha\s+hu|bol\s+rahi\s+hu|ke\s+ghar)\b/i);
    if (custMatch && !NON_CUSTOMER_TERMS.includes(custMatch[1].toLowerCase().split(' ')[0])) {
      customer = custMatch[1].trim();
    } else {
      const custMatch2 = rawMsg.match(/\b([a-zA-Z\u0900-\u097F]{3,})(?:\s+(?:ji|didi|aunty|bhai|uncle))?\s*(?:ke liye|ka|ki|ke|ko)\s+(?:order|chahiye|delivery|nahi)/i);
      if (custMatch2 && !NON_CUSTOMER_TERMS.includes(custMatch2[1].toLowerCase().split(' ')[0])) {
        customer = custMatch2[1].trim();
      } else {
        const nameForMatch = rawMsg.match(/\bfor\s+([a-zA-Z]{3,}(?:\s+(?:ji|didi|aunty|bhai|uncle))?)\b/i);
        if (nameForMatch && !['me', 'him', 'her', 'them', 'us'].includes(nameForMatch[1].toLowerCase().split(' ')[0])) {
          customer = nameForMatch[1].trim();
        }
      }
    }
  }
  if (customer) {
    customer = formatCustomerName(customer);
  }

  // 4. Amount Extraction
  let amount: number | null = null;
  const strictAmtMatch = msg.match(/\b(rs\.?|inr|rupees|rupaye|₹)\s*(\d{2,6})\b/i) || 
                         msg.match(/\b(\d{2,6})\s*(rs\.?|inr|rupees|rupaye|₹|\/-)\b/i) ||
                         msg.match(/\b(\d{2,6})\s*(rs\.?|rupees|inr)?\s*(tak|me|mein)\s*(ka\s*kaam|me\s*ho\s*jayega|tak)\b/i);

  if (strictAmtMatch) {
    const candidateStr = strictAmtMatch[1] && /^\d+$/.test(strictAmtMatch[1]) ? strictAmtMatch[1] : strictAmtMatch[2];
    if (candidateStr && /^\d+$/.test(candidateStr)) {
      const num = parseInt(candidateStr, 10);
      const isWattage = new RegExp(`\\b${num}\\s*(w|watt|watts)\\b`, 'i').test(msg);
      const isDateOrSize = new RegExp(`\\b(tarikh|tareekh|chest|waist|length|kg|kilo|tier|din|baje|size|collar)\\s*${num}\\b|\\b${num}\\s*(tarikh|tareekh|chest|waist|length|kg|kilo|tier|din|baje|size|collar)\\b`, 'i').test(msg);
      
      if (!isWattage && !isDateOrSize && num !== 2026 && num !== 2025 && num >= 50 && num < 100000) {
        amount = num;
      }
    }
  }

  // 5. Ambiguous quantity check
  const ambigQtyRegex = /\b(\d+|ek|do|teen|char|paanch|chhe|saat|aath|nau|das|[०-९]+)\s+(ya|or|se)\s+(\d+|do|teen|char|paanch|chhe|saat|aath|nau|das|[०-९]+)\b/i;
  const ambigMatch = msg.match(ambigQtyRegex);
  let ambigQtyVal: number | null = null;
  if (ambigMatch) {
    needsClarification = true;
    ruleExplanation = 'Rule 3b: Ambiguous quantity referenced (e.g. "do ya teen"), first value recorded.';
    ambigQtyVal = wordToNumber(ambigMatch[1]) || parseInt(ambigMatch[1], 10) || 2;
  }

  // 6. Item Negations
  const negatedItems: string[] = [];
  const negMatches = Array.from(msg.matchAll(/\b([a-zA-Z\u0900-\u097F]+)\s+(nahi|not)\b/gi));
  for (const nm of negMatches) {
    negatedItems.push(nm[1].toLowerCase());
  }

  // 7. Split message into clauses (preserving decimal numbers e.g. 1.5, 0.5)
  const clauses = msg.split(/,|\baur\b|\band\b|;|\bki\b|\bwale\b|(?<!\d)\.|\.(?!\d)/gi).map(c => c.trim()).filter(Boolean);

  const items: OrderItem[] = [];
  const domainDefs = DOMAIN_ITEMS_ORDERED[domain] || [];

  for (const def of domainDefs) {
    if (def.aliases.some(alias => negatedItems.some(neg => alias.includes(neg) || neg.includes(alias)))) {
      continue;
    }

    let itemClauseIdx = -1;
    let foundAlias = '';
    for (let cIdx = 0; cIdx < clauses.length; cIdx++) {
      for (const alias of def.aliases) {
        if (new RegExp(`\\b${alias}\\b`, 'i').test(clauses[cIdx]) || clauses[cIdx].includes(alias)) {
          itemClauseIdx = cIdx;
          foundAlias = alias;
          break;
        }
      }
      if (itemClauseIdx !== -1) break;
    }

    if (itemClauseIdx !== -1) {
      const scopedClauses = clauses.slice(Math.max(0, itemClauseIdx - 2), Math.min(clauses.length, itemClauseIdx + 3));
      const contextText = scopedClauses.join(' ');
      
      // Mask/strip time markers (e.g., "5 baje", "shaam 6 baje", "10 baje shaam") and decimal weights before quantity extraction
      const contextWithoutTimeAndWeight = contextText
        .replace(/\b(?:subah|shaam|dopahar|raat)?\s*\d{1,2}\s*(?:baje|am|pm)\b/gi, '')
        .replace(/\bshaam\s+\d+\s*baje\b/gi, '')
        .replace(/(?:^|\s)\d+(?:\.\d+)?\s*(?:kg|kilo|gram|gm|pound)\b/gi, '')
        .trim();

      let qty = 1;
      if (ambigQtyVal !== null) {
        qty = ambigQtyVal;
      } else {
        const preMatch = contextWithoutTimeAndWeight.match(new RegExp(`(?:^|\\s)(\\d+|ek|do|teen|char|chaar|paanch|chhe|saat|aath|nau|das|[०-९]+)\\s+(?:[a-zA-Z\\u0900-\\u097F-]+\\s+){0,3}${foundAlias}\\b`, 'i')) ||
                         contextWithoutTimeAndWeight.match(new RegExp(`(?:^|\\s)(\\d+|ek|do|teen|char|chaar|paanch|chhe|saat|aath|nau|das|[०-९]+)\\s*${foundAlias}\\b`, 'i'));
        
        const postMatch = contextWithoutTimeAndWeight.match(new RegExp(`${foundAlias}\\s+(\\d+|ek|do|teen|char|chaar|paanch|chhe|saat|aath|nau|das|[०-९]+)\\b`, 'i'));
        
        if (preMatch) {
          qty = wordToNumber(preMatch[1]) || 1;
        } else if (postMatch) {
          qty = wordToNumber(postMatch[1]) || 1;
        }
      }

      const rawAttrs: Record<string, any> = {};

      if (domain === 'electrician') {
        for (const brand of BRANDS) {
          if (new RegExp(`\\b${brand}\\b`, 'i').test(contextText)) {
            rawAttrs.brand = brand;
            break;
          }
        }
        if (/\b(fuse ud|fuse blown|fuse|ud gaya)\b/i.test(contextText)) rawAttrs.issue = 'fuse blown';
        else if (/\b(current aa|current lag|current|leaking current|shock)\b/i.test(contextText)) rawAttrs.issue = 'leaking current';
        else if (/\b(spark|sparking)\b/i.test(contextText)) rawAttrs.issue = 'spark';
        else if (/\b(slow|dheere|dheema)\b/i.test(contextText)) rawAttrs.issue = 'slow';
        else if (/\b(noise|sound|aawaz)\b/i.test(contextText)) rawAttrs.issue = 'noise';
        else if (/\b(short circuit|shortcircuit|short)\b/i.test(contextText)) rawAttrs.issue = 'short circuit';
        else if (/\b(not working|kharab|chalu nahi|kam nahi)\b/i.test(contextText)) rawAttrs.issue = 'not working';

        const roomMatch = contextText.match(/\b(room\s*\d+|bedroom|kitchen|hall|living room|bathroom|balcony|master bedroom)\b/i);
        if (roomMatch) rawAttrs.room = roomMatch[1].toLowerCase();

        const wattMatch = contextText.match(/\b(\d+|assi|sau)\s*(w|watt|watts)\b/i);
        if (wattMatch) rawAttrs.wattage = wordToNumber(wattMatch[1]) || parseInt(wattMatch[1], 10);

        for (const app of APPLIANCES_LIST) {
          if (new RegExp(`\\b${app}\\b`, 'i').test(contextText) && !def.name.includes(app)) {
            rawAttrs.appliance = app;
            break;
          }
        }
      }

      if (domain === 'baker') {
        const flavMatch = contextText.match(/\b(chocolate|vanilla|strawberry|butterscotch|pineapple|red velvet|black forest|mango|blueberry|rasmalai|coffee)\b/i);
        if (flavMatch) rawAttrs.flavour = flavMatch[1].toLowerCase();

        const weightMatch = contextText.match(/(?:^|\s)(?<val>\d+(?:\.\d+)?)\s*(?:kg|kilo|gram|gm)\b/i);
        if (weightMatch && weightMatch.groups?.val) {
          rawAttrs.weight_kg = parseFloat(weightMatch.groups.val);
        } else {
          const fallbackWeight = contextText.match(/(?:^|\s)(half|dedh|0\.5|1\.5|2\.5)\s*(kg|kilo|pound)?\b/i);
          if (fallbackWeight) {
            if (fallbackWeight[1] === 'half') rawAttrs.weight_kg = 0.5;
            else if (fallbackWeight[1] === 'dedh') rawAttrs.weight_kg = 1.5;
            else rawAttrs.weight_kg = parseFloat(fallbackWeight[1]);
          }
        }

        // For items that begin with a weight descriptor (e.g. "1.5 kg chocolate cake"), item count is 1 unless preceded by dedicated count token
        if (rawAttrs.weight_kg && (def.name.includes('cake') || def.name.includes('pastry'))) {
          const explicitPreCountMatch = contextWithoutTimeAndWeight.match(new RegExp(`(?:^|\\s)(\\d+|ek|do|teen|char|paanch)\\s+(?:[a-zA-Z\\u0900-\\u097F-]+\\s+){0,2}${foundAlias}\\b`, 'i'));
          if (explicitPreCountMatch) {
            const countVal = wordToNumber(explicitPreCountMatch[1]);
            if (countVal && countVal !== rawAttrs.weight_kg) {
              qty = countVal;
            } else {
              qty = 1;
            }
          } else {
            qty = 1;
          }
        }

        if (/\b(egg free|eggless|bina anda|without egg)\b/i.test(contextText)) {
          rawAttrs.egg_free = true;
        }

        const tierMatch = contextText.match(/\b(\d+|ek|do|teen)\s*tier\b/i);
        if (tierMatch) rawAttrs.tier = wordToNumber(tierMatch[1]) || parseInt(tierMatch[1], 10);

        const shapeMatch = contextText.match(/\b(round|heart|square)\b/i);
        if (shapeMatch) rawAttrs.shape = shapeMatch[1].toLowerCase();

        const msgOnCakeMatch = rawMsg.match(/(?:likho|likhna|write|message|naam)\s*[:—]?\s*["']?([^"',\n]{2,30})["']?/i);
        if (msgOnCakeMatch) {
          rawAttrs.message_on_cake = msgOnCakeMatch[1].trim();
        }
      }

      if (domain === 'tiffin') {
        if (/\b(half|full|extra)\b/i.test(contextText)) {
          const pMatch = contextText.match(/\b(half|full|extra)\b/i);
          if (pMatch) rawAttrs.portion = pMatch[1].toLowerCase();
        }
        if (/\b(mild|medium|spicy|teekha|normal)\b/i.test(contextText)) {
          if (contextText.includes('mild')) rawAttrs.spice_level = 'mild';
          else if (contextText.includes('spicy') || contextText.includes('teekha')) rawAttrs.spice_level = 'spicy';
          else rawAttrs.spice_level = 'medium';
        }
        const rotiMatch = contextText.match(/\b(\d+|char|chaar|chhe|do|teen|4|6|8|2|3)\s*roti\b/i);
        if (rotiMatch) rawAttrs.roti_count = wordToNumber(rotiMatch[1]) || parseInt(rotiMatch[1], 10);

        if (/\bjain\b/i.test(contextText)) rawAttrs.jain = true;

        const daysMatch = contextText.match(/\b(\d+|ek|do|teen|char|paanch|chhe|saat|14|13|5)\s*din\s*ke\s*liye\b/i);
        if (daysMatch) rawAttrs.days = wordToNumber(daysMatch[1]) || parseInt(daysMatch[1], 10);

        if (/\b(lunch|dinner|breakfast|doper|raat)\b/i.test(contextText)) {
          if (contextText.includes('lunch') || contextText.includes('doper')) rawAttrs.meal = 'lunch';
          if (contextText.includes('dinner') || contextText.includes('raat')) rawAttrs.meal = 'dinner';
        }
      }

      if (domain === 'tailor') {
        const colorMatch = contextText.match(/\b(white|navy blue|sky blue|royal blue|dark blue|bottle green|black|cream|red|green|yellow|maroon|pink|purple|grey|gray|brown|peach|mustard)\b/i);
        if (colorMatch) rawAttrs.color = colorMatch[1].toLowerCase();

        const chestMatch = contextText.match(/\bchest\s*(\d+|chalis|assi|tees|battis|chautis|chhattis|aadtis|bayalis|chavalis|chhiyalis|adtalis)\b/i);
        if (chestMatch) rawAttrs.chest = wordToNumber(chestMatch[1]) || parseInt(chestMatch[1], 10);

        const waistMatch = contextText.match(/\bwaist\s*(\d+|chalis|assi|tees|battis|chautis|chhattis|aadtis|bayalis|chavalis|chhiyalis|adtalis)\b/i);
        if (waistMatch) rawAttrs.waist = wordToNumber(waistMatch[1]) || parseInt(waistMatch[1], 10);

        const lengthMatch = contextText.match(/\blength\s*(\d+)\b/i);
        if (lengthMatch) rawAttrs.length = parseInt(lengthMatch[1], 10);

        const sizeMatch = contextText.match(/\b(size|collar|collar size)\s*([smlxl]{1,3}|\d+)\b/i);
        if (sizeMatch) {
          const szVal = sizeMatch[2];
          if (/^\d+$/.test(szVal)) {
            if (!rawAttrs.chest) rawAttrs.chest = parseInt(szVal, 10);
            else rawAttrs.size = szVal;
          } else {
            rawAttrs.size = szVal.toUpperCase();
          }
        }

        if (!rawAttrs.chest && (def.name === 'kurta' || def.name === 'shirt')) {
          const bareMatch = contextText.match(/\b(40|38|42|44|36|chalis|aadtis|bayalis|chavalis)\b/i);
          if (bareMatch) rawAttrs.chest = wordToNumber(bareMatch[1]) || parseInt(bareMatch[1], 10);
        }

        const fabricMatch = contextText.match(/\b(cotton|silk|linen|khadi|denim|polyester|woolen|rayon|chiffon|georgette|velvet)\b/i);
        if (fabricMatch) rawAttrs.fabric = fabricMatch[1].toLowerCase();

        const sleeveMatch = contextText.match(/\b(full|half|three-quarter|3\/4)\b/i);
        if (sleeveMatch) {
          let slv = sleeveMatch[1].toLowerCase();
          if (slv === '3/4') slv = 'three-quarter';
          rawAttrs.sleeve = slv;
        }

        const fitMatch = contextText.match(/\b(formal|slim|regular|loose)\s*(fit)?\b/i);
        if (fitMatch) {
          let fitVal = fitMatch[1].toLowerCase();
          if (fitVal === 'formal') fitVal = 'slim';
          rawAttrs.fit = fitVal;
        }
      }

      const attributes = sanitizeAttributes(domain, rawAttrs);

      items.push({
        description: def.name,
        quantity: qty,
        attributes
      });
    }
  }

  // Rule 3a: No identifiable item
  if (items.length === 0) {
    needsClarification = true;
    ruleExplanation = 'Rule 3a: Message places an order but no identifiable item could be extracted.';
  }

  // Rule 3d: Missing domain blocking attributes
  if (domain === 'baker' && items.length > 0) {
    if (items.every(it => !it.attributes.flavour)) {
      needsClarification = true;
      ruleExplanation = 'Rule 3d: Baker domain order missing mandatory blocking attribute (flavour).';
    }
  }
  if (domain === 'electrician' && items.length > 0) {
    if (items.every(it => !it.attributes.issue)) {
      needsClarification = true;
      ruleExplanation = 'Rule 3d: Electrician domain order missing mandatory blocking attribute (issue).';
    }
  }

  const rec: OrderRecord = {
    customer,
    items,
    due_date: dateRes.date,
    amount,
    references_prior_order: referencesPrior,
    confidence: needsClarification ? 0.65 : 0.95,
    needs_clarification: needsClarification,
    detectedDomain: domain,
    engineUsed: 'local-nlp',
    latencyMs: Date.now() - startTime,
    ruleExplanation
  };

  rec.whatsappReply = generateWhatsAppReply(rec);
  return rec;
}
