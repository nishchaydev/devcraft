import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Bot, 
  Check, 
  ArrowRight, 
  BarChart3, 
  ChevronRight
} from 'lucide-react';

export const IntercomShowcaseView: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeTab, setActiveTab] = useState<'inbox' | 'fin' | 'analytics'>('inbox');

  return (
    <div className="ic-canvas min-h-screen text-[#111111] selection:bg-[#ff5600] selection:text-white pb-16">
      {/* Top Sticky Navigation */}
      <header className="sticky top-0 z-50 bg-[#f5f1ec]/90 backdrop-blur-md border-b border-[#d3cec6]/60 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#111111] rounded-md flex items-center justify-center text-white font-bold text-sm tracking-tighter">
                ic
              </div>
              <span className="font-medium text-lg tracking-tight">Intercom</span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#626260]">
              <a href="#features" className="hover:text-[#111111] transition-colors">Products</a>
              <a href="#fin" className="hover:text-[#111111] transition-colors flex items-center gap-1.5">
                <span>Fin AI</span>
                <span className="ic-fin-badge">AI 2.0</span>
              </a>
              <a href="#pricing" className="hover:text-[#111111] transition-colors">Pricing</a>
              <a href="#customers" className="hover:text-[#111111] transition-colors">Customers</a>
              <a href="#resources" className="hover:text-[#111111] transition-colors">Resources</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-[#626260] hover:text-[#111111] px-3 py-1.5 transition-colors">
              Sign in
            </button>
            <button className="ic-btn-primary text-sm">
              Start free trial
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#ffffff] border border-[#d3cec6] rounded-full px-3.5 py-1 text-xs font-medium text-[#626260] mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#ff5600]" />
          <span>Introducing Fin 2.0: The complete AI customer service suite</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#7b7b78]" />
        </div>

        <h1 className="ic-display-xl max-w-4xl mx-auto mb-6 text-[#111111]">
          The complete AI customer service platform
        </h1>

        <p className="text-xl md:text-2xl font-normal text-[#626260] max-w-2xl mx-auto mb-10 leading-relaxed">
          Instantly solve 50%+ of support queries, boost team productivity, and deliver personal customer service at scale.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button className="ic-btn-primary px-6 py-3 text-base">
            Start free trial <ArrowRight className="w-4 h-4" />
          </button>

          <button className="ic-btn-fin px-6 py-3 text-base">
            <Bot className="w-4 h-4" /> View Fin Demo
          </button>

          <button className="ic-btn-secondary px-6 py-3 text-base">
            Book a demo
          </button>
        </div>

        {/* Hero Product Mockup Card */}
        <div className="ic-product-card p-4 md:p-6 text-left shadow-sm max-w-5xl mx-auto border border-[#d3cec6]">
          {/* Mockup Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#e5e0d8] mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#e5e0d8]"></div>
              <div className="w-3 h-3 rounded-full bg-[#e5e0d8]"></div>
              <div className="w-3 h-3 rounded-full bg-[#e5e0d8]"></div>
              <span className="ml-2 text-xs font-mono text-[#7b7b78]">app.intercom.com/inbox/team-support</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('inbox')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'inbox' ? 'bg-[#111111] text-white' : 'text-[#626260] hover:bg-[#eee9e0]'}`}
              >
                Helpdesk Inbox
              </button>
              <button 
                onClick={() => setActiveTab('fin')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'fin' ? 'bg-[#ff5600] text-white' : 'text-[#626260] hover:bg-[#eee9e0]'}`}
              >
                Fin AI Agent
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'analytics' ? 'bg-[#111111] text-white' : 'text-[#626260] hover:bg-[#eee9e0]'}`}
              >
                Analytics
              </button>
            </div>
          </div>

          {/* Mockup Body Content */}
          {activeTab === 'inbox' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[380px] bg-[#faf8f5] p-3 rounded-lg border border-[#e5e0d8]">
              {/* Sidebar List */}
              <div className="bg-white rounded-md p-3 border border-[#e5e0d8]">
                <div className="text-xs font-semibold text-[#7b7b78] uppercase tracking-wider mb-3 px-1">Open Tickets (4)</div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-md bg-[#f5f1ec] border-l-4 border-[#ff5600]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-[#111111]">Sarah Connor</span>
                      <span className="text-[#9c9fa5]">2m ago</span>
                    </div>
                    <p className="text-xs text-[#626260] line-clamp-1">How do I upgrade my billing tier for 5 seats?</p>
                    <span className="inline-block mt-1.5 ic-fin-badge">Handled by Fin AI</span>
                  </div>
                  <div className="p-2.5 rounded-md hover:bg-[#faf8f5]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-[#111111]">Alex Mercer</span>
                      <span className="text-[#9c9fa5]">14m ago</span>
                    </div>
                    <p className="text-xs text-[#626260] line-clamp-1">API Webhook signature validation failing</p>
                  </div>
                  <div className="p-2.5 rounded-md hover:bg-[#faf8f5]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-[#111111]">DevCraft Ops</span>
                      <span className="text-[#9c9fa5]">1h ago</span>
                    </div>
                    <p className="text-xs text-[#626260] line-clamp-1">Custom domain SSL configuration</p>
                  </div>
                </div>
              </div>

              {/* Chat Conversation */}
              <div className="md:col-span-2 bg-white rounded-md p-4 border border-[#e5e0d8] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d8]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-medium text-xs">
                        SC
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-[#111111]">Sarah Connor</h4>
                        <p className="text-[11px] text-[#7b7b78]">sarah@acme-corp.io · Enterprise Plan</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#27ae60]/10 text-[#27ae60] text-xs font-medium">Resolved</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="bg-[#f5f1ec] p-3 rounded-lg max-w-md">
                      <p className="text-[#111111]">Hi team! We need to add 5 new team members to our workspace before next week.</p>
                    </div>

                    <div className="bg-[#ff5600]/10 border border-[#ff5600]/20 p-3 rounded-lg max-w-md ml-auto text-[#111111]">
                      <div className="flex items-center gap-1.5 mb-1 text-[#ff5600] font-semibold text-[11px]">
                        <Bot className="w-3.5 h-3.5" /> Fin AI Assistant
                      </div>
                      <p>I can help with that right away! You can navigate to **Settings &gt; Team Seats** and click **Add Seats**. Would you like me to process the pro-rated update automatically?</p>
                    </div>

                    <div className="bg-[#f5f1ec] p-3 rounded-lg max-w-md">
                      <p className="text-[#111111]">Yes please! That was super fast, thank you Fin!</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#e5e0d8] flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Reply or type '/' for AI snippets..." 
                    className="flex-1 text-xs bg-[#faf8f5] border border-[#d3cec6] rounded-md px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                    readOnly
                  />
                  <button className="ic-btn-primary py-2 px-3 text-xs">
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fin' && (
            <div className="bg-[#faf8f5] p-6 rounded-lg border border-[#e5e0d8] min-h-[380px] flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 bg-[#ff5600] rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#111111] mb-2">Fin AI Agent Studio</h3>
              <p className="text-xs text-[#626260] max-w-md mb-6">
                Connected to 142 Knowledge Base articles &amp; Zendesk Docs. Instant resolution rate: 58.4%.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl w-full text-left">
                <div className="bg-white p-3 rounded-md border border-[#e5e0d8]">
                  <div className="text-[11px] text-[#7b7b78] uppercase mb-1 font-medium">Resolution Rate</div>
                  <div className="text-lg font-bold text-[#111111]">58.4%</div>
                  <div className="text-[11px] text-[#27ae60] font-medium">+4.2% this week</div>
                </div>
                <div className="bg-white p-3 rounded-md border border-[#e5e0d8]">
                  <div className="text-[11px] text-[#7b7b78] uppercase mb-1 font-medium">Avg Response Time</div>
                  <div className="text-lg font-bold text-[#111111]">0.8 sec</div>
                  <div className="text-[11px] text-[#27ae60] font-medium">Instant AI response</div>
                </div>
                <div className="bg-white p-3 rounded-md border border-[#e5e0d8]">
                  <div className="text-[11px] text-[#7b7b78] uppercase mb-1 font-medium">CSAT Score</div>
                  <div className="text-lg font-bold text-[#111111]">4.9 / 5.0</div>
                  <div className="text-[11px] text-[#626260]">Based on 1,420 ratings</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-[#faf8f5] p-6 rounded-lg border border-[#e5e0d8] min-h-[380px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-[#111111]">Customer Support Overview</h4>
                  <p className="text-xs text-[#7b7b78]">Real-time operational metrics</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27ae60] animate-pulse"></span>
                  <span className="text-xs font-medium text-[#626260]">Live Updates</span>
                </div>
              </div>

              {/* In-Product Report Palette Charts */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-white p-3 rounded-md border border-[#e5e0d8]">
                  <span className="text-[11px] text-[#7b7b78]">Total Conversations</span>
                  <div className="text-base font-bold text-[#111111] mt-1">12,480</div>
                  <div className="w-full bg-[#e5e0d8] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#2f80ed] h-full w-[75%]"></div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-md border border-[#e5e0d8]">
                  <span className="text-[11px] text-[#7b7b78]">Fin AI Handled</span>
                  <div className="text-base font-bold text-[#ff5600] mt-1">7,290</div>
                  <div className="w-full bg-[#e5e0d8] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#ff5600] h-full w-[58%]"></div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-md border border-[#e5e0d8]">
                  <span className="text-[11px] text-[#7b7b78]">Human Escalation</span>
                  <div className="text-base font-bold text-[#111111] mt-1">5,190</div>
                  <div className="w-full bg-[#e5e0d8] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#eb5757] h-full w-[42%]"></div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-md border border-[#e5e0d8]">
                  <span className="text-[11px] text-[#7b7b78]">CSAT Index</span>
                  <div className="text-base font-bold text-[#27ae60] mt-1">96.8%</div>
                  <div className="w-full bg-[#e5e0d8] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#27ae60] h-full w-[96%]"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md border border-[#e5e0d8] h-32 flex items-end justify-between px-6 pb-2">
                <div className="w-8 bg-[#2f80ed]/20 hover:bg-[#2f80ed] transition-colors rounded-t h-[40%]"></div>
                <div className="w-8 bg-[#2f80ed]/20 hover:bg-[#2f80ed] transition-colors rounded-t h-[65%]"></div>
                <div className="w-8 bg-[#2f80ed]/20 hover:bg-[#2f80ed] transition-colors rounded-t h-[50%]"></div>
                <div className="w-8 bg-[#ff5600] rounded-t h-[90%]"></div>
                <div className="w-8 bg-[#2f80ed]/20 hover:bg-[#2f80ed] transition-colors rounded-t h-[70%]"></div>
                <div className="w-8 bg-[#2f80ed]/20 hover:bg-[#2f80ed] transition-colors rounded-t h-[85%]"></div>
                <div className="w-8 bg-[#2f80ed]/20 hover:bg-[#2f80ed] transition-colors rounded-t h-[60%]"></div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Customer Marquee */}
      <section className="py-12 border-y border-[#d3cec6]/60">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-[#7b7b78] uppercase tracking-wider mb-8">
            Trusted by over 25,000 global businesses
          </p>
          <div className="flex flex-wrap items-center justify-between gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            <span className="font-extrabold text-xl tracking-tight text-[#111111]">NOTION</span>
            <span className="font-extrabold text-xl tracking-tight text-[#111111]">ANTRHOPIC</span>
            <span className="font-extrabold text-xl tracking-tight text-[#111111]">CANVA</span>
            <span className="font-extrabold text-xl tracking-tight text-[#111111]">ATLASSIAN</span>
            <span className="font-extrabold text-xl tracking-tight text-[#111111]">AMAZON</span>
            <span className="font-extrabold text-xl tracking-tight text-[#111111]">LINEAR</span>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-[#ff5600] uppercase tracking-wider mb-2 block">Designed for Scale</span>
          <h2 className="ic-display-lg mb-4 text-[#111111]">Everything you need to deliver world-class support</h2>
          <p className="text-lg text-[#626260]">
            Combining human expertise with breakthrough AI capabilities inside a unified workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="ic-pricing-card">
            <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center mb-6">
              <Bot className="w-5 h-5 text-[#ff5600]" />
            </div>
            <h3 className="ic-card-title mb-2 text-[#111111]">Fin AI Agent</h3>
            <p className="text-sm text-[#626260] leading-relaxed mb-4">
              Autonomous AI agent that answers complex questions instantly with zero training required.
            </p>
            <span className="text-xs font-semibold text-[#111111] flex items-center gap-1 cursor-pointer hover:text-[#ff5600]">
              Learn about Fin <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="ic-pricing-card">
            <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center mb-6">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="ic-card-title mb-2 text-[#111111]">Omnichannel Inbox</h3>
            <p className="text-sm text-[#626260] leading-relaxed mb-4">
              Manage email, live chat, WhatsApp, and social tickets in a single lightning-fast inbox.
            </p>
            <span className="text-xs font-semibold text-[#111111] flex items-center gap-1 cursor-pointer hover:text-[#ff5600]">
              Explore Inbox <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="ic-pricing-card">
            <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center mb-6">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="ic-card-title mb-2 text-[#111111]">Proactive Support</h3>
            <p className="text-sm text-[#626260] leading-relaxed mb-4">
              Outbound messaging, product tours, and in-app banners to solve issues before users ask.
            </p>
            <span className="text-xs font-semibold text-[#111111] flex items-center gap-1 cursor-pointer hover:text-[#ff5600]">
              See Proactive Features <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto border-t border-[#d3cec6]/60">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="ic-display-lg mb-4 text-[#111111]">Simple, predictable pricing</h2>
          <p className="text-lg text-[#626260] mb-8">
            Choose the plan that fits your support volume and team growth.
          </p>

          {/* Pricing Toggle Pill */}
          <div className="inline-flex items-center p-1 bg-[#eee9e0] rounded-full border border-[#d3cec6]">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 text-xs font-medium rounded-full transition-all ${billingCycle === 'monthly' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#626260]'}`}
            >
              Monthly Billing
            </button>
            <button 
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 text-xs font-medium rounded-full transition-all flex items-center gap-1.5 ${billingCycle === 'annual' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#626260]'}`}
            >
              <span>Annual Billing</span>
              <span className="bg-[#27ae60] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Essential Tier */}
          <div className="ic-pricing-card flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#7b7b78] uppercase tracking-wider">Essential</span>
              <h3 className="ic-card-title mt-2 mb-1 text-[#111111]">Essential Support</h3>
              <p className="text-xs text-[#626260] mb-6">For small teams getting started with support.</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#111111]">${billingCycle === 'annual' ? '39' : '49'}</span>
                <span className="text-xs text-[#7b7b78]"> / seat / month</span>
              </div>

              <ul className="space-y-3 text-xs text-[#626260] mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#27ae60]" /> Shared Team Inbox
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#27ae60]" /> Basic Live Chat Widget
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#27ae60]" /> 50 AI Resolutions / mo included
                </li>
              </ul>
            </div>

            <button className="ic-btn-secondary w-full">
              Start Free Trial
            </button>
          </div>

          {/* Advanced Tier - Featured */}
          <div className="ic-pricing-card-featured flex flex-col justify-between relative border-2 border-[#ff5600]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff5600] text-white text-[11px] font-semibold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#ff5600] uppercase tracking-wider">Advanced</span>
                <span className="ic-fin-badge">Includes Fin AI 2.0</span>
              </div>
              <h3 className="ic-card-title mt-2 mb-1 text-white">Advanced AI Suite</h3>
              <p className="text-xs text-[#9c9fa5] mb-6">Complete AI automation for growing support teams.</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${billingCycle === 'annual' ? '99' : '119'}</span>
                <span className="text-xs text-[#9c9fa5]"> / seat / month</span>
              </div>

              <ul className="space-y-3 text-xs text-[#e5e0d8] mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#ff5600]" /> Everything in Essential
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#ff5600]" /> Unlimited Fin AI Resolutions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#ff5600]" /> Custom Workflows &amp; Routing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#ff5600]" /> Real-time Analytics Dashboard
                </li>
              </ul>
            </div>

            <button className="ic-btn-fin w-full">
              Get Started with Fin AI
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="ic-pricing-card flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#7b7b78] uppercase tracking-wider">Enterprise</span>
              <h3 className="ic-card-title mt-2 mb-1 text-[#111111]">Enterprise Control</h3>
              <p className="text-xs text-[#626260] mb-6">Advanced security, custom SLA, and dedicated manager.</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#111111]">Custom</span>
              </div>

              <ul className="space-y-3 text-xs text-[#626260] mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#27ae60]" /> Custom AI Training Models
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#27ae60]" /> Dedicated Success Manager
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#27ae60]" /> HIPAA &amp; SOC2 Compliance
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#27ae60]" /> 99.99% Uptime SLA Guarantee
                </li>
              </ul>
            </div>

            <button className="ic-btn-secondary w-full">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Testimonial Strip - Inverse Black Ground */}
      <section className="bg-[#000000] text-white py-20 px-6 my-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-medium leading-snug mb-8">
            “Fin AI resolved over 62% of our inbound customer requests within the first two weeks. Our support team can now focus entirely on high-touch enterprise accounts.”
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#ff5600] flex items-center justify-center font-bold text-white text-sm">
              RM
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold">Rachel Miller</div>
              <div className="text-xs text-[#9c9fa5]">VP of Customer Experience at Notion</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="bg-white border border-[#d3cec6] rounded-2xl p-10 md:p-14 text-center shadow-sm">
          <h2 className="ic-display-lg mb-4 text-[#111111]">Ready to transform your support?</h2>
          <p className="text-lg text-[#626260] max-w-xl mx-auto mb-8">
            Start your 14-day free trial today. No credit card required. Setup takes under 5 minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="ic-btn-primary px-8 py-3.5 text-base">
              Start Free Trial
            </button>
            <button className="ic-btn-secondary px-8 py-3.5 text-base">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 pb-8 px-6 border-t border-[#d3cec6]/60 text-xs text-[#7b7b78] max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div>
            <h5 className="font-semibold text-[#111111] mb-3">Products</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#111111]">Fin AI Agent</a></li>
              <li><a href="#" className="hover:text-[#111111]">Helpdesk Inbox</a></li>
              <li><a href="#" className="hover:text-[#111111]">Proactive Messaging</a></li>
              <li><a href="#" className="hover:text-[#111111]">Custom Bots</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-[#111111] mb-3">Solutions</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#111111]">For Startups</a></li>
              <li><a href="#" className="hover:text-[#111111]">For Enterprise</a></li>
              <li><a href="#" className="hover:text-[#111111]">For E-commerce</a></li>
              <li><a href="#" className="hover:text-[#111111]">For SaaS</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-[#111111] mb-3">Resources</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#111111]">Intercom Blog</a></li>
              <li><a href="#" className="hover:text-[#111111]">Customer Stories</a></li>
              <li><a href="#" className="hover:text-[#111111]">Help Center</a></li>
              <li><a href="#" className="hover:text-[#111111]">API Documentation</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-[#111111] mb-3">Company</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#111111]">About Us</a></li>
              <li><a href="#" className="hover:text-[#111111]">Careers</a></li>
              <li><a href="#" className="hover:text-[#111111]">Press</a></li>
              <li><a href="#" className="hover:text-[#111111]">Security</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-[#111111] mb-3">Connect</h5>
            <p className="mb-3 text-[#626260]">Subscribe to our newsletter for product updates.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="you@company.com" 
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#d3cec6] rounded-md text-[#111111]"
              />
              <button className="ic-btn-primary py-1.5 px-3 text-xs">Join</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#e5e0d8] gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#111111] rounded text-white flex items-center justify-center text-[10px] font-bold">ic</div>
            <span>© 2026 Intercom, Inc. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#111111]">Privacy Policy</a>
            <a href="#" className="hover:text-[#111111]">Terms of Service</a>
            <a href="#" className="hover:text-[#111111]">Security Standards</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
