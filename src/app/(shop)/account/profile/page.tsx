/**
 * @file page.tsx
 * @path /account/profile
 * @description Customer profile page. Allows users to manage personal info
 *              and saved delivery addresses.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { 
  User, 
  Settings, 
  ShoppingBag, 
  LogOut, 
  Edit2, 
  Plus,
  ArrowLeft,
  LucideIcon,
  Check,
  X
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// PAGE COMPONENTS
// ─────────────────────────────────────────────

function SidebarLink({ href, icon: Icon, label, active }: { href: string, icon: LucideIcon, label: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
    >
      <Icon className="size-5" />
      <span className="text-sm uppercase tracking-wider">{label}</span>
    </Link>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function ProfilePage() {
  const [isEditingProfile, setIsEditingProfile] = React.useState(false)
  const [userData, setUserData] = React.useState({
    name: "Rahat Chowdhury",
    phone: "+880 1814-214220",
    email: "rahat@example.com"
  })

  const handleSaveProfile = () => {
    setIsEditingProfile(false)
    toast.success("Profile information updated successfully!")
  }

  const handleUpdatePassword = () => {
    toast.info("Password update feature coming soon. Please check your email for instructions.")
  }

  const handleEditAddress = (type: string) => {
    toast.info(`Editing ${type} address...`)
  }

  const handleAddAddress = () => {
    toast.info("Add new address feature coming soon.")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="flex flex-col gap-6 mb-10">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors w-fit"
            >
              <ArrowLeft className="size-4" /> Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase px-1">My Account</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT: Account Sidebar */}
            <aside className="lg:col-span-3 flex flex-col gap-2 sticky top-32">
              <SidebarLink href="/account/profile" icon={User} label="Profile" active />
              <SidebarLink href="/account/orders" icon={ShoppingBag} label="My Orders" />
              <SidebarLink href="/account/settings" icon={Settings} label="Settings" />
              <div className="h-px bg-gray-100 my-4" />
              <Button variant="ghost" className="justify-start gap-3 px-4 text-danger-500 hover:bg-danger-50 hover:text-danger-600 font-bold uppercase tracking-wider">
                <LogOut className="size-5" /> Logout
              </Button>
            </aside>

            {/* RIGHT: Content Area */}
            <div className="lg:col-span-9 flex flex-col gap-8 pb-20">
              
              {/* Personal Information */}
              <section className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Personal Information</h2>
                  {!isEditingProfile ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 text-primary font-bold"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <Edit2 className="size-4" /> Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2 text-gray-400 font-bold"
                        onClick={() => setIsEditingProfile(false)}
                      >
                        <X className="size-4" /> Cancel
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="gap-2 font-bold px-4"
                        onClick={handleSaveProfile}
                      >
                        <Check className="size-4" /> Save
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Full Name</label>
                    <Input 
                      disabled={!isEditingProfile} 
                      value={userData.name} 
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className={cn("h-12 bg-gray-50/50 border-gray-100", isEditingProfile && "bg-white border-primary/20 ring-4 ring-primary/5")} 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Phone Number</label>
                    <Input 
                      disabled={!isEditingProfile} 
                      value={userData.phone} 
                      onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      className={cn("h-12 bg-gray-50/50 border-gray-100", isEditingProfile && "bg-white border-primary/20 ring-4 ring-primary/5")} 
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Email Address</label>
                    <Input 
                      disabled={!isEditingProfile} 
                      value={userData.email} 
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className={cn("h-12 bg-gray-50/50 border-gray-100", isEditingProfile && "bg-white border-primary/20 ring-4 ring-primary/5")} 
                    />
                  </div>
                </div>
              </section>

              {/* Delivery Addresses */}
              <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Saved Addresses</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 font-bold border-primary/20 text-primary bg-white"
                    onClick={handleAddAddress}
                  >
                    <Plus className="size-4" /> Add New
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-primary ring-4 ring-primary/5 shadow-sm flex flex-col gap-4 relative">
                    <div className="flex items-center justify-between">
                      <Badge variant="verified" className="bg-primary/5 text-primary">Home</Badge>
                      <button 
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                        onClick={() => handleEditAddress("Home")}
                      >
                        <Edit2 className="size-4" />
                      </button>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-gray-900">Rahat Chowdhury</p>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        House 12, Flat 4A, Road 5, Block B, <br />
                        Nasirabad, Chattogram, 4000
                      </p>
                      <p className="text-sm text-gray-500 font-medium mt-2">+880 1814-214220</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-500">Office</Badge>
                      <button 
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                        onClick={() => handleEditAddress("Office")}
                      >
                        <Edit2 className="size-4" />
                      </button>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-gray-900">Rahat Chowdhury</p>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        123 Market Road, <br />
                        Khatunganj, Chattogram, 4200
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Password Security */}
              <section className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between gap-6">
                 <div className="flex flex-col gap-1">
                   <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight leading-none">Security</h3>
                   <p className="text-sm text-gray-500 font-medium">Update your password to keep your account safe.</p>
                 </div>
                 <Button 
                   variant="outline" 
                   className="font-bold border-gray-200"
                   onClick={handleUpdatePassword}
                 >
                   Update Password
                 </Button>
              </section>

            </div>
          </div>

        </div>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
