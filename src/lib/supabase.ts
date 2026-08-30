import { createClient } from '@supabase/supabase-js';
import { Message, Profile } from '../types/app';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ijeecfdkdntqivvyifgq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SEEDED_VENDORS: Profile[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'meena.tailors@devcraft.app',
    full_name: 'Meena Kumari',
    phone: '+91 9811223344',
    role: 'owner',
    store_name: 'Meena Tailors & Fabrics (Tailor)',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'gupta.kirana@devcraft.app',
    full_name: 'Ramashankar Gupta',
    phone: '+91 9822334455',
    role: 'owner',
    store_name: 'Gupta Super Kirana (Grocery)',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'sharma.electric@devcraft.app',
    full_name: 'Sunil Sharma',
    phone: '+91 9833445566',
    role: 'owner',
    store_name: 'Sharma Electricians & Repairs (Services)',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'sweet.treats@devcraft.app',
    full_name: 'Pooja Ansal',
    phone: '+91 9844556677',
    role: 'owner',
    store_name: 'Sweet Treats Home Bakery (Bakery)',
  },
];

export const SEEDED_CUSTOMERS: Profile[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    email: 'ramesh.sharma@devcraft.app',
    full_name: 'Ramesh Sharma (Ramesh Ji)',
    phone: '+91 9811002233',
    role: 'customer',
    delivery_location: {
      address: 'Flat 402, Shanti Heights, Sector 14, Gurugram',
      city: 'Gurugram',
      pincode: '122001',
      latitude: 28.4595,
      longitude: 77.0266,
    },
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    email: 'priya.patel@devcraft.app',
    full_name: 'Priya Patel',
    phone: '+91 9822003344',
    role: 'customer',
    delivery_location: {
      address: 'B-12, Green Glen Layout, Bellandur, Bengaluru',
      city: 'Bengaluru',
      pincode: '560103',
      latitude: 12.9279,
      longitude: 77.6771,
    },
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    email: 'sarita.verma@devcraft.app',
    full_name: 'Sarita Verma (Sarita Didi)',
    phone: '+91 9833004455',
    role: 'customer',
    delivery_location: {
      address: 'House No 58, Model Town Phase 2, Delhi',
      city: 'Delhi',
      pincode: '110009',
      latitude: 28.7041,
      longitude: 77.1025,
    },
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    email: 'anil.kapoor@devcraft.app',
    full_name: 'Anil Kapoor (Anil Ji)',
    phone: '+91 9844005566',
    role: 'customer',
    delivery_location: {
      address: 'Villa 19, Palm Meadows, Whitefield, Bengaluru',
      city: 'Bengaluru',
      pincode: '560066',
      latitude: 12.9698,
      longitude: 77.7499,
    },
  },
  {
    id: 'c5555555-5555-5555-5555-555555555555',
    email: 'kavita.desai@devcraft.app',
    full_name: 'Kavita Desai',
    phone: '+91 9855006677',
    role: 'customer',
    delivery_location: {
      address: 'Tower 3, Apt 804, Lodha Bellissimo, Mahalaxmi, Mumbai',
      city: 'Mumbai',
      pincode: '400011',
      latitude: 18.9827,
      longitude: 72.8285,
    },
  },
];

