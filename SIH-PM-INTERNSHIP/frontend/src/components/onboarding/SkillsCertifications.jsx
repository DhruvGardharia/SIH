import { useState } from "react"
import { Code, Award, Plus, Trash2, ExternalLink, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import GlassContainer from "@/components/glass-container"

export default function SkillsCertifications({
  formData,
  setFormData,
  onNext,
  onBack,
  isEditing,
}) {
  const [skills, setSkills] = useState(formData.skills || [])
  const [certifications, setCertifications] = useState(formData.certifications || [])
  const [projects, setProjects] = useState(
    formData.projects && formData.projects.length > 0
      ? formData.projects
      : [{ title: "", description: "", link: "" }]
  )
  const [newSkill, setNewSkill] = useState("")
  const [newCertification, setNewCertification] = useState("")

  const popularSkills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "Java",
    "C++",
    "HTML/CSS",
    "SQL",
    "Git",
    "AWS",
    "Docker",
    "MongoDB",
  ]

  const popularCertifications = [
    "AWS Certified",
    "Google Cloud Certified",
    "Microsoft Azure",
    "Coursera Certificate",
    "edX Certificate",
    "Udemy Certificate",
    "Other",
  ]

  const addSkill = (skill) => {
    if (skill && !skills.includes(skill)) {
      const updatedSkills = [...skills, skill]
      setSkills(updatedSkills)
      setFormData({ ...formData, skills: updatedSkills })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove)
    setSkills(updatedSkills)
    setFormData({ ...formData, skills: updatedSkills })
  }

  const addCertification = (certification) => {
    if (certification && !certifications.includes(certification)) {
      const updatedCertifications = [...certifications, certification]
      setCertifications(updatedCertifications)
      setFormData({ ...formData, certifications: updatedCertifications })
      setNewCertification("")
    }
  }

  const removeCertification = (certToRemove) => {
    const updatedCertifications = certifications.filter((cert) => cert !== certToRemove)
    setCertifications(updatedCertifications)
    setFormData({ ...formData, certifications: updatedCertifications })
  }

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...projects]
    updatedProjects[index] = { ...updatedProjects[index], [field]: value }
    setProjects(updatedProjects)
    setFormData({ ...formData, projects: updatedProjects })
  }

  const addProject = () => {
    const newProject = { title: "", description: "", link: "" }
    const updatedProjects = [...projects, newProject]
    setProjects(updatedProjects)
    setFormData({ ...formData, projects: updatedProjects })
  }

  const removeProject = (index) => {
    if (projects.length > 1) {
      const updatedProjects = projects.filter((_, i) => i !== index)
      setProjects(updatedProjects)
      setFormData({ ...formData, projects: updatedProjects })
    }
  }

  const isFormValid = skills.length > 0

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-[family-name:var(--font-merriweather)]">
            Skills & Experience
          </h1>
          <p className="text-lg text-muted-foreground font-[family-name:var(--font-roboto)]">
            Showcase your technical skills and achievements
          </p>
        </div>

        <div className="space-y-8">
          {/* Skills Section */}
          <GlassContainer variant="card" className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Code size={20} className="text-primary" />
              Technical Skills *
            </h3>

            {/* Popular Skills */}
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2 block">Popular Skills</Label>
              <div className="flex flex-wrap gap-2">
                {popularSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={skills.includes(skill) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      skills.includes(skill)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary hover:text-primary-foreground"
                    }`}
                    onClick={() =>
                      skills.includes(skill) ? removeSkill(skill) : addSkill(skill)
                    }
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom Skill Input */}
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2 block">Add Custom Skill</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill(newSkill)}
                  className="glass-input"
                />
                <Button
                  onClick={() => addSkill(newSkill)}
                  variant="outline"
                  className="bg-transparent"
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Selected Skills */}
            {skills.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Your Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-secondary text-secondary-foreground"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
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

          {/* Certifications Section */}
          <GlassContainer variant="card" className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award size={20} className="text-primary" />
              Certifications
            </h3>

            {/* Popular Certifications */}
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2 block">
                Popular Certifications
              </Label>
              <div className="flex flex-wrap gap-2">
                {popularCertifications.map((cert) => (
                  <Badge
                    key={cert}
                    variant={certifications.includes(cert) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      certifications.includes(cert)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary hover:text-primary-foreground"
                    }`}
                    onClick={() =>
                      certifications.includes(cert)
                        ? removeCertification(cert)
                        : addCertification(cert)
                    }
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom Certification Input */}
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2 block">
                Add Custom Certification
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter certification name"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && addCertification(newCertification)
                  }
                  className="glass-input"
                />
                <Button
                  onClick={() => addCertification(newCertification)}
                  variant="outline"
                  className="bg-transparent"
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Selected Certifications */}
            {certifications.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Your Certifications
                </Label>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert) => (
                    <Badge
                      key={cert}
                      className="bg-secondary text-secondary-foreground"
                    >
                      {cert}
                      <button
                        onClick={() => removeCertification(cert)}
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

          {/* Projects Section */}
          <GlassContainer variant="card" className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-primary" />
              Projects (Optional)
            </h3>

            <div className="space-y-6">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="border border-border/50 rounded-lg p-4 glass-subtle"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Project {index + 1}</h4>
                    {projects.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Project Title
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter project title"
                        value={project.title}
                        onChange={(e) =>
                          handleProjectChange(index, "title", e.target.value)
                        }
                        className="glass-input"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Description
                      </Label>
                      <Textarea
                        placeholder="Describe your project and technologies used"
                        value={project.description}
                        onChange={(e) =>
                          handleProjectChange(index, "description", e.target.value)
                        }
                        className="glass-input min-h-[80px]"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                        <ExternalLink size={16} className="text-primary" />
                        Project Link (Optional)
                      </Label>
                      <Input
                        type="url"
                        placeholder="https://github.com/username/project"
                        value={project.link}
                        onChange={(e) =>
                          handleProjectChange(index, "link", e.target.value)
                        }
                        className="glass-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={addProject}
                className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Plus size={16} className="mr-2" />
                Add Another Project
              </Button>
            </div>
          </GlassContainer>
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
            <div className="w-3 h-3 rounded-full bg-muted"></div>
          </div>
          <p className="text-sm text-muted-foreground">Step 5 of 6</p>
        </div>
      </div>
    </div>
  )
}
