import { useState } from "react";
import { User, Mail, Phone, Calendar, Users } from "lucide-react";
import GlassContainer from "../glass-container";

// --- Real shadcn/ui component imports ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfileSetup({ formData, setFormData, onNext, onBack, isEditing }) {
  const [profile, setProfile] = useState(formData.profile);

  const handleInputChange = (field, value) => {
    const updatedProfile = { ...profile, [field]: value };
    setProfile(updatedProfile);
    setFormData({ ...formData, profile: updatedProfile });
  };

  const isFormValid = profile.fullName && profile.phone && profile.dateOfBirth && profile.gender;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-3xl md:text-4xl font-bold text-foreground mb-4" 
            style={{ fontFamily: 'var(--font-merriweather)' }}
          >
            Profile Setup
          </h1>
          <p 
            className="text-lg text-muted-foreground"
            style={{ fontFamily: 'var(--font-roboto)' }}
          >
            Let's get to know you better
          </p>
        </div>

        {/* Form */}
        <GlassContainer variant="card" className="p-8 mb-8">
          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                <User size={16} className="text-primary" />
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={profile.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                className="bg-muted/50 cursor-not-allowed w-full"
              />
              <p className="text-xs text-muted-foreground">Email is pre-filled and cannot be changed</p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={profile.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                Date of Birth *
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users size={16} className="text-primary" />
                Gender *
              </Label>
              <Select value={profile.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassContainer>

        {/* Navigation */}
        <div className="flex justify-between items-center">
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
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <div className="w-3 h-3 rounded-full bg-muted"></div>
          </div>
          <p className="text-sm text-muted-foreground">Step 3 of 6</p>
        </div>
      </div>
    </div>
  );
}