export const SEEDED_CHATS: Message[] = [
  // --- Vendor 1: Meena Tailors (Tailor) ---
  {
    id: 'msg-seed-103',
    owner_id: '11111111-1111-1111-1111-111111111111',
    customer_id: 'c2222222-2222-2222-2222-222222222222',
    sender_id: 'c2222222-2222-2222-2222-222222222222',
    sender_role: 'customer',
    raw_text: 'Didi 3 cotton blouse stitching with lining, red and golden border urgently Sunday tak kar do',
    parsed_json: {
      customer_info: {
        name: 'Priya Patel',
        phone: '+91 9822003344',
        delivery_location: {
          address: 'B-12, Green Glen Layout, Bellandur, Bengaluru',
        },
      },
    },
    status: 'sent',
    created_at: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
  },

  // --- Vendor 2: Gupta Super Kirana (Grocery) ---
  {
    id: 'msg-seed-201',
    owner_id: '22222222-2222-2222-2222-222222222222',
    customer_id: 'c3333333-3333-3333-3333-333333333333',
    sender_id: 'c3333333-3333-3333-3333-333333333333',
    sender_role: 'customer',
    raw_text: 'Gupta ji 5kg Aashirvaad atta, 2L Fortune mustard oil, 1kg sugar and 2 packets Tata salt aaj shaam tak ghar bhej dena',
    parsed_json: {
      customer_info: {
        name: 'Sarita Verma (Sarita Didi)',
        phone: '+91 9833004455',
        delivery_location: {
          address: 'House No 58, Model Town Phase 2, Delhi',
        },
      },
    },
    status: 'sent',
    created_at: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
  },
  {
    id: 'msg-seed-202',
    owner_id: '22222222-2222-2222-2222-222222222222',
    customer_id: 'c3333333-3333-3333-3333-333333333333',
    sender_id: '22222222-2222-2222-2222-222222222222',
    sender_role: 'owner',
    raw_text: '🛵 Out for delivery - arriving shortly via delivery boy Raju.',
    status: 'delivered',
    created_at: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
  },

  // --- Vendor 3: Sharma Electricians (Services) ---
  {
    id: 'msg-seed-301',
    owner_id: '33333333-3333-3333-3333-333333333333',
    customer_id: 'c4444444-4444-4444-4444-444444444444',
    sender_id: 'c4444444-4444-4444-4444-444444444444',
    sender_role: 'customer',
    raw_text: 'Anil ji ke ghar ceiling fan noise problem check kar do kal dopahar tak',
    parsed_json: {
      customer_info: {
        name: 'Anil Kapoor (Anil Ji)',
        phone: '+91 9844005566',
        delivery_location: {
          address: 'Villa 19, Palm Meadows, Whitefield, Bengaluru',
        },
      },
    },
    status: 'sent',
    created_at: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
  },
  {
    id: 'msg-seed-302',
    owner_id: '33333333-3333-3333-3333-333333333333',
    customer_id: 'c4444444-4444-4444-4444-444444444444',
    sender_id: '33333333-3333-3333-3333-333333333333',
    sender_role: 'owner',
    raw_text: '✓ Order Confirmed - Technician Sunil will visit tomorrow at 12:30 PM with replacement capacitor.',
    status: 'delivered',
    created_at: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
  },
  {
    id: 'msg-seed-303',
    owner_id: '33333333-3333-3333-3333-333333333333',
    customer_id: 'c3333333-3333-3333-3333-333333333333',
    sender_id: 'c3333333-3333-3333-3333-333333333333',
    sender_role: 'customer',
    raw_text: 'Sarita didi kitchen switch board wiring repair, Crompton brand',
    parsed_json: {
      customer_info: {
        name: 'Sarita Verma (Sarita Didi)',
        phone: '+91 9833004455',
        delivery_location: {
          address: 'House No 58, Model Town Phase 2, Delhi',
        },
      },
    },
    status: 'sent',
    created_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  },

  // --- Vendor 4: Sweet Treats Home Bakery (Bakery) ---
  {
    id: 'msg-seed-401',
    owner_id: '44444444-4444-4444-4444-444444444444',
    customer_id: 'c5555555-5555-5555-5555-555555555555',
    sender_id: 'c5555555-5555-5555-5555-555555555555',
    sender_role: 'customer',
    raw_text: 'Kavita 1.5 kg chocolate cake 2 tier eggless likho Happy Birthday Aarav, Sunday shaam tak',
    parsed_json: {
      customer_info: {
        name: 'Kavita Desai',
        phone: '+91 9855006677',
        delivery_location: {
          address: 'Tower 3, Apt 804, Lodha Bellissimo, Mahalaxmi, Mumbai',
        },
      },
    },
    status: 'sent',
    created_at: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
  },
  {
    id: 'msg-seed-402',
    owner_id: '44444444-4444-4444-4444-444444444444',
    customer_id: 'c5555555-5555-5555-5555-555555555555',
    sender_id: '44444444-4444-4444-4444-444444444444',
    sender_role: 'owner',
    raw_text: '📋 Total amount calculated, please confirm. 1.5kg 2-tier eggless chocolate cake: ₹1,200.',
    status: 'delivered',
    created_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  },
  {
    id: 'msg-seed-403',
    owner_id: '44444444-4444-4444-4444-444444444444',
    customer_id: 'c2222222-2222-2222-2222-222222222222',
    sender_id: 'c2222222-2222-2222-2222-222222222222',
    sender_role: 'customer',
    raw_text: 'Anil ji 1 kg pineapple cake heart shape bina anda',
    parsed_json: {
      customer_info: {
        name: 'Priya Patel',
        phone: '+91 9822003344',
        delivery_location: {
          address: 'B-12, Green Glen Layout, Bellandur, Bengaluru',
        },
      },
    },
    status: 'sent',
    created_at: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
  },
];

