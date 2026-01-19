import { PropertyForm } from "@/components/admin/property-form"

export default function NewPropertyPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Add New Property</h1>
        <p className="text-[#6B6B6B] mt-1">Create a new property listing</p>
      </div>

      <PropertyForm />
    </div>
  )
}
