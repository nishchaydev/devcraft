/**
 * Output Contract & Domain Types matching schema.json and DATASET_CARD.md
 */

export type DomainType = 'tailor' | 'tiffin' | 'electrician' | 'baker';

export interface OrderItem {
  description: string;
  quantity: number;
  attributes: Record<string, string | number | boolean>;
}

export interface OrderRecord {
  customer: string | null;
  items: OrderItem[];
  due_date: string | null; // ISO-8601 YYYY-MM-DD
  amount: number | null;
  references_prior_order: boolean;
  confidence: number;
  needs_clarification: boolean;
  // Parser Execution Metadata & Domain Auto-Detection
  detectedDomain?: DomainType;
  engineUsed?: 'gemini-flash' | 'local-nlp';
  latencyMs?: number;
  whatsappReply?: string;
  ruleExplanation?: string;
}

export interface InputRecord {
  id: string;
  domain?: DomainType;
  received_at: string; // ISO-8601 string with timezone offset e.g. 2026-08-29T10:14:00+05:30
  message: string;
}

export interface OutputRecord extends OrderRecord {
  id: string;
}

export const DOMAIN_VOCABULARY: Record<DomainType, readonly string[]> = {
  tailor: ['color', 'fabric', 'chest', 'waist', 'length', 'sleeve', 'size', 'fit', 'collar'],
  tiffin: ['portion', 'spice_level', 'meal', 'roti_count', 'jain', 'days'],
  electrician: ['appliance', 'issue', 'room', 'brand', 'wattage'],
  baker: ['flavour', 'weight_kg', 'egg_free', 'tier', 'message_on_cake', 'shape']
} as const;
