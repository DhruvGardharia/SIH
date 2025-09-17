import { useState } from "react"
import { GraduationCap, Plus, Trash2, School, Calendar, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import GlassContainer from "@/components/glass-container"

export default function EducationDetails({ formData, setFormData, onNext, onBack, isEditing }) {
  const [education, setEducation] = useState(
    formData.education && formData.education.length > 0
      ? formData.education
      : [{ level: "", degree: "", college: "", yearOfStudy: "", cgpa: 0 }]
  )

  const handleInputChange = (index, field, value) => {
    const updatedEducation = [...education]
    updatedEducation[index] = { ...updatedEducation[index], [field]: value }
    setEducation(updatedEducation)
    setFormData({ ...formData, education: updatedEducation })
  }

  const addEducation = () => {
    const newEducation = { level: "", degree: "", college: "", yearOfStudy: "", cgpa: 0 }
    const updatedEducation = [...education, newEducation]
    setEducation(updatedEducation)
    setFormData({ ...formData, education: updatedEducation })
  }

  const removeEducation = (index) => {
    if (education.length > 1) {
      const updatedEducation = education.filter((_, i) => i !== index)
      setEducation(updatedEducation)
      setFormData({ ...formData, education: updatedEducation })
    }
  }

  const isFormValid = education.every(
    (edu) => edu.level && edu.degree && edu.college && edu.yearOfStudy && edu.cgpa
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-[family-name:var(--font-merriweather)]">
            Education Details
          </h1>
          <p className="text-lg text-muted-foreground font-[family-name:var(--font-roboto)]">
            Tell us about your educational background
          </p>
        </div>

        {/* Education Entries */}
        <div className="space-y-6 mb-8">
          {education.map((edu, index) => (
            <GlassContainer key={index} variant="card" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <GraduationCap size={20} className="text-primary" />
                  Education {index + 1}
                </h3>
                {education.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Education Level */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Award size={16} className="text-primary" />
                    Education Level *
                  </Label>
                  <Select
                    value={edu.level}
                    onValueChange={(value) => handleInputChange(index, "level", value)}
                  >
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="glass-strong">
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="ug">Undergraduate (UG)</SelectItem>
                      <SelectItem value="pg">Postgraduate (PG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Degree Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Degree Name *</Label>
                  <Input
                    type="text"
                    placeholder="e.g., B.Tech Computer Science"
                    value={edu.degree}
                    onChange={(e) => handleInputChange(index, "degree", e.target.value)}
                    className="glass-input"
                  />
                </div>

                {/* College Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <School size={16} className="text-primary" />
                    College Name *
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter college/university name"
                    value={edu.college}
                    onChange={(e) => handleInputChange(index, "college", e.target.value)}
                    className="glass-input"
                  />
                </div>

                {/* Year of Study */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    Year of Study *
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g., 2024 or 2022-2026"
                    value={edu.yearOfStudy}
                    onChange={(e) => handleInputChange(index, "yearOfStudy", e.target.value)}
                    className="glass-input"
                  />
                </div>

                {/* CGPA */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium">CGPA *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="Enter CGPA (0.0 - 10.0)"
                    value={edu.cgpa || ""}
                    onChange={(e) =>
                      handleInputChange(index, "cgpa", parseFloat(e.target.value) || 0)
                    }
                    className="glass-input max-w-xs"
                  />
                </div>
              </div>
            </GlassContainer>
          ))}
        </div>

        {/* Add Another Education */}
        <div className="text-center mb-8">
          <Button
            variant="outline"
            onClick={addEducation}
            className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Plus size={16} className="mr-2" />
            Add Another Education
          </Button>
        </div>

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
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <div className="w-3 h-3 rounded-full bg-muted"></div>
          </div>
          <p className="text-sm text-muted-foreground">Step 4 of 6</p>
        </div>
      </div>
    </div>
  )
}
