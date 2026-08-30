import { Message, Profile } from '../types/app';
import { supabase, SEEDED_CHATS, SEEDED_CUSTOMERS } from './supabase';

const LOCAL_STORAGE_KEY = 'via_paar_shared_messages_v1';
const BUS_CHANNEL = 'via_paar_message_bus';

let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(BUS_CHANNEL);
  } catch (err) {
    console.warn('BroadcastChannel not supported:', err);
  }
}

// Get all local messages from localStorage
export function getLocalMessages(): Message[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

// Save message to localStorage and broadcast
export function saveLocalMessage(msg: Message): Message[] {
  const current = getLocalMessages();
  const exists = current.some(
    (m) =>
      m.id === msg.id ||
      (m.raw_text === msg.raw_text &&
        m.sender_id === msg.sender_id &&
        Math.abs(new Date(m.created_at || 0).getTime() - new Date(msg.created_at || 0).getTime()) < 5000)
  );

  let updated = current;
  if (!exists) {
    updated = [...current, msg];
  } else {
    updated = current.map((m) =>
      m.id === msg.id || (m.raw_text === msg.raw_text && m.sender_id === msg.sender_id) ? msg : m
    );
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'NEW_MESSAGE', message: msg });
    }
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }

  return updated;
}

// Fetch network messages from Vite dev server backend
export async function fetchServerMessages(): Promise<Message[]> {
  try {
    const res = await fetch('/api/messages');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    // ignore network errors if offline
  }
  return [];
}

// Post message to Vite dev server backend
export async function postServerMessage(msg: Message): Promise<boolean> {
  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// Helper to listen for real-time local broadcasts
export function subscribeToLocalMessages(onMessage: (msg: Message) => void): () => void {
  if (!broadcastChannel) {
    const handler = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          const msgs: Message[] = JSON.parse(e.newValue);
          if (msgs.length > 0) {
            onMessage(msgs[msgs.length - 1]);
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  const handler = (event: MessageEvent) => {
    if (event.data?.type === 'NEW_MESSAGE' && event.data.message) {
      onMessage(event.data.message);
    }
  };

  broadcastChannel.addEventListener('message', handler);
  return () => {
    broadcastChannel?.removeEventListener('message', handler);
  };
}

// Master function to fetch combined messages across network, localStorage, and seeds
export async function fetchCombinedMessages(
  ownerId: string,
  customerId?: string,
  customerEmail?: string
): Promise<Message[]> {
  // 1. Fetch from Vite network sync backend
  const serverMsgs = await fetchServerMessages();

  // 2. Fetch local storage msgs
  const localList = getLocalMessages();

  // 3. Match customer helper
  const matchCustomer = (m: Message) => {
    if (!customerId) return true;
    if (m.customer_id === customerId || m.sender_id === customerId) return true;
    if (customerEmail && m.parsed_json?.customer_info?.email?.toLowerCase() === customerEmail.toLowerCase()) return true;

    // Check if m.customer_id maps to a seeded customer with matching email
    const seededMatch = SEEDED_CUSTOMERS.find((c) => c.id === m.customer_id);
    if (seededMatch && customerEmail && seededMatch.email.toLowerCase() === customerEmail.toLowerCase()) {
      return true;
    }

    return false;
  };

  const seedMsgs = SEEDED_CHATS.filter((m) => m.owner_id === ownerId && matchCustomer(m));
  const filteredServer = serverMsgs.filter((m) => m.owner_id === ownerId && matchCustomer(m));
  const filteredLocal = localList.filter((m) => m.owner_id === ownerId && matchCustomer(m));

  const mergedMap = new Map<string, Message>();

  seedMsgs.forEach((m) => mergedMap.set(m.id || `seed-${Date.now()}`, m));
  filteredServer.forEach((m) => mergedMap.set(m.id || `srv-${Date.now()}`, m));
  filteredLocal.forEach((m) => {
    const key = m.id || `local-${Date.now()}`;
    mergedMap.set(key, m);
  });

  const merged = Array.from(mergedMap.values()).sort(
    (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
  );

  return merged;
}

// Master function to dispatch a message across all transport layers
export async function dispatchMessage(
  msg: Message,
  senderProfile?: Profile,
  recipientProfile?: Profile
): Promise<Message> {
  const enrichedMsg = { ...msg };
  if (!enrichedMsg.parsed_json) {
    enrichedMsg.parsed_json = {};
  }
  if (!enrichedMsg.parsed_json.customer_info) {
    const cust = senderProfile?.role === 'customer' ? senderProfile : recipientProfile;
    if (cust) {
      enrichedMsg.parsed_json.customer_info = {
        name: cust.full_name || cust.email || 'Customer',
        email: cust.email,
        phone: cust.phone || '',
        delivery_location: cust.delivery_location,
      };
    }
  }

  // 1. Post to Network Server Sync Endpoint (Syncs immediately across ALL devices & browsers)
  await postServerMessage(enrichedMsg);

  // 2. Save to local storage & broadcast to other tabs on same device
  saveLocalMessage(enrichedMsg);

  // 3. Try Supabase message insertion in background (with valid schema columns only)
  try {
    await supabase.from('messages').insert([
      {
        owner_id: enrichedMsg.owner_id,
        customer_id: enrichedMsg.customer_id,
        sender_id: enrichedMsg.sender_id,
        sender_role: enrichedMsg.sender_role,
        raw_text: enrichedMsg.raw_text,
        parsed_json: enrichedMsg.parsed_json,
      },
    ]);
  } catch (err) {
    // fallback gracefully
  }

  return enrichedMsg;
}
