/**
 * @file page.tsx
 * @path /help
 * @description Help Center / FAQ page for Varito Solutions.
 *              Provides answers to common questions and support links.
 *              Refined with premium Emerald aesthetic and Jakarta typography.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  Search, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  RotateCcw, 
  User, 
  MessageCircle,
  Phone,
  HelpCircle,
  LifeBuoy
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────

const FAQ_CATEGORIES = [
  { id: "orders", icon: ShoppingBag, label: "Orders" },
  { id: "shipping", icon: Truck, label: "Shipping" },
  { id: "payment", icon: CreditCard, label: "Payment" },
  { id: "returns", icon: RotateCcw, label: "Returns" },
  { id: "account", icon: User, label: "Account" },
]

const FAQS = [
  {
    category: "orders",
    q: "How do I place an order?",
    a: "You can place an order by selecting the products you want, adding them to your cart, and proceeding to checkout. You can check out as a guest or create an account for faster future purchases."
  },
  {
    category: "orders",
    q: "Can I change my order after placing it?",
    a: "Once an order is confirmed, we begin processing it immediately. Please contact our support team via WhatsApp or Hotline within 1 hour of placement for any urgent changes."
  },
  {
    category: "shipping",
    q: "What are your delivery charges?",
    a: "Standard delivery inside Chattogram is ৳60. For delivery to other districts, the charge is ৳120. Bulk orders may have different shipping rates based on weight."
  },
  {
    category: "shipping",
    q: "How long will delivery take?",
    a: "Inside Chattogram, you can expect delivery within 24-48 hours. For other locations across Bangladesh, it typically takes 3-5 business days."
  },
  {
    category: "payment",
    q: "What payment methods do you accept?",
    a: "We accept Cash on Delivery (COD), bKash, Nagad, and all major Debit/Credit cards through our secure payment partner aamarPay."
  },
  {
    category: "returns",
    q: "How do I return a product?",
    a: "If your item is eligible for return (see our Returns Policy), please contact our support team. We will arrange a pickup for orders inside CTG or guide you on how to courier it back to us."
  }
]

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState("all")

  const filteredFaqs = FAQS.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/30">
      <Header />
      
      <main className="flex-1">
        
        {/* Immersive Support Hero */}
        <section className="relative pt-16 pb-32 bg-emerald-950 text-white overflow-hidden">
          {/* Abstract Background Elements */}
          <div className="absolute top-0 right-0 size-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 size-[400px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <Breadcrumb
              items={[{ label: "Help Center" }]}
              className="mb-8 justify-center [&_*]:text-primary/20/40"
            />
            
            <div className="flex flex-col items-center gap-6 mb-12">
              <div className="size-16 rounded-[24px] bg-primary/20 backdrop-blur-xl border border-primary/20 flex items-center justify-center text-primary/60">
                <LifeBuoy className="size-8" />
              </div>
              <h1 className="text-4xl md:text-7xl font-black tracking-tight uppercase leading-none">
                How can we <span className="text-primary/60">help you?</span>
              </h1>
              <p className="text-primary/20/60 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Find answers, track orders, or get in touch with our premium support team.
              </p>
            </div>
            
            {/* Premium Floating Search Bar */}
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute -inset-1 bg-primary/20 rounded-[28px] blur-xl opacity-50 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-white rounded-[24px] shadow-2xl overflow-hidden border border-white/10">
                <div className="pl-6 text-gray-400">
                  <Search className="size-6" />
                </div>
                <input
                  type="text"
                  placeholder="Search bKash, delivery times, return window..."
                  className="w-full h-20 px-4 bg-transparent text-gray-900 font-bold text-lg outline-none placeholder:text-gray-400 placeholder:font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="pr-4 hidden md:block">
                  <Button className="h-12 px-8 rounded-2xl font-black">Search</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Navigation (Floating Style) */}
        <div className="container mx-auto px-4 -mt-16 relative z-20 mb-20">
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-4">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-[32px] border transition-all duration-300 flex-1 min-w-[140px] max-w-[200px] group",
                activeCategory === "all" 
                  ? 'bg-primary border-primary text-white shadow-[0_20px_50px_rgba(16,185,129,0.3)]' 
                  : 'bg-white/80 backdrop-blur-md border-gray-100 text-gray-600 hover:bg-white hover:shadow-xl hover:-translate-y-1'
              )}
            >
              <div className={cn(
                "size-12 rounded-[18px] flex items-center justify-center transition-colors",
                activeCategory === "all" ? 'bg-white/20' : 'bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white'
              )}>
                <HelpCircle className="size-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">All Topics</span>
            </button>

            {FAQ_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-[32px] border transition-all duration-300 flex-1 min-w-[140px] max-w-[200px] group",
                    isActive 
                      ? 'bg-primary border-primary text-white shadow-[0_20px_50px_rgba(16,185,129,0.3)]' 
                      : 'bg-white/80 backdrop-blur-md border-gray-100 text-gray-600 hover:bg-white hover:shadow-xl hover:-translate-y-1'
                  )}
                >
                  <div className={cn(
                    "size-12 rounded-[18px] flex items-center justify-center transition-colors",
                    isActive ? 'bg-white/20' : 'bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white'
                  )}>
                    <Icon className="size-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em]">{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* FAQs Display Section */}
        <section className="py-12 pb-32">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-col gap-12">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
                    {activeCategory === "all" ? "Common Questions" : FAQ_CATEGORIES.find(c => c.id === activeCategory)?.label}
                  </h2>
                  <div className="h-1.5 w-24 bg-primary rounded-full" />
                </div>
                <Badge variant="secondary" className="w-fit bg-primary/5 text-primary border-primary/20 font-bold px-4 py-1.5 rounded-full">
                  {filteredFaqs.length} SEARCH RESULTS
                </Badge>
              </div>

              {filteredFaqs.length > 0 ? (
                <Accordion className="w-full flex flex-col gap-5">
                  {filteredFaqs.map((faq, i) => (
                    <AccordionItem 
                      key={i} 
                      value={`item-${i}`} 
                      className="bg-white border border-gray-100 rounded-[24px] px-8 overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all group data-[state=open]:border-primary data-[state=open]:ring-4 data-[state=open]:ring-primary/100/5"
                    >
                      <AccordionTrigger className="py-8 text-lg font-black text-gray-900 hover:no-underline group-hover:text-primary transition-colors">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-8 text-gray-600 font-medium text-base leading-relaxed border-t border-gray-50 pt-6">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-6">
                  <div className="size-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                    <Search className="size-10" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-black text-gray-900 uppercase tracking-tight">No results found</p>
                    <p className="text-gray-500 font-medium">Try different keywords or browse by category above.</p>
                  </div>
                  <Button variant="outline" onClick={() => {setSearchQuery(""); setActiveCategory("all")}} className="rounded-xl font-bold">Clear All Filters</Button>
                </div>
              )}

              {/* Direct Support Contact Refined */}
              <div className="mt-20 relative">
                <div className="absolute inset-0 bg-primary rounded-[48px] blur-3xl opacity-10" />
                <div className="relative bg-emerald-950 rounded-[48px] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden shadow-2xl">
                  {/* Decor */}
                  <div className="absolute top-0 right-0 size-80 bg-primary/5 rounded-full translate-x-1/4 -translate-y-1/4" />
                  
                  <div className="flex flex-col gap-6 text-center lg:text-left max-w-xl">
                    <Badge className="w-fit bg-primary text-white font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] text-[10px] mx-auto lg:mx-0">
                      Still Stuck?
                    </Badge>
                    <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
                      Our support team <br />is <span className="text-primary/60 font-black italic">online now.</span>
                    </h3>
                    <p className="text-primary/20/60 text-lg font-medium leading-relaxed">
                      Don&apos;t spend time searching. Talk to a real person from Varito Solutions and get your issue resolved in minutes.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 w-full sm:w-auto">
                    <Button size="lg" className="h-20 px-10 rounded-[20px] gap-4 font-black text-lg bg-primary hover:bg-primary/90 shadow-[0_15px_40px_rgba(16,185,129,0.3)] transition-all active:scale-95">
                      <MessageCircle className="size-7" /> WhatsApp Us
                    </Button>
                    <Button variant="ghost" size="lg" className="h-20 px-10 rounded-[20px] gap-4 font-black text-lg text-white border-2 border-white/10 hover:bg-white/5 transition-all">
                      <Phone className="size-7" /> Call Hotline
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
