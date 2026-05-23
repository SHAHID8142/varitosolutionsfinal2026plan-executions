/**
 * @file address-form.tsx
 * @description Form component for collecting delivery address details.
 *              Includes District and Upazila (Thana) dropdowns.
 *              Optimized for mobile-first data entry.
 *              All inputs have associated labels via htmlFor/id for accessibility.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import { MapPin, Phone, User, Home as HomeIcon, Briefcase, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const DISTRICTS = ["Chattogram", "Dhaka", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh"]
const THANAS: Record<string, string[]> = {
  "Chattogram": ["Kotwali", "Panchlaish", "Double Mooring", "Halishahar", "Pahartali", "Bakalia"],
  "Dhaka": ["Dhanmondi", "Gulshan", "Banani", "Mirpur", "Uttara", "Motijheel"],
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/**
 * Delivery address form for the checkout flow.
 * All inputs have associated <label> elements via htmlFor/id for screen reader support.
 * Thana dropdown is disabled until a district is selected.
 */
export function AddressForm() {
  const [district, setDistrict] = React.useState<string>("")
  const [, setThana] = React.useState<string>("")

  return (
    <div className="flex flex-col gap-6 bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="size-5 text-primary" aria-hidden="true" />
        <h3 className="text-lg font-bold text-gray-900">Delivery Address</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="addr-full-name" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" aria-hidden="true" />
            <Input id="addr-full-name" className="pl-10 h-11" placeholder="Enter your full name" autoComplete="name" />
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label htmlFor="addr-phone" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" aria-hidden="true" />
            <Input id="addr-phone" className="pl-10 h-11" placeholder="01XXXXXXXXX" type="tel" autoComplete="tel" />
          </div>
        </div>

        {/* District */}
        <div className="flex flex-col gap-2">
          <label htmlFor="addr-district" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            District
          </label>
          <Select onValueChange={(val: string | null) => { setDistrict(val ?? ""); setThana("") }}>
            <SelectTrigger id="addr-district" className="h-11">
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              {DISTRICTS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Thana/Upazila — disabled until district is selected */}
        <div className="flex flex-col gap-2">
          <label htmlFor="addr-thana" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Upazila / Thana
          </label>
          <Select disabled={!district} onValueChange={(val: string | null) => setThana(val ?? "")}>
            <SelectTrigger id="addr-thana" className="h-11">
              <SelectValue placeholder={district ? "Select Thana" : "Choose District first"} />
            </SelectTrigger>
            <SelectContent>
              {(THANAS[district] ?? []).map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Area / Union */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="addr-area" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Area / Union / Moholla
          </label>
          <Input id="addr-area" className="h-11" placeholder="e.g. Nasirabad, GEC Circle" />
        </div>

        {/* Road */}
        <div className="flex flex-col gap-2">
          <label htmlFor="addr-road" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Road / Street
          </label>
          <Input id="addr-road" className="h-11" placeholder="e.g. Road 5, Block B" />
        </div>

        {/* House / Flat */}
        <div className="flex flex-col gap-2">
          <label htmlFor="addr-house" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            House / Flat / Shop No.
          </label>
          <Input id="addr-house" className="h-11" placeholder="e.g. House 12, Flat 4A" />
        </div>

        {/* Landmark */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="addr-landmark" className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            Landmark <span className="font-normal text-[10px] opacity-70">(Optional)</span>
          </label>
          <div className="relative">
            <Info className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" aria-hidden="true" />
            <Input id="addr-landmark" className="pl-10 h-11" placeholder="e.g. Near Agrabad Mosque" />
          </div>
        </div>
      </div>

      {/* Address Label — buttons for Home / Office / Other */}
      <div className="flex flex-col gap-3 mt-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Address Label</span>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2 border-primary/20 bg-primary/5 text-primary" type="button">
            <HomeIcon className="size-4" /> Home
          </Button>
          <Button variant="ghost" className="flex-1 gap-2 bg-gray-50 border border-[var(--color-border)]" type="button">
            <Briefcase className="size-4" /> Office
          </Button>
          <Button variant="ghost" className="flex-1 gap-2 bg-gray-50 border border-[var(--color-border)]" type="button">
            Other
          </Button>
        </div>
      </div>

      <Button
        onClick={() => toast.success("Address saved successfully! Proceeding to payment...")}
        variant="primary"
        size="lg"
        className="w-full mt-4 shadow-lg shadow-primary/20"
        type="button"
      >
        Save Address & Continue
      </Button>
    </div>
  )
}