// Helper to seed vendor and customer profiles into Supabase public.profiles
export async function seedVendorProfiles(): Promise<Profile[]> {
  try {
    // 1. Upsert Vendors
    const vendorPayload = SEEDED_VENDORS.map((v) => ({
      id: v.id,
      email: v.email,
      full_name: v.full_name,
      phone: v.phone,
      role: 'owner',
      store_name: v.store_name,
      updated_at: new Date().toISOString(),
    }));

    await supabase.from('profiles').upsert(vendorPayload, { onConflict: 'id' });

    // 2. Upsert Customers
    const customerPayload = SEEDED_CUSTOMERS.map((c) => ({
      id: c.id,
      email: c.email,
      full_name: c.full_name,
      phone: c.phone,
      role: 'customer',
      delivery_location: c.delivery_location,
      updated_at: new Date().toISOString(),
    }));

    await supabase.from('profiles').upsert(customerPayload, { onConflict: 'id' });

    // 3. Seed initial 1-2 chats for vendors if messages table is empty for them
    try {
      const { data: existingMsgs } = await supabase.from('messages').select('id, owner_id').limit(50);
      const existingOwnerIds = new Set((existingMsgs || []).map((m: any) => m.owner_id));

      const missingChats = SEEDED_CHATS.filter((chat) => !existingOwnerIds.has(chat.owner_id));
      if (missingChats.length > 0) {
        const insertPayload = missingChats.map((m) => ({
          owner_id: m.owner_id,
          customer_id: m.customer_id,
          sender_id: m.sender_id,
          sender_role: m.sender_role,
          raw_text: m.raw_text,
          parsed_json: m.parsed_json || null,
          status: m.status || 'sent',
          created_at: m.created_at || new Date().toISOString(),
        }));
        await supabase.from('messages').insert(insertPayload);
      }
    } catch (msgSeedErr) {
      console.warn('Initial chat message seeding warning:', msgSeedErr);
    }

    const { data: updatedOwners } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'owner');

    return updatedOwners && updatedOwners.length > 0 ? updatedOwners : SEEDED_VENDORS;
  } catch (err) {
    console.warn('Vendor and customer seeding exception:', err);
    return SEEDED_VENDORS;
  }
}

// Helper to ensure target profile exists in public.profiles before referencing in messages
export async function ensureProfileExists(profile: Profile): Promise<boolean> {
  try {
    const { error } = await supabase.from('profiles').upsert(
      [
        {
          id: profile.id,
          email: profile.email || 'user@example.com',
          full_name: profile.full_name || profile.store_name || 'User',
          phone: profile.phone || '+91 0000000000',
          role: profile.role || 'customer',
          store_name: profile.store_name || null,
          delivery_location: profile.delivery_location || null,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: 'id' }
    );

    if (error) {
      console.warn('Profile upsert warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Profile upsert exception:', err);
    return false;
  }
}

// Helper to safely send a message to Supabase
export async function sendMessageToSupabase(msg: Message): Promise<{ data: Message | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          owner_id: msg.owner_id,
          customer_id: msg.customer_id,
          sender_id: msg.sender_id,
          sender_role: msg.sender_role,
          raw_text: msg.raw_text,
          parsed_json: msg.parsed_json || null,
          status: msg.status || 'sent',
        },
      ])
      .select();

    if (error) {
      console.warn('Supabase message insert error:', error.message);
      return { data: null, error };
    }

    return { data: data?.[0] || null, error: null };
  } catch (err) {
    console.warn('Supabase message insert exception:', err);
    return { data: null, error: err };
  }
}

