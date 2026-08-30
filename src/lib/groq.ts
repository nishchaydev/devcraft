import { ParsingRule } from '../types/app';

const GROQ_API_KEY = import.meta.env.VITE_LLM_API_KEY || '';
const GROQ_API_URL = import.meta.env.VITE_LLM_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = import.meta.env.VITE_LLM_MODEL || 'openai/gpt-oss-120b';

export interface ParseOrderResult {
  customer_info?: {
    name?: string;
    phone?: string;
    delivery_location?: any;
  };
  items: Array<{
    description: string;
    quantity: number;
    unit?: string;
    category?: string;
    attributes?: Record<string, any>;
  }>;
  due_date?: string | null;
  total_amount?: number | null;
  needs_clarification: boolean;
  notes?: string;
}

export async function parseOrderWithGroq(
  rawText: string,
  customerMeta?: any,
  customRules: ParsingRule[] = []
): Promise<ParseOrderResult> {
  const rulesPrompt = customRules.length > 0
    ? `\nCustom Store Rules to Apply:\n${customRules.map(r => `- "${r.alias}" maps to "${r.replacement}"`).join('\n')}\n`
    : '';

  const systemPrompt = `You are an expert AI order parser for Indian micro-businesses handling WhatsApp messages in Hinglish, English, or Devanagari.
Extract order details into a clean JSON object following this EXACT schema:
{
  "items": [
    {
      "description": "item description (e.g. kurta, milk, atta)",
      "quantity": 1,
      "unit": "kg / L / pkt / pcs",
      "category": "grocery / apparel / dairy / service",
      "attributes": { "color": "navy blue", "size": "40" }
    }
  ],
  "due_date": "YYYY-MM-DD" or null if relative/unclear,
  "total_amount": 1500 or null,
  "needs_clarification": false or true,
  "notes": "any special instructions"
}

${rulesPrompt}
Respond ONLY with valid JSON, no markdown formatting or commentary.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Message to parse:\n"${rawText}"` }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    
    // Clean response content from code block wrappers if any
    const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanContent);

    return {
      customer_info: customerMeta,
      items: parsed.items || [],
      due_date: parsed.due_date || null,
      total_amount: parsed.total_amount || null,
      needs_clarification: parsed.needs_clarification ?? false,
      notes: parsed.notes || '',
    };
  } catch (err) {
    console.warn('Groq LLM Parser failed, using fallback extraction:', err);
    return {
      customer_info: customerMeta,
      items: [
        {
          description: rawText,
          quantity: 1,
          attributes: {}
        }
      ],
      due_date: null,
      total_amount: null,
      needs_clarification: true,
      notes: 'Fallback parse due to network/API error',
    };
  }
}
