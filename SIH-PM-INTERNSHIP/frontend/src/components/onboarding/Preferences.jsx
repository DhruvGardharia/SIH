import { useState } from "react"
import { MapPin, Building, Wifi, DollarSign, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import GlassContainer from "@/components/glass-container"

export default function Preferences({ formData, setFormData, onNext, onBack, isEditing }) {
  const [preferences, setPreferences] = useState(formData.preferences)

  const popularSectors = [
    "Technology", "Finance", "Healthcare", "Education", "Marketing", "Consulting",
    "Manufacturing", "Retail", "Media", "Government", "Non-Profit", "Startups",
  ]

  const popularLocations = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata",
    "Ahmedabad", "Gurgaon", "Noida", "Remote", "Any Location",
  ]

  const internshipTypes = [
    { id: "onsite", label: "Onsite", icon: Building },
    { id: "remote", label: "Remote", icon: Wifi },
    { id: "hybrid", label: "Hybrid", icon: Home },
  ]

  const handleSectorToggle = (sector) => {
    const updatedSectors = preferences.sectors.includes(sector)
      ? preferences.sectors.filter((s) => s !== sector)
      : [...preferences.sectors, sector]

    const updatedPreferences = { ...preferences, sectors: updatedSectors }
    setPreferences(updatedPreferences)
    setFormData({ ...formData, preferences: updatedPreferences })
  }

  const handleLocationToggle = (location) => {
    const updatedLocations = preferences.locations.includes(location)
      ? preferences.locations.filter((l) => l !== location)
      : [...preferences.locations, location]

    const updatedPreferences = { ...preferences, locations: updatedLocations }
    setPreferences(updatedPreferences)
    setFormData({ ...formData, preferences: updatedPreferences })
  }

  const handleTypeToggle = (type) => {
    const updatedTypes = preferences.types.includes(type)
      ? preferences.types.filter((t) => t !== type)
      : [...preferences.types, type]

    const updatedPreferences = { ...preferences, types: updatedTypes }
    setPreferences(updatedPreferences)
    setFormData({ ...formData, preferences: updatedPreferences })
  }

  const handleInputChange = (field, value) => {
    const updatedPreferences = { ...preferences, [field]: value }
    setPreferences(updatedPreferences)
    setFormData({ ...formData, preferences: updatedPreferences })
  }

  const isFormValid =
    preferences.sectors.length > 0 &&
    preferences.locations.length > 0 &&
    preferences.types.length > 0 &&
    preferences.regionType

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-[family-name:var(--font-merriweather)]">
            Your Preferences
          </h1>
          <p className="text-lg text-muted-foreground font-[family-name:var(--font-roboto)]">
            Help us find the perfect internship for you
          </p>
        </div>

        <div className="space-y-8">
          {/* Preferred Sectors */}
          <GlassContainer variant="card" className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Building size={20} className="text-primary" />
              Preferred Sectors *
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {popularSectors.map((sector) => (
                <Badge
                  key={sector}
                  variant={preferences.sectors.includes(sector) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    preferences.sectors.includes(sector)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary hover:text-primary-foreground"
                  }`}
                  onClick={() => handleSectorToggle(sector)}
                >
                  {sector}
                </Badge>
              ))}
            </div>
            {preferences.sectors.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Selected Sectors</Label>
                <div className="flex flex-wrap gap-2">
                  {preferences.sectors.map((sector) => (
                    <Badge key={sector} className="bg-secondary text-secondary-foreground">
                      {sector}
                      <button
                        onClick={() => handleSectorToggle(sector)}
                        className="ml-2 hover:text-destructive"
                        type="button"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </GlassContainer>

          {/* Preferred Locations */}
          <GlassContainer variant="card" className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              Preferred Locations *
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {popularLocations.map((location) => (
                <Badge
                  key={location}
                  variant={preferences.locations.includes(location) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    preferences.locations.includes(location)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary hover:text-primary-foreground"
                  }`}
                  onClick={() => handleLocationToggle(location)}
                >
                  {location}
                </Badge>
              ))}
            </div>
            {preferences.locations.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Selected Locations</Label>
                <div className="flex flex-wrap gap-2">
                  {preferences.locations.map((location) => (
                    <Badge key={location} className="bg-secondary text-secondary-foreground">
                      {location}
                      <button
                        onClick={() => handleLocationToggle(location)}
                        className="ml-2 hover:text-destructive"
                        type="button"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </GlassContainer>

          {/* Internship Types & Other Preferences */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Internship Types */}
            <GlassContainer variant="card" className="p-6">
              <h3 className="text-xl font-semibold mb-4">Internship Types *</h3>
              <div className="space-y-3">
                {internshipTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <div key={type.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={type.id}
                        checked={preferences.types.includes(type.id)}
                        onCheckedChange={() => handleTypeToggle(type.id)}
                        className="border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor={type.id} className="flex items-center gap-2 cursor-pointer">
                        <Icon size={16} className="text-primary" />
                        {type.label}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </GlassContainer>

            {/* Other Preferences */}
            <GlassContainer variant="card" className="p-6">
              <div className="space-y-6">
                {/* Expected Stipend */}
                <div>
                  <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <DollarSign size={16} className="text-primary" />
                    Expected Stipend
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g., ₹15,000/month or Unpaid"
                    value={preferences.stipend}
                    onChange={(e) => handleInputChange("stipend", e.target.value)}
                    className="glass-input"
                  />
                </div>

                {/* Region Type */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Region Type *</Label>
                  <Select
                    value={preferences.regionType}
                    onValueChange={(value) => handleInputChange("regionType", value)}
                  >
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select region type" />
                    </SelectTrigger>
                    <SelectContent className="glass-strong">
                      <SelectItem value="urban">Urban</SelectItem>
                      <SelectItem value="rural">Rural</SelectItem>
                      <SelectItem value="tribal">Tribal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </GlassContainer>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="outline" onClick={onBack} className="px-8 bg-transparent">
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!isFormValid}
            className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isEditing ? "Back to Review" : "Next"}
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
          </div>
          <p className="text-sm text-muted-foreground">Step 6 of 6</p>
        </div>
      </div>
    </div>
  )
}
