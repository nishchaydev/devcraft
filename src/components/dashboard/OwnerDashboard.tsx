import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, SEEDED_CUSTOMERS } from '../../lib/supabase';
import { fetchCombinedMessages, dispatchMessage, subscribeToLocalMessages } from '../../lib/messageSync';
import { Message, Profile } from '../../types/app';
import { parseOrderWithGroq, ParseOrderResult } from '../../lib/groq';
import { db } from '../../db/schema';
import { IntakeView } from '../../views/IntakeView';
import { OrdersView } from '../../views/OrdersView';
import { AnalyticsView } from '../../views/AnalyticsView';
import { LanguageProvider } from '../../context/LanguageContext';
import {
  MessageSquare,
  FileCode2,
  Send,
  Sparkles,
  Copy,
  Download,
  CheckCircle2,
  RefreshCw,
  MapPin,
  Share2,
  Loader2,
  CheckCheck,
  Search,
  Smile,
  Paperclip,
  Mic,
  Circle,
  Package,
  PlusCircle,
  BarChart3,
  Save,
  Menu,
  ArrowLeft
} from 'lucide-react';

const VENDOR_REPLY_CHIPS = [
  "✓ Order Confirmed (20m delivery)",
  "⚠️ Out of stock query - substitute available?",
  "🛵 Out for delivery - arriving shortly",
  "📋 Total amount calculated, please confirm",
];

