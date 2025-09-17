import { useState } from "react"
import {
  User,
  LogOut,
  MapPin,
  Building,
  Calendar,
  ExternalLink,
  Star,
  Filter,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import GlassContainer from "@/components/glass-container"

const mockInternships = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "TechCorp Solutions",
    location: "Bangalore",
    type: "Hybrid",
    stipend: "₹25,000/month",
    duration: "6 months",
    sector: "Technology",
    description:
      "Work on cutting-edge React applications and contribute to our product development team.",
    requirements: ["React", "JavaScript", "HTML/CSS"],
    rating: 4.8,
    applicants: 156,
    deadline: "2024-02-15",
  },
  {
    id: "2",
    title: "Data Science Intern",
    company: "Analytics Pro",
    location: "Mumbai",
    type: "Remote",
    stipend: "₹30,000/month",
    duration: "4 months",
    sector: "Technology",
    description:
      "Analyze large datasets and build machine learning models for business insights.",
    requirements: ["Python", "SQL", "Machine Learning"],
    rating: 4.6,
    applicants: 89,
    deadline: "2024-02-20",
  },
  {
    id: "3",
    title: "Marketing Intern",
    company: "Brand Builders",
    location: "Delhi",
    type: "Onsite",
    stipend: "₹20,000/month",
    duration: "3 months",
    sector: "Marketing",
    description:
      "Support digital marketing campaigns and content creation for various clients.",
    requirements: ["Digital Marketing", "Content Creation", "Social Media"],
    rating: 4.4,
    applicants: 203,
    deadline: "2024-02-10",
  },
  {
    id: "4",
    title: "Finance Analyst Intern",
    company: "InvestCorp",
    location: "Mumbai",
    type: "Onsite",
    stipend: "₹35,000/month",
    duration: "6 months",
    sector: "Finance",
    description:
      "Assist in financial modeling and investment analysis for portfolio companies.",
    requirements: ["Excel", "Financial Modeling", "Analytics"],
    rating: 4.9,
    applicants: 67,
    deadline: "2024-02-25",
  },
  {
    id: "5",
    title: "UX Design Intern",
    company: "DesignHub",
    location: "Pune",
    type: "Hybrid",
    stipend: "₹22,000/month",
    duration: "4 months",
    sector: "Technology",
    description:
      "Create user-centered designs and improve user experience across our product suite.",
    requirements: ["Figma", "User Research", "Prototyping"],
    rating: 4.7,
    applicants: 134,
    deadline: "2024-02-18",
  },
  {
    id: "6",
    title: "Content Writing Intern",
    company: "MediaWorks",
    location: "Remote",
    type: "Remote",
    stipend: "₹18,000/month",
    duration: "3 months",
    sector: "Media",
    description:
      "Write engaging content for blogs, social media, and marketing materials.",
    requirements: ["Writing", "SEO", "Research"],
    rating: 4.3,
    applicants: 178,
    deadline: "2024-02-12",
  },
]

export default function Home({ formData, onReset }) {
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  const handleLogout = () => {
    if (onReset) {
      onReset()
    } else {
      window.location.reload()
    }
  }

  const filteredInternships = mockInternships.filter((internship) => {
    if (filter === "all") return true
    if (filter === "recommended") {
      return (
        formData.preferences.sectors.includes(internship.sector) ||
        formData.preferences.locations.includes(internship.location) ||
        formData.preferences.locations.includes("Any Location") ||
        formData.preferences.types.includes(internship.type.toLowerCase())
      )
    }
    return internship.sector.toLowerCase() === filter.toLowerCase()
  })

  const sortedInternships = [...filteredInternships].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "stipend":
        return (
          parseInt(b.stipend.replace(/[^\d]/g, "")) -
          parseInt(a.stipend.replace(/[^\d]/g, ""))
        )
      case "deadline":
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-[family-name:var(--font-merriweather)]">
                InternConnect
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <User size={16} />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Start Over
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <GlassContainer variant="card" className="p-8">
            <h2 className="text-3xl font-bold text-foreground mb-4 font-[family-name:var(--font-merriweather)]">
              Welcome back, {formData.profile.fullName || "Student"}!
            </h2>
            <p className="text-lg text-muted-foreground font-[family-name:var(--font-roboto)]">
              Here are the latest internship opportunities tailored for you
              based on your preferences.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge className="bg-primary text-primary-foreground">
                {formData.preferences.sectors.length} Preferred Sectors
              </Badge>
              <Badge className="bg-secondary text-secondary-foreground">
                {formData.preferences.locations.length} Preferred Locations
              </Badge>
              <Badge variant="outline">{formData.skills.length} Skills</Badge>
            </div>
          </GlassContainer>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <GlassContainer variant="card" className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-primary" />
                <span className="font-medium">Filter:</span>
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48 glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-strong">
                  <SelectItem value="all">All Internships</SelectItem>
                  <SelectItem value="recommended">Recommended for You</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <span className="font-medium">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 glass-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-strong">
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="stipend">Stipend</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </GlassContainer>
        </div>

        {/* Internships Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedInternships.map((internship) => (
            <GlassContainer
              key={internship.id}
              variant="card"
              className="p-6 hover:scale-105 transition-transform"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {internship.title}
                  </h3>
                  <p className="text-muted-foreground font-medium">
                    {internship.company}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{internship.rating}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-primary" />
                  <span>{internship.location}</span>
                  <Badge variant="outline" className="ml-auto">
                    {internship.type}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Building size={16} className="text-primary" />
                  <span>{internship.sector}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-primary" />
                  <span>{internship.duration}</span>
                  <span className="ml-auto font-semibold text-secondary">
                    {internship.stipend}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {internship.description}
              </p>

              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {internship.requirements.slice(0, 3).map((req) => (
                    <Badge key={req} variant="secondary" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                  {internship.requirements.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{internship.requirements.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  {internship.applicants} applicants • Deadline:{" "}
                  {new Date(internship.deadline).toLocaleDateString()}
                </div>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <ExternalLink size={14} className="mr-1" />
                  Apply
                </Button>
              </div>
            </GlassContainer>
          ))}
        </div>

        {sortedInternships.length === 0 && (
          <div className="text-center py-12">
            <GlassContainer variant="card" className="p-8">
              <p className="text-lg text-muted-foreground">
                No internships found matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => setFilter("all")}
                className="mt-4 bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                View All Internships
              </Button>
            </GlassContainer>
          </div>
        )}
      </div>
    </div>
  )
}
