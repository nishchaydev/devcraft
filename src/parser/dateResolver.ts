export interface DateResolutionResult {
  date: string | null;
  referenced: boolean;
  needsClarification: boolean;
}

const WEEKDAYS_HINDI: Record<string, number> = {
  somvar: 1, somwar: 1, monday: 1, mon: 1,
  mangalvar: 2, mangalwar: 2, tuesday: 2, tue: 2,
  budhvar: 3, budhwar: 3, wednesday: 3, wed: 3,
  guruvar: 4, guruwar: 4, thursday: 4, thu: 4, veervar: 4, veerwar: 4,
  shukravar: 5, shukrawar: 5, friday: 5, fri: 5,
  shanivar: 6, shaniwar: 6, saturday: 6, sat: 6,
  ravivar: 7, raviwar: 7, sunday: 0, sun: 0
};

const DEVANAGARI_DIGITS: Record<string, string> = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
};

const IMPRECISE_DEADLINES = [
  'asap', 'urgent', 'jab ho jaye', 'festival se pehle',
  'next week kabhi bhi', 'agle mahine', 'mahine ke end tak', 'diwali se pehle',
  'shaadi se pehle', 'exam ke baad', 'jab time mile', 'kabhi bhi', 'emergency'
];

export function parseKolkataDate(isoString: string): { year: number; month: number; day: number; dayOfWeek: number; dateObj: Date } {
  const dateObj = new Date(isoString);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(dateObj);
  let year = 2026, month = 8, day = 29;
  for (const part of parts) {
    if (part.type === 'year') year = parseInt(part.value, 10);
    if (part.type === 'month') month = parseInt(part.value, 10);
    if (part.type === 'day') day = parseInt(part.value, 10);
  }
  const localDate = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = localDate.getUTCDay();
  return { year, month, day, dayOfWeek, dateObj: localDate };
}

export function formatDateUTC(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function resolveDate(message: string, receivedAtISO: string): DateResolutionResult {
  let msg = message.toLowerCase().replace(/[०-९]/g, m => DEVANAGARI_DIGITS[m] || m);
  const base = parseKolkataDate(receivedAtISO);

  let explicitDate: string | null = null;

  if (/\b(tarso|narsu)\b/.test(msg)) {
    const d = new Date(base.dateObj);
    d.setUTCDate(d.getUTCDate() + 3);
    explicitDate = formatDateUTC(d);
  } else if (/\bparso\b/.test(msg)) {
    const d = new Date(base.dateObj);
    d.setUTCDate(d.getUTCDate() + 2);
    explicitDate = formatDateUTC(d);
  } else if (/\bkal\b/.test(msg)) {
    const d = new Date(base.dateObj);
    d.setUTCDate(d.getUTCDate() + 1);
    explicitDate = formatDateUTC(d);
  } else if (/\baaj\b/.test(msg)) {
    explicitDate = formatDateUTC(base.dateObj);
  }

  if (!explicitDate) {
    const dinMatch = msg.match(/(\d+|ek|do|teen|char|paanch|chhe|saat|aath|nau|das)\s*din\s*(me|mein|baad|tak)\b/);
    if (dinMatch && !msg.includes(`${dinMatch[1]} din ke liye`)) {
      const wordMap: Record<string, number> = { ek: 1, do: 2, teen: 3, char: 4, paanch: 5, chhe: 6, saat: 7, aath: 8, nau: 9, das: 10 };
      const numStr = dinMatch[1];
      const n = wordMap[numStr] || parseInt(numStr, 10);
      if (!isNaN(n)) {
        const d = new Date(base.dateObj);
        d.setUTCDate(d.getUTCDate() + n);
        explicitDate = formatDateUTC(d);
      }
    }
  }

  if (!explicitDate) {
    const weekdayMatches = Array.from(msg.matchAll(/\b([a-z]+)\s*(ko|tak)?\s*(nahi|not)?\b/g));
    let selectedWeekday: number | null = null;

    for (const m of weekdayMatches) {
      const word = m[1];
      const isNegated = m[3] === 'nahi' || m[3] === 'not' || msg.includes(`${word} ko nahi`) || msg.includes(`${word} nahi`);
      if (WEEKDAYS_HINDI[word] !== undefined && !isNegated) {
        selectedWeekday = WEEKDAYS_HINDI[word];
      }
    }

    if (selectedWeekday !== null) {
      let daysToAdd = (selectedWeekday - base.dayOfWeek + 7) % 7;
      if (daysToAdd === 0) daysToAdd = 7;
      const d = new Date(base.dateObj);
      d.setUTCDate(d.getUTCDate() + daysToAdd);
      explicitDate = formatDateUTC(d);
    }
  }

  if (!explicitDate && (msg.includes('weekend') || msg.includes('haftexl'))) {
    let daysToAdd = (6 - base.dayOfWeek + 7) % 7;
    const d = new Date(base.dateObj);
    d.setUTCDate(d.getUTCDate() + daysToAdd);
    explicitDate = formatDateUTC(d);
  }

  if (!explicitDate && (msg.includes('agle hafte') || msg.includes('next week'))) {
    const d = new Date(base.dateObj);
    d.setUTCDate(d.getUTCDate() + 7);
    explicitDate = formatDateUTC(d);
  }

  if (!explicitDate) {
    const tarikhMatch = msg.match(/(\d{1,2})\s*(tarikh|tareekh|taareekh|ko|\/|तारीख)/);
    if (tarikhMatch) {
      const targetDay = parseInt(tarikhMatch[1], 10);
      if (targetDay >= 1 && targetDay <= 31) {
        let targetMonth = base.month - 1;
        let targetYear = base.year;
        if (targetDay < base.day) {
          targetMonth += 1;
          if (targetMonth > 11) {
            targetMonth = 0;
            targetYear += 1;
          }
        }
        const d = new Date(Date.UTC(targetYear, targetMonth, targetDay));
        explicitDate = formatDateUTC(d);
      }
    }
  }

  if (!explicitDate) {
    const explicitMonthMatch = msg.match(/(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)/);
    if (explicitMonthMatch) {
      const dayNum = parseInt(explicitMonthMatch[1], 10);
      const monthStr = explicitMonthMatch[2].substring(0, 3);
      const monthsMap: Record<string, number> = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
      if (monthsMap[monthStr] !== undefined) {
        const d = new Date(Date.UTC(base.year, monthsMap[monthStr], dayNum));
        explicitDate = formatDateUTC(d);
      }
    }
  }

  if (explicitDate) {
    return { date: explicitDate, referenced: true, needsClarification: false };
  }

  let hasImprecise = false;
  if (/\b(jaldi|asap|urgent)\b/.test(msg)) {
    hasImprecise = true;
  } else {
    for (const phrase of IMPRECISE_DEADLINES) {
      if (msg.includes(phrase)) {
        hasImprecise = true;
        break;
      }
    }
  }

  if (hasImprecise) {
    return { date: null, referenced: true, needsClarification: true };
  }

  return { date: null, referenced: false, needsClarification: false };
}
