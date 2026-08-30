import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, SEEDED_VENDORS } from '../../lib/supabase';
import { fetchCombinedMessages, dispatchMessage, subscribeToLocalMessages } from '../../lib/messageSync';
import { Message, Profile } from '../../types/app';
import {
  Send,
  MapPin,
  RefreshCw,
  Sparkles,
  CheckCheck,
  Phone,
  Video,
  Search,
  Paperclip,
  Smile,
  Mic,
  Circle
} from 'lucide-react';

const QUICK_ORDER_CHIPS = [
  "bhaiya 2 kurta chahiye navy blue, chest 40, parso tak ho jayega kya?",
  "1 kg atta, 500ml milk, 1 pkt bread kal subah bhej do",
  "bhaiya 1 pajama cream color, waist 34",
  "2L Toned Milk and 100g Amul Butter delivery to my location",
];

export const CustomerDashboard: React.FC = () => {
  const { profile, activeProfile, vendorList } = useAuth();
  const currentCustomer = activeProfile || profile;

  const [stores, setStores] = useState<Profile[]>(SEEDED_VENDORS);
  const [selectedStore, setSelectedStore] = useState<Profile | null>(SEEDED_VENDORS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingStores, setLoadingStores] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchStoreQuery, setSearchStoreQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch verified store owners & combine with seeded vendors
  const fetchStores = async () => {
    try {
      setLoadingStores(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'owner');

      const storeMap = new Map<string, Profile>();
      SEEDED_VENDORS.forEach((v) => storeMap.set(v.id, v));
      vendorList.forEach((v) => storeMap.set(v.id, v));
      if (!error && data) {
        data.forEach((d) => storeMap.set(d.id, d));
      }

      const combinedStores = Array.from(storeMap.values());
      setStores(combinedStores);

      if (!selectedStore && combinedStores.length > 0) {
        setSelectedStore(combinedStores[0]);
      }
    } catch (err) {
      console.warn('Store fetch error:', err);
      setStores(SEEDED_VENDORS);
      if (!selectedStore) setSelectedStore(SEEDED_VENDORS[0]);
    } finally {
      setLoadingStores(false);
    }
  };

  // Fetch combined messages between customer & selected store
  const loadMessages = async () => {
    if (!currentCustomer || !selectedStore) return;

    try {
      const merged = await fetchCombinedMessages(selectedStore.id, currentCustomer.id, currentCustomer.email);
      setMessages(merged);
    } catch (err) {
      console.warn('Error loading messages:', err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [vendorList]);

  // Realtime subscription + local bus + 1.5s polling
  useEffect(() => {
    if (!selectedStore || !currentCustomer) return;

    loadMessages();

    // Local broadcast channel listener
    const unsubscribeLocal = subscribeToLocalMessages((newMsg) => {
      if (
        (newMsg.owner_id === selectedStore.id && newMsg.customer_id === currentCustomer.id) ||
        (newMsg.customer_id === currentCustomer.id)
      ) {
        loadMessages();
      }
    });

    // Supabase Realtime channel
    const channel = supabase
      .channel(`cust-messages-${currentCustomer.id}-${selectedStore.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `customer_id=eq.${currentCustomer.id}`,
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    const interval = setInterval(loadMessages, 800);

    return () => {
      unsubscribeLocal();
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [selectedStore, currentCustomer]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !currentCustomer || !selectedStore) return;

    setSending(true);

    const locationMeta =
      typeof currentCustomer.delivery_location === 'object'
        ? currentCustomer.delivery_location
        : { address: currentCustomer.delivery_location || 'Default Delivery Location' };

    const tempId = `msg-cust-${Date.now()}`;
    const newMessage: Message = {
      id: tempId,
      owner_id: selectedStore.id,
      customer_id: currentCustomer.id,
      sender_id: currentCustomer.id,
      sender_role: 'customer',
      raw_text: text.trim(),
      parsed_json: {
        customer_info: {
          name: currentCustomer.full_name || currentCustomer.email,
          phone: currentCustomer.phone || '+91 9876543210',
          delivery_location: locationMeta,
        },
      },
      status: 'sent',
      created_at: new Date().toISOString(),
    };

    setInputText('');

    try {
      await dispatchMessage(newMessage, currentCustomer, selectedStore);
      await loadMessages();
    } catch (err) {
      console.warn('Error dispatching message:', err);
    } finally {
      setSending(false);
    }
  };

  const deliveryAddressStr =
    typeof currentCustomer?.delivery_location === 'object' &&
    currentCustomer?.delivery_location?.address
      ? currentCustomer.delivery_location.address
      : typeof currentCustomer?.delivery_location === 'string'
      ? currentCustomer.delivery_location
      : 'Default Location';

  const filteredStores = stores.filter((s) => {
    const name = s.store_name || s.full_name || '';
    return name.toLowerCase().includes(searchStoreQuery.toLowerCase());
  });

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col md:flex-row bg-[#0f141c] border border-[#222d34] rounded-2xl overflow-hidden shadow-2xl font-sans">
      {/* 🟢 INTERCOM SIDEBAR: VENDORS LIST */}
      <div className="w-full md:w-80 bg-[#161b22] border-b md:border-b-0 md:border-r border-[#262c36] flex flex-col shrink-0">
        <div className="p-3.5 px-4 bg-[#1f242d] flex justify-between items-center border-b border-[#262c36]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#ff5600] flex items-center justify-center font-bold text-white text-sm shadow-md">
              {currentCustomer?.full_name?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="font-bold text-xs text-[#e6edf3]">Verified Local Vendors</div>
              <div className="text-[10px] text-[#8b949e]">
                {currentCustomer?.full_name || currentCustomer?.email || 'Customer Account'}
              </div>
            </div>
          </div>
          <button
            onClick={fetchStores}
            className="p-1.5 rounded-full text-[#8b949e] hover:text-white hover:bg-[#262c36] transition-all"
            title="Refresh stores"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-2.5 bg-[#161b22] border-b border-[#262c36]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8b949e] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchStoreQuery}
              onChange={(e) => setSearchStoreQuery(e.target.value)}
              placeholder="Search local stores & vendors..."
              className="w-full bg-[#1f242d] text-xs text-[#e6edf3] placeholder-[#8b949e] rounded-xl pl-9 pr-3 py-2 border border-[#262c36] focus:outline-none focus:border-[#ff5600]"
            />
          </div>
        </div>

        {/* Stores List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#262c36]">
          {loadingStores ? (
            <div className="p-6 text-center text-xs text-[#8b949e]">Loading stores...</div>
          ) : (
            filteredStores.map((store) => {
              const isSelected = selectedStore?.id === store.id;
              return (
                <button
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className={`w-full text-left p-3.5 transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#21262d] text-white border-l-4 border-[#ff5600]'
                      : 'hover:bg-[#1f242d] text-[#c9d1d9]'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-[#ff5600]/20 border border-[#ff5600]/40 flex items-center justify-center font-bold text-[#ff5600] text-sm shrink-0 shadow-sm">
                    {store.store_name?.charAt(0) || store.full_name?.charAt(0) || store.email?.charAt(0) || 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <div className="font-bold text-xs text-[#e6edf3] truncate">
                        {store.store_name || store.full_name || store.email || 'Store'}
                      </div>
                      <span className="text-[10px] bg-[#ff5600]/10 text-[#ff5600] border border-[#ff5600]/30 px-1.5 py-0.2 rounded font-semibold">
                        Verified
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8b949e] truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#27ae60]"></span>
                      <span>{store.phone || store.email}</span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 🟢 INTERCOM CHAT VIEWPORT */}
      <div className="flex-1 flex flex-col bg-[#0f141c] relative">
        {selectedStore ? (
          <>
            {/* Intercom Chat Header */}
            <div className="p-3.5 px-4 bg-[#1f242d] border-b border-[#262c36] flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ff5600] flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {selectedStore.store_name?.charAt(0) || selectedStore.full_name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#e6edf3]">
                    {selectedStore.store_name || selectedStore.full_name || 'Store'}
                  </h4>
                  <p className="text-[10px] text-[#27ae60] flex items-center gap-1 font-semibold">
                    <Circle className="w-2 h-2 fill-[#27ae60] text-[#27ae60]" />
                    <span>online • Fin AI Verified Vendor</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 bg-[#161b22] px-3 py-1 rounded-full text-[11px] text-[#8b949e] border border-[#262c36]">
                  <MapPin className="w-3.5 h-3.5 text-[#ff5600] shrink-0" />
                  <span className="truncate max-w-[180px] text-[#e6edf3]">{deliveryAddressStr}</span>
                </div>
                <button className="p-2 text-[#8b949e] hover:text-white hover:bg-[#262c36] rounded-xl transition-all">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 text-[#8b949e] hover:text-white hover:bg-[#262c36] rounded-xl transition-all">
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Intercom Message Wallpaper & Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#0f141c] bg-[radial-gradient(#262c36_1px,transparent_1px)] [background-size:20px_20px]">
              <div className="mx-auto max-w-sm text-center bg-[#1f242d] border border-[#262c36] px-3.5 py-1.5 rounded-xl text-[10px] text-[#f2994a] shadow-sm">
                🔒 Messages are processed with Fin AI Parser engine & end-to-end security.
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-16 text-[#8b949e] text-xs space-y-2">
                  <p>Send an order message below to start your order with {selectedStore.store_name || selectedStore.full_name}!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isOutgoing = msg.sender_role === 'customer' || msg.sender_id === currentCustomer?.id;
                  const timestamp = msg.created_at
                    ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={msg.id || index}
                      className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs space-y-1.5 shadow-md relative ${
                          isOutgoing
                            ? 'bg-[#ff5600] text-white rounded-tr-none'
                            : 'bg-[#21262d] text-[#e6edf3] border border-[#262c36] rounded-tl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed text-xs">
                          {msg.raw_text}
                        </p>

                        <div className="flex items-center justify-end gap-1 text-[10px] opacity-80 pt-0.5 select-none">
                          <span>{timestamp}</span>
                          {isOutgoing && (
                            <CheckCheck className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Order Chips Bar */}
            <div className="p-2 px-3 bg-[#161b22] border-t border-[#262c36] overflow-x-auto flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#ff5600] flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3" /> Quick Order Pills:
              </span>
              {QUICK_ORDER_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="shrink-0 bg-[#1f242d] hover:bg-[#262c36] text-[#e6edf3] border border-[#262c36] text-[11px] px-3 py-1.5 rounded-full transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Intercom Input Bar */}
            <div className="p-3 bg-[#1f242d] border-t border-[#262c36] flex items-center gap-2">
              <button className="p-2 text-[#8b949e] hover:text-white hover:bg-[#262c36] rounded-xl transition-all">
                <Smile className="w-5 h-5" />
              </button>
              <button className="p-2 text-[#8b949e] hover:text-white hover:bg-[#262c36] rounded-xl transition-all">
                <Paperclip className="w-5 h-5" />
              </button>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex-1 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type an order message..."
                  className="w-full bg-[#161b22] border border-[#262c36] text-xs text-[#e6edf3] placeholder-[#8b949e] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#ff5600]"
                />

                {inputText.trim() ? (
                  <button
                    type="submit"
                    disabled={sending}
                    className="bg-[#ff5600] hover:bg-[#e04b00] text-white p-2.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="p-2 text-[#8b949e] hover:text-white hover:bg-[#262c36] rounded-xl shrink-0"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                )}
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-[#8b949e]">
            Select a store from the sidebar to start ordering
          </div>
        )}
      </div>
    </div>
  );
};
