import { useState } from "react"
import { User, GraduationCap, Code, MapPin, FileText, Edit, CheckCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import GlassContainer from "@/components/glass-container"

export default function ReviewSubmit({ formData, onNext, onBack, onEdit }) {
  const [confirmed, setConfirmed] = useState(false)

  const handleSubmit = () => {
    if (confirmed) {
      onNext()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-[family-name:var(--font-merriweather)]">
            Review & Submit
          </h1>
          <p className="text-lg text-muted-foreground font-[family-name:var(--font-roboto)]">
            Please review your information before submitting
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {/* Profile Summary */}
          <GlassContainer variant="card" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <User size={20} className="text-primary" />
                Profile Information
              </h3>
              <Button variant="ghost" size="sm" onClick={() => onEdit(2)} className="text-primary hover:text-primary">
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span> {formData.profile.fullName || "Not provided"}
              </div>
              <div>
                <span className="font-medium">Email:</span> {formData.profile.email}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {formData.profile.phone || "Not provided"}
              </div>
              <div>
                <span className="font-medium">Date of Birth:</span> {formData.profile.dateOfBirth || "Not provided"}
              </div>
              <div>
                <span className="font-medium">Gender:</span>{" "}
                {formData.profile.gender
                  ? formData.profile.gender.charAt(0).toUpperCase() + formData.profile.gender.slice(1)
                  : "Not provided"}
              </div>
            </div>
          </GlassContainer>

          {/* Resume */}
          <GlassContainer variant="card" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                Resume
              </h3>
              {formData.onboardingChoice === "upload" && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(1)} className="text-primary hover:text-primary">
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
              )}
            </div>
            <div className="text-sm">
              {formData.resume ? (
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-secondary" />
                  <span>Resume uploaded: {formData.resume.name}</span>
                </div>
              ) : (
                <div className="text-muted-foreground">No resume uploaded (Manual entry selected)</div>
              )}
            </div>
          </GlassContainer>

          {/* Education */}
          <GlassContainer variant="card" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <GraduationCap size={20} className="text-primary" />
                Education ({formData.education.length})
              </h3>
              <Button variant="ghost" size="sm" onClick={() => onEdit(3)} className="text-primary hover:text-primary">
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
            </div>
            <div className="space-y-3">
              {formData.education.map((edu, index) => (
                <div key={index} className="border border-border/50 rounded-lg p-3 glass-subtle">
                  <div className="text-sm">
                    <div className="font-medium">
                      {edu.degree} - {edu.college}
                    </div>
                    <div className="text-muted-foreground">
                      {edu.level} • {edu.yearOfStudy} • CGPA: {edu.cgpa}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassContainer>

          {/* Skills & Experience */}
          <GlassContainer variant="card" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Code size={20} className="text-primary" />
                Skills & Experience
              </h3>
              <Button variant="ghost" size="sm" onClick={() => onEdit(4)} className="text-primary hover:text-primary">
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
            </div>
            <div className="space-y-4">
              {/* Skills */}
              <div>
                <span className="font-medium text-sm">Skills ({formData.skills.length}):</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              {formData.certifications.length > 0 && (
                <div>
                  <span className="font-medium text-sm">Certifications ({formData.certifications.length}):</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.certifications.map((cert) => (
                      <Badge key={cert} variant="outline">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {formData.projects.some((p) => p.title) && (
                <div>
                  <span className="font-medium text-sm">
                    Projects ({formData.projects.filter((p) => p.title).length}):
                  </span>
                  <div className="space-y-2 mt-2">
                    {formData.projects
                      .filter((p) => p.title)
                      .map((project, index) => (
                        <div key={index} className="text-sm border border-border/50 rounded p-2 glass-subtle">
                          <div className="font-medium">{project.title}</div>
                          <div className="text-muted-foreground text-xs">{project.description}</div>
                          {project.link && (
                            <div className="text-primary text-xs mt-1">
                              <a href={project.link} target="_blank" rel="noopener noreferrer">
                                View Project
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </GlassContainer>

          {/* Preferences */}
          <GlassContainer variant="card" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Preferences
              </h3>
              <Button variant="ghost" size="sm" onClick={() => onEdit(5)} className="text-primary hover:text-primary">
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="font-medium text-sm">Preferred Sectors:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.preferences.sectors.map((sector) => (
                    <Badge key={sector} className="bg-primary text-primary-foreground">
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-medium text-sm">Preferred Locations:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.preferences.locations.map((location) => (
                    <Badge key={location} className="bg-secondary text-secondary-foreground">
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Types:</span>{" "}
                  {formData.preferences.types.map((type) => type.charAt(0).toUpperCase() + type.slice(1)).join(", ")}
                </div>
                <div>
                  <span className="font-medium">Expected Stipend:</span>{" "}
                  {formData.preferences.stipend || "Not specified"}
                </div>
                <div>
                  <span className="font-medium">Region:</span>{" "}
                  {formData.preferences.regionType
                    ? formData.preferences.regionType.charAt(0).toUpperCase() + formData.preferences.regionType.slice(1)
                    : "Not specified"}
                </div>
              </div>
            </div>
          </GlassContainer>
        </div>

        {/* Confirmation */}
        <GlassContainer variant="card" className="p-6 mb-8">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={setConfirmed}
              className="border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="confirm" className="cursor-pointer">
              I confirm that all the information provided above is accurate and complete.
            </Label>
          </div>
        </GlassContainer>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onBack} className="px-8 bg-transparent">
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!confirmed}
            className="px-12 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Submit Application
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
          <p className="text-sm text-muted-foreground">Final Step - Review & Submit</p>
        </div>
      </div>
    </div>
  )
}