export const OwnerDashboard: React.FC = () => {
  const { profile, activeProfile } = useAuth();
  const currentOwner = activeProfile || profile;

  const [activeTab, setActiveTab] = useState<
    'chats' | 'parser' | 'orders' | 'intake' | 'queries'
  >('chats');

  const [messages, setMessages] = useState<Message[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const selectedCustomerIdRef = useRef<string | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showCustomerListOnMobile, setShowCustomerListOnMobile] = useState(true);

  const handleSelectCustomer = (id: string) => {
    selectedCustomerIdRef.current = id;
    setSelectedCustomerId(id);
    setShowCustomerListOnMobile(false);
  };

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Parser Workstation states
  const [parseResult, setParseResult] = useState<ParseOrderResult | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [forwardedMessages, setForwardedMessages] = useState<Message[]>([]);
  const [savedToLedger, setSavedToLedger] = useState(false);

  // Reply Input & Copy states
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [searchCustQuery, setSearchCustQuery] = useState('');

  // Fetch messages and customer profiles for store owner
  const fetchAllData = async () => {
    if (!currentOwner) return;

    try {
      // 1. Fetch combined messages for current owner
      const combinedMsgs = await fetchCombinedMessages(currentOwner.id);
      setMessages(combinedMsgs);

      // 2. Fetch customer profiles from Supabase & merge with SEEDED_CUSTOMERS
      const { data: custData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer');

      const custMap = new Map<string, Profile>();

      const addCustomer = (c: Profile) => {
        const key = c.email ? c.email.toLowerCase() : c.id;
        const existing = custMap.get(key);
        if (existing) {
          const isSeedId = (id: string) => id.startsWith('c') && id.includes('1111');
          if (isSeedId(existing.id) && !isSeedId(c.id)) {
            custMap.set(key, { ...existing, ...c });
          } else {
            custMap.set(key, { ...c, ...existing, id: c.id || existing.id });
          }
        } else {
          custMap.set(key, c);
        }
      };

      // Add seeded customers
      SEEDED_CUSTOMERS.forEach(addCustomer);

      // Add Supabase profiles
      if (custData && custData.length > 0) {
        custData.forEach(addCustomer);
      }

      // Add any dynamic customer profile from combined network & local messages
      combinedMsgs.forEach((m) => {
        if (m.owner_id === currentOwner.id && m.parsed_json?.customer_info) {
          const info = m.parsed_json.customer_info;
          const key = info.email ? info.email.toLowerCase() : m.customer_id;
          if (!custMap.has(key)) {
            custMap.set(key, {
              id: m.customer_id,
              email: info.email || `${m.customer_id.substring(0, 8)}@devcraft.app`,
              full_name: info.name || 'Customer',
              phone: info.phone || '',
              role: 'customer',
              delivery_location: info.delivery_location,
            });
          }
        }
      });

      const customerArray = Array.from(custMap.values());
      setCustomers(customerArray);

      // Only set initial customer if non-selected yet
      if (!selectedCustomerIdRef.current && customerArray.length > 0) {
        selectedCustomerIdRef.current = customerArray[0].id;
        setSelectedCustomerId(customerArray[0].id);
      }
    } catch (err) {
      console.warn('Error fetching owner data:', err);
    }
  };

  // Realtime subscription + local bus + polling
  useEffect(() => {
    if (!currentOwner) return;

    fetchAllData();

    // Local broadcast channel
    const unsubscribeLocal = subscribeToLocalMessages((newMsg) => {
      if (newMsg.owner_id === currentOwner.id) {
        fetchAllData();
      }
    });

    // Supabase Realtime channel
    const channel = supabase
      .channel(`owner-messages-${currentOwner.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `owner_id=eq.${currentOwner.id}`,
        },
        () => {
          fetchAllData();
        }
      )
      .subscribe();

    const interval = setInterval(fetchAllData, 800);

    return () => {
      unsubscribeLocal();
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [currentOwner]);

  // Trigger Fin AI Parser
  const handleRunParser = async (msg: Message) => {
    setIsParsing(true);
    setSelectedMessage(msg);
    setSavedToLedger(false);

    const customerMeta = msg.parsed_json?.customer_info || {
      name: 'Customer',
      delivery_location: 'Location not specified',
    };

    const result = await parseOrderWithGroq(msg.raw_text, customerMeta, []);
    setParseResult(result);
    setIsParsing(false);
  };

  // Forward message to parser workstation
  const handleForwardToParser = (msg: Message) => {
    // Add to forwarded messages if not already there
    setForwardedMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
    setSelectedMessage(msg);
    setActiveTab('parser');
    handleRunParser(msg);
  };

  // Save parsed result to Order Ledger
  const handleSaveToLedger = async () => {
    if (!parseResult || !selectedMessage) return;
    try {
      const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
      await db.orders.add({
        id: orderId,
        customer: parseResult.customer_info?.name || 'Customer',
        items: (parseResult.items || []).map((item) => ({
          description: item.description || 'Item',
          quantity: item.quantity || 1,
          attributes: item.attributes || {},
        })),
        due_date: parseResult.due_date || null,
        amount: parseResult.total_amount || null,
        references_prior_order: false,
        confidence: 0.9,
        needs_clarification: parseResult.needs_clarification || false,
        status: parseResult.needs_clarification ? 'NEEDS_CLARIFICATION' : 'SYNCED',
        device_id: 'owner-parser',
        updated_at: new Date().toISOString(),
        is_deleted: false,
        is_paid: false,
      });
      setSavedToLedger(true);
    } catch (err) {
      console.warn('Error saving to ledger:', err);
    }
  };

  // Send owner reply to customer
  const handleSendOwnerReply = async (textToSend?: string) => {
    const text = textToSend || replyText;
    const activeId = selectedCustomerIdRef.current || selectedCustomerId;
    if (!text.trim() || !currentOwner || !activeId) return;

    setSendingReply(true);
    const tempId = `msg-owner-${Date.now()}`;

    const replyMsg: Message = {
      id: tempId,
      owner_id: currentOwner.id,
      customer_id: activeId,
      sender_id: currentOwner.id,
      sender_role: 'owner',
      raw_text: text.trim(),
      status: 'sent',
      created_at: new Date().toISOString(),
    };

    setReplyText('');

    try {
      const selectedCustomerObj = customers.find((c) => c.id === activeId);
      await dispatchMessage(replyMsg, currentOwner, selectedCustomerObj);
      await fetchAllData();
    } catch (err) {
      console.warn('Error sending owner reply:', err);
    } finally {
      setSendingReply(false);
    }
  };

  // Copy JSON to clipboard
  const handleCopyJson = () => {
    if (!parseResult) return;
    navigator.clipboard.writeText(JSON.stringify(parseResult, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Download JSON
  const handleDownloadJson = () => {
    if (!parseResult) return;
    const jsonStr = JSON.stringify(parseResult, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-parse-${selectedMessage?.id || Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeCustId = selectedCustomerIdRef.current || selectedCustomerId;
  const currentCustomerProfile = customers.find((c) => c.id === activeCustId);

  const currentCustomerMessages = messages.filter((m) => {
    // 1. Match by exact ID
    if (m.customer_id === activeCustId || m.sender_id === activeCustId) return true;
    
    // 2. Match by email
    if (currentCustomerProfile?.email) {
      const targetEmail = currentCustomerProfile.email.toLowerCase();
      
      // If message has customer email in parsed_json
      if (m.parsed_json?.customer_info?.email?.toLowerCase() === targetEmail) return true;
      
      // If message has customer_id that corresponds to a seeded customer with this email
      const seeded = SEEDED_CUSTOMERS.find((c) => c.id === m.customer_id);
      if (seeded && seeded.email.toLowerCase() === targetEmail) return true;
    }
    
    return false;
  });

  const filteredCustomers = customers.filter((c) => {
    const name = c.full_name || c.email || '';
    return name.toLowerCase().includes(searchCustQuery.toLowerCase());
  });

  return (
    <LanguageProvider>
      <div className="h-[calc(100vh-5rem)] flex flex-col md:flex-row bg-[#f5f1ec] border border-[#d3cec6] rounded-2xl overflow-hidden shadow-sm font-sans text-[#111111] relative">
        {/* Backdrop for mobile drawer */}
        {isNavOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setIsNavOpen(false)}
          />
        )}

        {/* 🟢 OWNER NAVIGATION SIDEBAR */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#d3cec6] flex flex-col shrink-0 transition-transform duration-300 transform ${isNavOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex md:w-64`}>
          <div className="p-3.5 px-4 bg-[#faf8f5] border-b border-[#d3cec6]">
            <h3 className="font-semibold text-xs text-[#111111] truncate">
              {currentOwner?.store_name || currentOwner?.full_name || 'Store Workstation'}
            </h3>
            <p className="text-[10px] text-[#27ae60] flex items-center gap-1 font-semibold mt-0.5">
              <Circle className="w-2 h-2 fill-[#27ae60] text-[#27ae60]" />
              <span><span>Vendor Suite • Fin AI Engine</span></span>
            </p>
          </div>

          <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
            <button
              onClick={() => {
                setActiveTab('chats');
                setIsNavOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all ${
                activeTab === 'chats'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-[#626260] hover:text-[#111111] hover:bg-[#faf8f5]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>💬 Customer Chats</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('parser');
                setIsNavOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all ${
                activeTab === 'parser'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-[#626260] hover:text-[#111111] hover:bg-[#faf8f5]'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              <span>📨 Messages & Fin AI Parser</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                setIsNavOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-[#626260] hover:text-[#111111] hover:bg-[#faf8f5]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>📋 Order Ledger</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('intake');
                setIsNavOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all ${
                activeTab === 'intake'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-[#626260] hover:text-[#111111] hover:bg-[#faf8f5]'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>➕ Quick Intake</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('queries');
                setIsNavOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all ${
                activeTab === 'queries'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-[#626260] hover:text-[#111111] hover:bg-[#faf8f5]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>⚡ Operational Queries</span>
            </button>
          </nav>
        </div>

        {/* 🟢 MAIN WORKSTATION VIEWPORT */}
        <div className="flex-1 flex flex-col bg-[#faf8f5] overflow-hidden">
          {/* TAB 1: 💬 CUSTOMER CHATS */}
          {activeTab === 'chats' && (
            <div className="h-full flex flex-col md:flex-row">
              {/* Customer Inbox Sub-Sidebar */}
              <div className={`w-full md:w-64 bg-white border-r border-[#d3cec6] ${showCustomerListOnMobile ? 'flex' : 'hidden'} md:flex flex-col shrink-0`}>
                <div className="p-2.5 border-b border-[#d3cec6] flex items-center gap-2">
                  <button
                    onClick={() => setIsNavOpen(true)}
                    className="md:hidden p-1.5 rounded-lg text-[#626260] hover:text-[#111111] hover:bg-[#faf8f5] border border-[#d3cec6]"
                    title="Menu"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-[#7b7b78] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchCustQuery}
                      onChange={(e) => setSearchCustQuery(e.target.value)}
                      placeholder="Search customer inbox..."
                      className="w-full bg-[#faf8f5] text-xs text-[#111111] placeholder-[#7b7b78] rounded-lg pl-8 pr-3 py-2 border border-[#d3cec6] focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-[#e5e0d8]">
                  {filteredCustomers.length === 0 ? (
                    <div className="p-4 text-xs text-[#7b7b78] text-center">No customers found</div>
                  ) : (
                    filteredCustomers.map((c) => {
                      const hasMsgs = messages.some((m) => m.customer_id === c.id || m.sender_id === c.id);
                      const isSelected = activeCustId === c.id;

                      return (
                        <button
                          key={c.id}
                          onClick={() => handleSelectCustomer(c.id)}
                          className={`w-full text-left p-3.5 transition-all flex items-center gap-2.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#faf8f5] border-l-4 border-[#ff5600]'
                              : 'hover:bg-[#faf8f5]'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full bg-[#ff5600]/10 border border-[#ff5600]/30 flex items-center justify-center font-semibold text-[#ff5600] text-xs shrink-0">
                            {c.full_name?.charAt(0) || c.email?.charAt(0) || 'C'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-baseline mb-0.5">
                              <div className="font-semibold text-xs text-[#111111] truncate">
                                {c.full_name || c.email || 'Customer'}
                              </div>
                              {hasMsgs && (
                                <span className="text-[9px] bg-[#ff5600] text-white font-semibold px-1.5 py-0.5 rounded-full">
                                  Chat
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#7b7b78] truncate">
                              {c.phone || c.email || 'No phone'}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Chat Conversation Window */}
              <div className={`flex-1 ${!showCustomerListOnMobile ? 'flex' : 'hidden'} md:flex flex-col h-full bg-[#faf8f5]`}>
                {currentCustomerProfile ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-3.5 px-4 bg-white border-b border-[#d3cec6] flex justify-between items-center z-10 shadow-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowCustomerListOnMobile(true)}
                          className="md:hidden p-1 rounded-lg text-[#626260] hover:text-[#111111] hover:bg-[#faf8f5] border border-[#d3cec6] mr-1.5"
                          title="Back to inbox"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div>
                          <h4 className="font-semibold text-xs text-[#111111]">
                            {currentCustomerProfile.full_name || currentCustomerProfile.email || 'Customer'}
                          </h4>
                          <p className="text-[10px] text-[#7b7b78]">
                            {currentCustomerProfile.phone || currentCustomerProfile.email || 'No phone'}
                          </p>
                        </div>
                      </div>
                      {currentCustomerProfile.delivery_location && (
                        <div className="text-[10px] bg-[#faf8f5] px-3 py-1 rounded-full text-[#7b7b78] flex items-center gap-1 border border-[#d3cec6]">
                          <MapPin className="w-3.5 h-3.5 text-[#ff5600]" />
                          <span className="truncate max-w-[200px] text-[#111111]">
                            {typeof currentCustomerProfile.delivery_location === 'object'
                              ? currentCustomerProfile.delivery_location.address
                              : currentCustomerProfile.delivery_location}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Messages Feed */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#faf8f5]">
                      {currentCustomerMessages.length === 0 ? (
                        <div className="text-center py-16 text-[#7b7b78] text-xs">
                          No messages yet from {currentCustomerProfile.full_name || 'this customer'}. Send a reply below!
                        </div>
                      ) : (
                        currentCustomerMessages.map((msg, idx) => {
                          const isOwner = msg.sender_role === 'owner' || msg.sender_id === currentOwner?.id;
                          const timestamp = msg.created_at
                            ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                          return (
                            <div
                              key={msg.id || idx}
                              className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}
                            >
                              <div
                                className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs space-y-2 shadow-sm ${
                                  isOwner
                                    ? 'bg-white text-[#111111] border border-[#d3cec6] rounded-tr-none'
                                    : 'bg-[#ff5600] text-white rounded-tl-none'
                                }`}
                              >
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.raw_text}</p>

                                <div className="flex items-center justify-between pt-1 text-[10px] opacity-80">
                                  {!isOwner ? (
                                    <button
                                      onClick={() => handleForwardToParser(msg)}
                                      className="bg-black/20 hover:bg-black/30 text-white border border-white/20 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 transition-all cursor-pointer"
                                    >
                                      <Share2 className="w-3 h-3 text-white" />
                                      <span>↪ Forward to Fin AI Parser</span>
                                    </button>
                                  ) : (
                                    <span></span>
                                  )}

                                  <div className="flex items-center gap-1">
                                    <span>{timestamp}</span>
                                    {isOwner && <CheckCheck className="w-3.5 h-3.5 text-[#ff5600]" />}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Vendor Quick Reply Chips */}
                    <div className="p-2 px-3 bg-white border-t border-[#d3cec6] overflow-x-auto flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-[#ff5600] shrink-0">Quick Replies:</span>
                      {VENDOR_REPLY_CHIPS.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendOwnerReply(chip)}
                          className="shrink-0 bg-[#faf8f5] hover:bg-[#f5f1ec] text-[#111111] border border-[#d3cec6] text-[10px] px-2.5 py-1 rounded-full cursor-pointer transition-all"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Input Form */}
                    <div className="p-3 bg-white border-t border-[#d3cec6] flex items-center gap-2">
                      <button className="p-2 text-[#7b7b78] hover:text-[#111111] hover:bg-[#faf8f5] rounded-lg transition-all">
                        <Smile className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-[#7b7b78] hover:text-[#111111] hover:bg-[#faf8f5] rounded-lg transition-all">
                        <Paperclip className="w-5 h-5" />
                      </button>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendOwnerReply();
                        }}
                        className="flex-1 flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type vendor reply to customer..."
                          className="w-full bg-[#faf8f5] border border-[#d3cec6] text-xs text-[#111111] placeholder-[#7b7b78] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#111111]"
                        />
                        {replyText.trim() ? (
                          <button
                            type="submit"
                            disabled={sendingReply}
                            className="ic-btn-fin p-2.5 rounded-lg shadow-sm transition-all shrink-0 cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="p-2 text-[#7b7b78] hover:text-[#111111] hover:bg-[#faf8f5] rounded-lg shrink-0"
                          >
                            <Mic className="w-5 h-5" />
                          </button>
                        )}
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-xs text-[#7b7b78]">
                    Select a customer to open conversation
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: 📨 MESSAGES & FIN AI PARSER WORKSTATION */}
          {activeTab === 'parser' && (
            <div className="h-full flex flex-col md:flex-row">
              {/* Forwarded Messages List Column */}
              <div className="w-full md:w-80 bg-white border-r border-[#d3cec6] p-3 overflow-y-auto shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setIsNavOpen(true)}
                    className="md:hidden p-1.5 rounded-lg text-[#626260] hover:text-[#111111] hover:bg-[#faf8f5] border border-[#d3cec6]"
                    title="Menu"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                  <div className="text-xs font-semibold text-[#111111]">Forwarded Messages for Parsing</div>
                </div>
                {forwardedMessages.length === 0 ? (
                  <div className="text-xs text-[#7b7b78] py-8 text-center">
                    No forwarded messages yet.<br />
                    <span className="text-[10px]">Use "↪ Forward to Fin AI Parser" from Customer Chats.</span>
                  </div>
                ) : (
                  forwardedMessages.map((m, idx) => (
                    <button
                      key={m.id || idx}
                      onClick={() => handleRunParser(m)}
                      className={`w-full text-left p-3 rounded-xl text-xs mb-2 transition-all border cursor-pointer ${
                        selectedMessage?.id === m.id
                          ? 'bg-[#ff5600] border-[#ff5600] text-white shadow-sm'
                          : 'bg-[#faf8f5] border-[#d3cec6] text-[#111111] hover:bg-[#f5f1ec]'
                      }`}
                    >
                      <div className={`font-medium text-xs truncate mb-1 ${
                        selectedMessage?.id === m.id ? 'text-white' : 'text-[#111111]'
                      }`}>
                        "{m.raw_text}"
                      </div>
                      <div className={`text-[10px] flex items-center justify-between ${
                        selectedMessage?.id === m.id ? 'text-white/70' : 'text-[#7b7b78]'
                      }`}>
                        <span>Customer Msg</span>
                        <span>
                          {new Date(m.created_at || Date.now()).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Fin AI Parser Inspector Workstation Viewport */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#faf8f5]">
                {selectedMessage ? (
                  <>
                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#d3cec6] p-4 rounded-xl shadow-sm">
                      <div>
                        <h4 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#ff5600]" />
                          <span>Fin AI Order Parser Inspector</span>
                        </h4>
                        <p className="text-[11px] text-[#7b7b78]">Model: openai/gpt-oss-120b</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRunParser(selectedMessage)}
                          disabled={isParsing}
                          className="ic-btn-fin py-1.5 px-3 text-xs flex items-center gap-1.5"
                        >
                          {isParsing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3.5 h-3.5" />
                          )}
                          <span>Re-Run Fin AI Parser</span>
                        </button>

                        {parseResult && (
                          <>
                            <button
                              onClick={handleCopyJson}
                              className="ic-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                            >
                              {copiedJson ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#ff5600]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
                            </button>

                            <button
                              onClick={handleDownloadJson}
                              className="ic-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download JSON</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Raw Payload Card */}
                    <div className="bg-white border border-[#d3cec6] p-4 rounded-xl space-y-2 shadow-sm">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#7b7b78]">
                        Raw Message Text
                      </span>
                      <p className="text-xs text-[#111111] font-mono bg-[#faf8f5] p-3 rounded-lg border border-[#d3cec6]">
                        {selectedMessage.raw_text}
                      </p>
                    </div>

                    {/* Extracted JSON Card */}
                    {isParsing ? (
                      <div className="p-12 text-center bg-white border border-[#d3cec6] rounded-xl space-y-2 shadow-sm">
                        <Loader2 className="w-8 h-8 text-[#ff5600] animate-spin mx-auto" />
                        <p className="text-xs text-[#7b7b78]">Parsing order with Fin AI...</p>
                      </div>
                    ) : parseResult ? (
                      <div className="bg-white border border-[#d3cec6] p-4 rounded-xl space-y-3 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#ff5600]">
                            Structured JSON Output
                          </span>
                          {parseResult.needs_clarification && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                              ⚠️ Needs Clarification
                            </span>
                          )}
                        </div>

                        <pre className="bg-[#faf8f5] p-4 rounded-lg text-xs text-[#111111] font-mono overflow-x-auto border border-[#d3cec6] leading-relaxed">
                          {JSON.stringify(parseResult, null, 2)}
                        </pre>

                        {/* Save to Order Ledger Button */}
                        <div className="pt-2 border-t border-[#e5e0d8]">
                          {savedToLedger ? (
                            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Saved to Order Ledger</span>
                            </div>
                          ) : (
                            <button
                              onClick={handleSaveToLedger}
                              className="ic-btn-fin py-2 px-4 text-xs flex items-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save to Order Ledger</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-12 text-xs text-[#7b7b78]">
                    Select a forwarded message from the left to inspect and parse
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: 📋 ORDER LEDGER (OrdersView) */}
          {activeTab === 'orders' && (
            <div className="h-full overflow-y-auto p-4 sm:p-6 bg-[#faf8f5] flex flex-col">
              <div className="md:hidden flex items-center gap-2 mb-4">
                <button
                  onClick={() => setIsNavOpen(true)}
                  className="p-1.5 rounded-lg text-[#626260] hover:text-[#111111] hover:bg-[#faf8f5] border border-[#d3cec6]"
                  title="Menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-[#626260]">Order Ledger</span>
              </div>
              <div className="flex-1">
                <OrdersView onNewOrderClick={() => setActiveTab('intake')} />
              </div>
            </div>
          )}

          {/* TAB 4: ➕ QUICK INTAKE (IntakeView) */}
          {activeTab === 'intake' && (
            <div className="h-full overflow-y-auto p-4 sm:p-6 bg-[#faf8f5] flex flex-col">
              <div className="md:hidden flex items-center gap-2 mb-4">
                <button
                  onClick={() => setIsNavOpen(true)}
                  className="p-1.5 rounded-lg text-[#626260] hover:text-[#111111] hover:bg-[#faf8f5] border border-[#d3cec6]"
                  title="Menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-[#626260]">Quick Intake</span>
              </div>
              <div className="flex-1">
                <IntakeView />
              </div>
            </div>
          )}

          {/* TAB 5: ⚡ OPERATIONAL QUERIES (AnalyticsView) */}
          {activeTab === 'queries' && (
            <div className="h-full overflow-y-auto p-4 sm:p-6 bg-[#faf8f5] flex flex-col">
              <div className="md:hidden flex items-center gap-2 mb-4">
                <button
                  onClick={() => setIsNavOpen(true)}
                  className="p-1.5 rounded-lg text-[#626260] hover:text-[#111111] hover:bg-[#faf8f5] border border-[#d3cec6]"
                  title="Menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-[#626260]">Operational Queries</span>
              </div>
              <div className="flex-1">
                <AnalyticsView />
              </div>
            </div>
          )}
        </div>
      </div>
    </LanguageProvider>
  );
};
