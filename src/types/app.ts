export type UserRole = 'customer' | 'owner';

export interface DeliveryLocation {
  address: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  pincode?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  store_name?: string;
  delivery_location?: DeliveryLocation | string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id?: string;
  created_at?: string;
  owner_id: string;
  customer_id: string;
  sender_id: string;
  sender_role: UserRole;
  raw_text: string;
  parsed_json?: Record<string, any> | null;
  status?: string;
}

export interface ParsingRule {
  id: string;
  alias: string;
  replacement: string;
}
