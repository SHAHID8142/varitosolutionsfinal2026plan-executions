/**
 * @file address-form.tsx
 * @description Controlled delivery address form for the checkout flow.
 *              Exposes address data to the parent via onChange.
 *              Includes District and Thana dropdowns with Bangladesh data.
 *
 * @owner    Gemini Design Agent / Claude Backend Agent
 * @updated  2026-05-24
 */

"use client"

import * as React from "react"
import { MapPin, Phone, User, Home as HomeIcon, Briefcase, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const DISTRICTS = [
  "Chattogram", "Dhaka", "Sylhet", "Rajshahi", "Khulna",
  "Barishal", "Rangpur", "Mymensingh", "Comilla", "Narayanganj",
  "Gazipur", "Narsingdi", "Munshiganj", "Manikganj", "Tangail",
]

const THANAS: Record<string, string[]> = {
  "Chattogram": ["Kotwali", "Panchlaish", "Double Mooring", "Halishahar", "Pahartali", "Bakalia", "Chandgaon", "Bayezid", "Akbar Shah", "EPZ"],
  "Dhaka": ["Dhanmondi", "Gulshan", "Banani", "Mirpur", "Uttara", "Motijheel", "Mohammadpur", "Rampura", "Badda", "Khilgaon"],
  "Sylhet": ["Sylhet Sadar", "Beanibazar", "Companiganj", "Golapganj", "Gowainghat", "Jaintiapur"],
  "Rajshahi": ["Boalia", "Matihar", "Rajpara", "Shah Makhdum", "Paba"],
  "Khulna": ["Sonadanga", "Khalishpur", "Khan Jahan Ali", "Daulatpur"],
  "Barishal": ["Barisal Sadar", "Bakerganj", "Muladi", "Babuganj"],
  "Rangpur": ["Rangpur Sadar", "Gangachara", "Kaunia", "Pirganj"],
  "Mymensingh": ["Mymensingh Sadar", "Trishal", "Bhaluka", "Muktagacha"],
}

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface AddressData {
  name: string
  phone: string
  district: string
  thana: string
  area: string
  road: string
  house: string
  landmark: string
}

interface AddressFormProps {
  value: AddressData
  onChange: (data: AddressData) => void
  errors?: Partial<Record<keyof AddressData, string>>
  className?: string
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/**
 * Controlled delivery address form.
 * Parent owns the form state via value/onChange props.
 * Thana dropdown is disabled until a district is selected.
 */
export function AddressForm({ value, onChange, errors, className }: AddressFormProps) {
  const set = (field: keyof AddressData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [field]: e.target.value })

  const setSelect = (field: keyof AddressData) => (v: string | null) => {
    const update = { ...value, [field]: v ?? "" }
    if (field === "district") update.thana = ""
    onChange(update)
  }

  const [label, setLabel] = React.useState<"home" | "office" | "other">("home")

  return (
    <div className={cn("flex flex-col gap-6 bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-sm", className)}>
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="size-5 text-primary" aria-hidden="true" />
        <h3 className="text-lg font-bold text-gray-900">Delivery Address</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="addr-full-name" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Full Name <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" aria-hidden="true" />
            <Input
              id="addr-full-name"
              className={cn("pl-10 h-11", errors?.name && "border-red-300")}
              placeholder="Enter your full name"
              autoComplete="name"
              value={value.name}
              onChange={set("name")}
            />
          </div>
          {errors?.name && <p className="text-xs text-red-500 font-medium px-1">{errors.name}</p>}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label htmlFor="addr-phone" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" aria-hidden="true" />
            <Input
              id="addr-phone"
              className={cn("pl-10 h-11", errors?.phone && "border-red-300")}
              placeholder="01XXXXXXXXX"
              type="tel"
              autoComplete="tel"
              value={value.phone}
              onChange={set("phone")}
            />
          </div>
          {errors?.phone && <p className="text-xs text-red-500 font-medium px-1">{errors.phone}</p>}
        </div>

        {/* District */}
        <div className="flex flex-col gap-2">
          <label htmlFor="addr-district" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            District <span className="text-red-400">*</span>
          </label>
          <Select value={value.district || undefined} onValueChange={setSelect("district")}>
            <SelectTrigger id="addr-district" className={cn("h-11", errors?.district && "border-red-300")}>
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              {DISTRICTS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.district && <p className="text-xs text-red-500 font-medium px-1">{errors.district}</p>}
        </div>

        {/* Thana/Upazila */}
        <div className="flex flex-col gap-2">
          <label htmlFor="addr-thana" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Upazila / Thana <span className="text-red-400">*</span>
          </label>
          <Select
            disabled={!value.district}
            value={value.thana || undefined}
            onValueChange={setSelect("thana")}
          >
            <SelectTrigger id="addr-thana" className={cn("h-11", errors?.thana && "border-red-300")}>
              <SelectValue placeholder={value.district ? "Select Thana" : "Choose District first"} />
            </SelectTrigger>
            <SelectContent>
              {(THANAS[value.district] ?? []).map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.thana && <p className="text-xs text-red-500 font-medium px-1">{errors.thana}</p>}
        </div>

        {/* Area */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="addr-area" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Area / Union / Moholla <span className="text-red-400">*</span>
          </label>
          <Input
            id="addr-area"
            className={cn("h-11", errors?.area && "border-red-300")}
            placeholder="e.g. Nasirabad, GEC Circle"
            value={value.area}
            onChange={set("area")}
          />
          {errors?.area && <p className="text-xs text-red-500 font-medium px-1">{errors.area}</p>}
        </div>

        {/* Road */}
        <div className="flex flex-col gap-2">
          <label htmlFor="addr-road" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Road / Street
          </label>
          <Input
            id="addr-road"
            className="h-11"
            placeholder="e.g. Road 5, Block B"
            value={value.road}
            onChange={set("road")}
          />
        </div>

        {/* House */}
        <div className="flex flex-col gap-2">
          <label htmlFor="addr-house" className="text-xs font-bold uppercase tracking-wider text-gray-400">
            House / Flat / Shop No.
          </label>
          <Input
            id="addr-house"
            className="h-11"
            placeholder="e.g. House 12, Flat 4A"
            value={value.house}
            onChange={set("house")}
          />
        </div>

        {/* Landmark */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="addr-landmark" className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            Landmark <span className="font-normal text-[10px] opacity-70">(Optional)</span>
          </label>
          <div className="relative">
            <Info className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" aria-hidden="true" />
            <Input
              id="addr-landmark"
              className="pl-10 h-11"
              placeholder="e.g. Near Agrabad Mosque"
              value={value.landmark}
              onChange={set("landmark")}
            />
          </div>
        </div>
      </div>

      {/* Address Label */}
      <div className="flex flex-col gap-3 mt-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Address Label</span>
        <div className="flex gap-3">
          <Button
            variant={label === "home" ? "primary" : "outline"}
            className={cn("flex-1 gap-2", label === "home" && "border-primary/20 bg-primary/5 text-primary")}
            type="button"
            onClick={() => setLabel("home")}
          >
            <HomeIcon className="size-4" /> Home
          </Button>
          <Button
            variant={label === "office" ? "primary" : "ghost"}
            className={cn("flex-1 gap-2 bg-gray-50 border border-[var(--color-border)]")}
            type="button"
            onClick={() => setLabel("office")}
          >
            <Briefcase className="size-4" /> Office
          </Button>
          <Button
            variant={label === "other" ? "primary" : "ghost"}
            className={cn("flex-1 gap-2 bg-gray-50 border border-[var(--color-border)]")}
            type="button"
            onClick={() => setLabel("other")}
          >
            Other
          </Button>
        </div>
      </div>
    </div>
  )
}
