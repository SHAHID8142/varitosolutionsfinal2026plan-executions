/**
 * @file address-form.tsx
 * @description Form component for collecting delivery address details.
 *              Includes District and Upazila (Thana) dropdowns.
 *              Optimized for mobile-first data entry.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { MapPin, Phone, User, Home as HomeIcon, Briefcase, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DISTRICTS = ["Chattogram", "Dhaka", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh"]
const THANAS: Record<string, string[]> = {
  "Chattogram": ["Kotwali", "Panchlaish", "Double Mooring", "Halishahar", "Pahartali", "Bakalia"],
  "Dhaka": ["Dhanmondi", "Gulshan", "Banani", "Mirpur", "Uttara", "Motijheel"],
}

export function AddressForm() {
  const [district, setDistrict] = React.useState<string>("")
  const [, setThana] = React.useState<string>("")

  return (
    <div className="flex flex-col gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="size-5 text-primary" />
        <h3 className="text-lg font-bold text-gray-900">Delivery Address</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input className="pl-10 h-11" placeholder="Enter your full name" />
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input className="pl-10 h-11" placeholder="01XXXXXXXXX" type="tel" />
          </div>
        </div>

        {/* District */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">District</label>
          <Select onValueChange={(val: string | null) => { setDistrict(val || ""); setThana(""); }}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              {DISTRICTS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Thana/Upazila */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Upazila / Thana</label>
          <Select disabled={!district} onValueChange={(val: string | null) => setThana(val || "")}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder={district ? "Select Thana" : "Choose District first"} />
            </SelectTrigger>
            <SelectContent>
              {(THANAS[district] || []).map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Area / Union */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Area / Union / Moholla</label>
          <Input className="h-11" placeholder="e.g. Nasirabad, GEC Circle" />
        </div>

        {/* Road / House */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Road / Street</label>
          <Input className="h-11" placeholder="e.g. Road 5, Block B" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">House / Flat / Shop No.</label>
          <Input className="h-11" placeholder="e.g. House 12, Flat 4A" />
        </div>

        {/* Landmark */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            Landmark <span className="font-normal text-[10px] opacity-70">(Optional)</span>
          </label>
          <div className="relative">
            <Info className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input className="pl-10 h-11" placeholder="e.g. Near Agrabad Mosque" />
          </div>
        </div>
      </div>

      {/* Address Label */}
      <div className="flex flex-col gap-3 mt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Address Label</label>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2 border-primary/20 bg-primary-50/50 text-primary">
            <HomeIcon className="size-4" /> Home
          </Button>
          <Button variant="ghost" className="flex-1 gap-2 bg-gray-50 border border-gray-100">
            <Briefcase className="size-4" /> Office
          </Button>
          <Button variant="ghost" className="flex-1 gap-2 bg-gray-50 border border-gray-100">
            Other
          </Button>
        </div>
      </div>

      <Button variant="primary" size="lg" className="w-full mt-4 shadow-lg shadow-primary/20">
        Save Address & Continue
      </Button>
    </div>
  )
}
