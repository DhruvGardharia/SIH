import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  Upload, FileText, X, CheckCircle, User, Mail, Phone, Calendar, Users,
  GraduationCap, Plus, Trash2, School, Award, Code, Briefcase, ExternalLink,
  MapPin, Building, Wifi, DollarSign, Home
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import GlassContainer from "@/components/glass-container";
import { UserData } from "@/context/UserContext";

// Progress Bar Component
const ProgressBar = ({ value, completedSections, totalSections }) => (
  <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 py-4 mb-8">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground">Profile Completion</h3>
        <span className="text-sm font-medium text-muted-foreground">
          {completedSections} of {totalSections} sections complete ({Math.round(value)}%)
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-3 shadow-inner">
        <div 
          className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500" 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  </div>
);

export default function OnboardingForm() {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  
  const resumeInputRef = useRef(null);

  const [formData, setFormData] = useState({
    resume: null,
    profile: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
      dateOfBirth: "",
      gender: "",
    },
    education: [{ level: "", degree: "", college: "", yearOfStudy: "", cgpa: 0 }],
    skills: [],
    certifications: [],
    projects: [{ title: "", description: "", link: "" }],
    preferences: {
      sectors: [],
      locations: [],
      types: [],
      stipend: "",
      regionType: "",
    },
    confirmation: false,
  });

  // UI state
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [customLocation, setCustomLocation] = useState("");

  // Sectional saving states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEducation, setSavingEducation] = useState(false);
  const [savingSkills, setSavingSkills] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);

  // Progress tracking
  const TOTAL_SECTIONS = 4;
  const [completedSections, setCompletedSections] = useState(new Set());
  const [progress, setProgress] = useState(0);

  // Popular options
  const popularSkills = ["JavaScript", "Python", "React", "Node.js", "Java", "C++", "HTML/CSS", "SQL", "Git", "AWS", "Docker", "MongoDB"];
  const popularCertifications = ["AWS Certified", "Google Cloud Certified", "Microsoft Azure", "Coursera Certificate", "edX Certificate", "Udemy Certificate", "Other"];
  const popularSectors = ["Technology", "Finance", "Healthcare", "Education", "Marketing", "Consulting", "Manufacturing", "Retail", "Media", "Government", "Non-Profit", "Startups"];
  const popularLocations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Gurgaon", "Noida", "Remote", "Any Location", "Other"];
  const internshipTypes = [{ id: "Onsite", label: "Onsite", icon: Building }, { id: "Remote", label: "Remote", icon: Wifi }, { id: "Hybrid", label: "Hybrid", icon: Home }];

  // Load saved data and progress from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("onboardingFormData");
    const savedProgress = localStorage.getItem("onboardingProgress");
    const ocrDraft = localStorage.getItem("ocrDraft");
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (error) { console.error("Error loading saved form data:", error); }
    }
    
    // Load OCR draft data if available
    if (ocrDraft) {
      try {
        const ocrData = JSON.parse(ocrDraft);
        console.log("Loading OCR draft from localStorage:", ocrData);
        
        // Transform OCR education data to match form structure
        const transformedEducation = ocrData.education ? ocrData.education.map(edu => ({
          level: edu.educationLevel || "",
          degree: edu.degreeName || "",
          college: edu.collegeName || "",
          yearOfStudy: edu.yearOfStudy || "",
          cgpa: edu.cgpa || 0
        })) : [];
        
        setFormData(prev => ({
          ...prev,
          education: transformedEducation.length > 0 ? transformedEducation : prev.education,
          skills: ocrData.skills || prev.skills,
          certifications: ocrData.certifications || prev.certifications,
          projects: ocrData.projects || prev.projects,
        }));
      } catch (error) { console.error("Error loading OCR draft:", error); }
    }
    
    if (savedProgress) {
      try {
        setCompletedSections(new Set(JSON.parse(savedProgress)));
      } catch (error) { console.error("Error loading saved progress:", error); }
    }
  }, []);

  // Auto-save form data and progress to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("onboardingFormData", JSON.stringify(formData));
      if (completedSections.size > 0) {
        localStorage.setItem("onboardingProgress", JSON.stringify(Array.from(completedSections)));
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData, completedSections]);

  // Update progress bar
  useEffect(() => {
    setProgress((completedSections.size / TOTAL_SECTIONS) * 100);
  }, [completedSections]);

  // Resume handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    console.log("HEY THERE HANDLE FILE UPLOAD RUNNING");
    if (!(file.type === "application/pdf" || file.type.includes("document"))) {
        toast.error("Invalid file type. Please upload PDF or DOCX.");
        return;
    }
    setUploading(true);
    try {
      const apiFormData = new FormData();
      apiFormData.append("file", file);
      console.log("Uploading resume file:", file.name, "Size:", file.size);
      
      const uploadResponse = await axios.post("/api/user/resume/extract", apiFormData, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });
      
      console.log("Upload response:", uploadResponse.data);
      
      if (uploadResponse.data) {
        const draftResponse = await axios.get("/api/user/ocr-draft");
        const ocrData = draftResponse.data;
        console.log("OCR draft data:", ocrData);
        
        localStorage.setItem("ocrDraft", JSON.stringify(ocrData));
        
        // Transform OCR education data to match form structure
        const transformedEducation = ocrData.education ? ocrData.education.map(edu => ({
          level: edu.educationLevel || "",
          degree: edu.degreeName || "",
          college: edu.collegeName || "",
          yearOfStudy: edu.yearOfStudy || "",
          cgpa: edu.cgpa || 0
        })) : prev.education;
        
        setFormData(prev => ({
          ...prev,
          resume: file,
          // Note: OCR doesn't extract name, phone, email from resume
          // These fields remain unchanged from user context
          education: transformedEducation,
          skills: ocrData.skills || prev.skills,
          certifications: ocrData.certifications || prev.certifications,
          projects: ocrData.projects || prev.projects,
        }));
        toast.success("Resume processed! Fields pre-filled.");
      }
    } catch (error) {
      console.error("Resume upload error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(`Failed to process resume: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => setFormData(prev => ({ ...prev, resume: null }));

  // Generic change handlers
  const handleClearForm = () => {
  localStorage.removeItem("onboardingFormData");
  localStorage.removeItem("onboardingProgress");
  localStorage.removeItem("ocrDraft");

  // Reset formData state back to defaults
  setFormData({
    resume: null,
    profile: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
      dateOfBirth: "",
      gender: "",
    },
    education: [{ level: "", degree: "", college: "", yearOfStudy: "", cgpa: 0 }],
    skills: [],
    certifications: [],
    projects: [{ title: "", description: "", link: "" }],
    preferences: {
      sectors: [],
      locations: [],
      types: [],
      stipend: "",
      regionType: "",
    },
    confirmation: false,
  });

  setCompletedSections(new Set());
  toast.info("Form data cleared (local only).");
};

  const handleProfileChange = (field, value) => setFormData(prev => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
  const handleEducationChange = (index, field, value) => setFormData(prev => ({ ...prev, education: prev.education.map((edu, i) => i === index ? { ...edu, [field]: value } : edu) }));
  const addEducation = () => setFormData(prev => ({ ...prev, education: [...prev.education, { level: "", degree: "", college: "", yearOfStudy: "", cgpa: 0 }] }));
  const removeEducation = (index) => { if (formData.education.length > 1) setFormData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) })); };
  const addSkill = (skill) => { if (skill && !formData.skills.includes(skill)) { setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] })); setNewSkill(""); } };
  const removeSkill = (skillToRemove) => setFormData(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }));
  const addCertification = (cert) => { if (cert && !formData.certifications.includes(cert)) { setFormData(prev => ({ ...prev, certifications: [...prev.certifications, cert] })); setNewCertification(""); } };
  const removeCertification = (certToRemove) => setFormData(prev => ({ ...prev, certifications: prev.certifications.filter(cert => cert !== certToRemove) }));
  const handleProjectChange = (index, field, value) => setFormData(prev => ({ ...prev, projects: prev.projects.map((p, i) => i === index ? { ...p, [field]: value } : p) }));
  const addProject = () => setFormData(prev => ({ ...prev, projects: [...prev.projects, { title: "", description: "", link: "" }] }));
  const removeProject = (index) => { if (formData.projects.length > 1) setFormData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) })); };
  const handlePreferenceChange = (field, value) => setFormData(prev => ({ ...prev, preferences: { ...prev.preferences, [field]: value } }));
  const handleSectorToggle = (sector) => setFormData(prev => ({ ...prev, preferences: { ...prev.preferences, sectors: prev.preferences.sectors.includes(sector) ? prev.preferences.sectors.filter(s => s !== sector) : [...prev.preferences.sectors, sector] } }));
  const handleLocationToggle = (location) => setFormData(prev => ({ ...prev, preferences: { ...prev.preferences, locations: prev.preferences.locations.includes(location) ? prev.preferences.locations.filter(l => l !== location) : [...prev.preferences.locations, location] } }));
  const handleTypeToggle = (type) => setFormData(prev => ({ ...prev, preferences: { ...prev.preferences, types: prev.preferences.types.includes(type) ? prev.preferences.types.filter(t => t !== type) : [...prev.preferences.types, type] } }));

  // Sectional Save Handlers
  const handleSaveProfile = async () => {
    const { fullName, email, phone, dateOfBirth } = formData.profile;
    if (!fullName || !email || !phone || !dateOfBirth) {
      toast.error("Please fill all required profile fields (*).");
      return;
    }
    setSavingProfile(true);
    try {
      console.log("Saving profile:", { name: fullName, email, phone, dob: dateOfBirth, gender: formData.profile.gender });
      const response = await axios.put("/api/user/profile/basic", { 
        name: fullName, 
        email, 
        phone, 
        dob: dateOfBirth, 
        gender: formData.profile.gender 
      });
      console.log("Profile save response:", response.data);
      setCompletedSections(prev => new Set(prev).add('profile'));
      toast.success("Profile information saved!");
    } catch (error) {
      console.error("Profile save error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(`Failed to save profile: ${error.response?.data?.message || error.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveEducation = async () => {
    if (!formData.education.every(edu => edu.level && edu.degree && edu.college && edu.yearOfStudy && edu.cgpa)) {
        toast.error("Please complete all fields for each education entry.");
        return;
    }
    setSavingEducation(true);
    try {
      console.log("Saving education:", formData.education);
      const response = await axios.put("/api/user/profile/education", { education: formData.education });
      console.log("Education save response:", response.data);
      setCompletedSections(prev => new Set(prev).add('education'));
      toast.success("Education details saved!");
    } catch (error) {
      console.error("Education save error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(`Failed to save education: ${error.response?.data?.message || error.message}`);
    } finally {
      setSavingEducation(false);
    }
  };

  const handleSaveSkills = async () => {
    const { skills, certifications, projects } = formData;
    if (skills.length === 0) {
        toast.error("Please add at least one skill.");
        return;
    }
    setSavingSkills(true);
    try {
      console.log("Saving skills:", skills);
      const skillsResponse = await axios.put("/api/user/skills", { skills });
      console.log("Skills save response:", skillsResponse.data);
      
      console.log("Saving projects & certifications:", { projects, certifications });
      const projectsResponse = await axios.put("/api/user/profile/projects-certs", { projects, certifications });
      console.log("Projects save response:", projectsResponse.data);
      
      setCompletedSections(prev => new Set(prev).add('skills'));
      toast.success("Skills, Certifications & Projects saved!");
    } catch (error) {
      console.error("Skills save error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(`Failed to save skills & projects: ${error.response?.data?.message || error.message}`);
    } finally {
      setSavingSkills(false);
    }
  };

  const handleSavePreferences = async () => {
    const { sectors, locations, types } = formData.preferences;
    if (sectors.length === 0 || locations.length === 0 || types.length === 0) {
        toast.error("Please select your preferred sectors, locations, and internship types.");
        return;
    }
    
    // Add custom location if "Other" is selected and custom location is provided
    let finalLocations = [...locations];
    if (locations.includes("Other") && customLocation.trim()) {
      finalLocations = locations.filter(loc => loc !== "Other");
      finalLocations.push(customLocation.trim());
    }
    
    setSavingPreferences(true);
    try {
      console.log("Saving preferences:", { sectors, locations: finalLocations, types, stipend: formData.preferences.stipend, regionType: formData.preferences.regionType });
      const response = await axios.put("/api/user/profile/preferences", {
        preferredSectors: sectors,
        preferredLocations: finalLocations,
        internshipTypes: types,
        expectedStipend: formData.preferences.stipend,
        regionType: formData.preferences.regionType
      });
      console.log("Preferences save response:", response.data);
      setCompletedSections(prev => new Set(prev).add('preferences'));
      toast.success("Internship preferences saved!");
    } catch (error) {
      console.error("Preferences save error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(`Failed to save preferences: ${error.response?.data?.message || error.message}`);
    } finally {
      setSavingPreferences(false);
    }
  };
  
  // Final Submit Handler
  const handleSubmit = async () => {
    if (completedSections.size !== TOTAL_SECTIONS || !formData.confirmation) {
      toast.error("Please save all sections and confirm your details before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const ocrDraft = localStorage.getItem("ocrDraft");
      if (ocrDraft) {
        console.log("Applying OCR draft:", JSON.parse(ocrDraft));
        await axios.post("/api/user/ocr-apply", JSON.parse(ocrDraft));
      }
      localStorage.removeItem("onboardingFormData");
      localStorage.removeItem("onboardingProgress");
      localStorage.removeItem("ocrDraft");
      toast.success("Profile completed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Submit error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(`An error occurred during final submission: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4" style={{ fontFamily: 'var(--font-merriweather)' }}>
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              InternConnect
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground" style={{ fontFamily: 'var(--font-roboto)' }}>
            Complete your profile to unlock opportunities
          </p>
        </div>
        
        <ProgressBar value={progress} completedSections={completedSections.size} totalSections={TOTAL_SECTIONS} />

        <div className="space-y-12">
          {/* Resume Upload Section */}
          <GlassContainer variant="card" className="p-8 form-section">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><Upload size={28} className="text-primary" />Resume Upload</h2>
            <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileInput} className="hidden" disabled={uploading} />
            {!formData.resume ? (
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/50"}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4"><Upload size={28} className="text-muted-foreground" /></div>
                  <h3 className="text-xl font-semibold mb-2">Drop your resume here</h3>
                  <p className="text-muted-foreground mb-4">or click to browse your files</p>
                  <p className="text-sm text-muted-foreground">Supports PDF and DOCX files up to 10MB</p>
                </div>
                <Button variant="outline" className="cursor-pointer bg-transparent" disabled={uploading} onClick={() => resumeInputRef.current?.click()}>{uploading ? "Processing..." : "Choose File"}</Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg mb-4 border border-border">
                  <FileText size={24} className="text-primary" />
                  <div className="flex-1 text-left"><h4 className="font-semibold text-foreground">{formData.resume.name}</h4><p className="text-sm text-muted-foreground">{formatFileSize(formData.resume.size)}</p></div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <Button variant="ghost" size="sm" onClick={removeFile} className="text-destructive hover:text-destructive"><X size={16} /></Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Resume uploaded! We've pre-filled some fields for you.</p>
                <Button variant="outline" className="cursor-pointer bg-transparent" disabled={uploading} onClick={() => resumeInputRef.current?.click()}>{uploading ? "Processing..." : "Replace File"}</Button>
              </div>
            )}
          </GlassContainer>

          {/* Profile Section */}
          <GlassContainer variant="card" className="p-8 form-section">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><User size={28} className="text-primary" />Profile Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1.5"><Label htmlFor="fullName" className="font-medium flex items-center gap-2"><User size={16} className="text-primary" />Full Name *</Label><Input id="fullName" type="text" placeholder="Enter your full name" value={formData.profile.fullName} onChange={(e) => handleProfileChange("fullName", e.target.value)} className="w-full bg-background/50 border border-input" /></div>
              <div className="space-y-1.5"><Label htmlFor="email" className="font-medium flex items-center gap-2"><Mail size={16} className="text-primary" />Email Address *</Label><Input id="email" type="email" value={formData.profile.email} readOnly className="bg-muted/50 cursor-not-allowed w-full border border-input" /><p className="text-xs text-muted-foreground pt-1">Email is pre-filled and cannot be changed.</p></div>
              <div className="space-y-1.5"><Label htmlFor="phone" className="font-medium flex items-center gap-2"><Phone size={16} className="text-primary" />Phone Number *</Label><Input id="phone" type="tel" placeholder="e.g. 9876543210" value={formData.profile.phone} onChange={(e) => handleProfileChange("phone", e.target.value)} className="w-full bg-background/50 border border-input" /></div>
              <div className="space-y-1.5"><Label htmlFor="dateOfBirth" className="font-medium flex items-center gap-2"><Calendar size={16} className="text-primary" />Date of Birth *</Label><Input id="dateOfBirth" type="date" value={formData.profile.dateOfBirth} onChange={(e) => handleProfileChange("dateOfBirth", e.target.value)} className="w-full bg-background/50 border border-input" /></div>
              <div className="space-y-1.5 md:col-span-2"><Label className="font-medium flex items-center gap-2"><Users size={16} className="text-primary" />Gender</Label><Select value={formData.profile.gender} onValueChange={(value) => handleProfileChange("gender", value)}><SelectTrigger className="w-full max-w-xs bg-background/50 border border-input"><SelectValue placeholder="Select your gender" /></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select></div>
            </div>
            <div className="text-right mt-6"><Button onClick={handleSaveProfile} disabled={savingProfile}>{savingProfile ? "Saving..." : "Save and Continue"}</Button></div>
          </GlassContainer>

          {/* Education Section */}
          <GlassContainer variant="card" className="p-8 form-section">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><GraduationCap size={28} className="text-primary" />Education Details *</h2>
            <div className="space-y-8">
              {formData.education.map((edu, index) => (
                <div key={index} className="dynamic-entry">
                  <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-semibold flex items-center gap-2"><GraduationCap size={20} className="text-primary" />Education #{index + 1}</h3>{formData.education.length > 1 && (<Button variant="ghost" size="sm" onClick={() => removeEducation(index)} className="text-destructive hover:text-destructive"><Trash2 size={16} /></Button>)}</div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1.5"><Label className="font-medium flex items-center gap-2"><Award size={16} className="text-primary" />Education Level *</Label><Select value={edu.level} onValueChange={(value) => handleEducationChange(index, "level", value)}><SelectTrigger className="bg-background/50"><SelectValue placeholder="Select level" /></SelectTrigger><SelectContent><SelectItem value="Diploma">Diploma</SelectItem><SelectItem value="UG">Undergraduate (UG)</SelectItem><SelectItem value="PG">Postgraduate (PG)</SelectItem></SelectContent></Select></div>
                    <div className="space-y-1.5"><Label className="font-medium">Degree Name *</Label><Input type="text" placeholder="e.g., B.Tech Computer Science" value={edu.degree} onChange={(e) => handleEducationChange(index, "degree", e.target.value)} className="bg-background/50" /></div>
                    <div className="space-y-1.5"><Label className="font-medium flex items-center gap-2"><School size={16} className="text-primary" />College Name *</Label><Input type="text" placeholder="Enter college/university name" value={edu.college} onChange={(e) => handleEducationChange(index, "college", e.target.value)} className="bg-background/50" /></div>
                    <div className="space-y-1.5"><Label className="font-medium flex items-center gap-2"><Calendar size={16} className="text-primary" />Year of Study *</Label><Select value={edu.yearOfStudy} onValueChange={(value) => handleEducationChange(index, "yearOfStudy", value)}><SelectTrigger className="bg-background/50"><SelectValue placeholder="Select year" /></SelectTrigger><SelectContent><SelectItem value="2nd Year">2nd Year</SelectItem><SelectItem value="3rd Year">3rd Year</SelectItem><SelectItem value="Final Year">Final Year</SelectItem><SelectItem value="Graduate">Graduate</SelectItem></SelectContent></Select></div>
                    <div className="space-y-1.5 md:col-span-2"><Label className="font-medium">CGPA *</Label><Input type="number" step="0.1" min="0" max="10" placeholder="Enter CGPA (0.0 - 10.0)" value={edu.cgpa || ""} onChange={(e) => handleEducationChange(index, "cgpa", parseFloat(e.target.value) || 0)} className="max-w-xs bg-background/50" /></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6">
                <Button variant="outline" onClick={addEducation} className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"><Plus size={16} className="mr-2" />Add Another Education</Button>
                <Button onClick={handleSaveEducation} disabled={savingEducation}>{savingEducation ? "Saving..." : "Save and Continue"}</Button>
            </div>
          </GlassContainer>

          {/* Skills & Certifications Section */}
          <GlassContainer variant="card" className="p-8 form-section">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><Code size={28} className="text-primary" />Skills & Certifications</h2>
            <div className="mb-8"><h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Code size={20} className="text-primary" />Technical Skills *</h3><div className="mb-4 space-y-2"><Label className="font-medium">Popular Skills</Label><div className="flex flex-wrap gap-2">{popularSkills.map((skill) => (<Badge key={skill} variant={formData.skills.includes(skill) ? "default" : "outline"} className="cursor-pointer transition-colors text-sm py-1 px-3" onClick={() => formData.skills.includes(skill) ? removeSkill(skill) : addSkill(skill)}>{skill}</Badge>))}</div></div><div className="mb-4 space-y-2"><Label className="font-medium">Add Custom Skill</Label><div className="flex gap-2"><Input type="text" placeholder="Enter a skill and press Enter" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addSkill(newSkill)} className="bg-background/50 border border-input" /><Button onClick={() => addSkill(newSkill)} variant="outline" className="bg-transparent">Add</Button></div></div>{formData.skills.length > 0 && (<div className="space-y-2"><Label className="font-medium">Your Skills</Label><div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-md">{formData.skills.map((skill) => (<Badge key={skill} className="bg-secondary text-secondary-foreground text-sm py-1 px-3">{skill}<button onClick={() => removeSkill(skill)} className="ml-2 font-bold hover:text-destructive" type="button">&times;</button></Badge>))}</div></div>)}</div>
            <div className="mb-8"><h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Award size={20} className="text-primary" />Certifications</h3><div className="mb-4 space-y-2"><Label className="font-medium">Popular Certifications</Label><div className="flex flex-wrap gap-2">{popularCertifications.map((cert) => (<Badge key={cert} variant={formData.certifications.includes(cert) ? "default" : "outline"} className="cursor-pointer transition-colors text-sm py-1 px-3" onClick={() => formData.certifications.includes(cert) ? removeCertification(cert) : addCertification(cert)}>{cert}</Badge>))}</div></div><div className="mb-4 space-y-2"><Label className="font-medium">Add Custom Certification</Label><div className="flex gap-2"><Input type="text" placeholder="Enter certification and press Enter" value={newCertification} onChange={(e) => setNewCertification(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addCertification(newCertification)} className="bg-background/50 border border-input" /><Button onClick={() => addCertification(newCertification)} variant="outline" className="bg-transparent">Add</Button></div></div>{formData.certifications.length > 0 && (<div className="space-y-2"><Label className="font-medium">Your Certifications</Label><div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-md">{formData.certifications.map((cert) => (<Badge key={cert} className="bg-secondary text-secondary-foreground text-sm py-1 px-3">{cert}<button onClick={() => removeCertification(cert)} className="ml-2 font-bold hover:text-destructive" type="button">&times;</button></Badge>))}</div></div>)}</div>
            <div><h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Briefcase size={20} className="text-primary" />Projects (Optional)</h3><div className="space-y-6">{formData.projects.map((project, index) => (<div key={index} className="dynamic-entry"><div className="flex items-center justify-between mb-4"><h4 className="font-medium text-lg">Project #{index + 1}</h4>{formData.projects.length > 1 && (<Button variant="ghost" size="sm" onClick={() => removeProject(index)} className="text-destructive hover:text-destructive"><Trash2 size={16} /></Button>)}</div><div className="space-y-4"><div className="space-y-1.5"><Label className="font-medium">Project Title</Label><Input type="text" placeholder="Enter project title" value={project.title} onChange={(e) => handleProjectChange(index, "title", e.target.value)} className="bg-background/50" /></div><div className="space-y-1.5"><Label className="font-medium">Description</Label><Textarea placeholder="Describe your project and technologies used" value={project.description} onChange={(e) => handleProjectChange(index, "description", e.target.value)} className="min-h-[80px] bg-background/50" /></div><div className="space-y-1.5"><Label className="font-medium flex items-center gap-2"><ExternalLink size={16} className="text-primary" />Project Link (Optional)</Label><Input type="url" placeholder="https://github.com/username/project" value={project.link} onChange={(e) => handleProjectChange(index, "link", e.target.value)} className="bg-background/50" /></div></div></div>))}</div><div className="flex justify-between items-center mt-6"><Button variant="outline" onClick={addProject} className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"><Plus size={16} className="mr-2" />Add Another Project</Button><Button onClick={handleSaveSkills} disabled={savingSkills}>{savingSkills ? "Saving..." : "Save and Continue"}</Button></div></div>
          </GlassContainer>

          {/* Preferences Section */}
          <GlassContainer variant="card" className="p-8 form-section">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><MapPin size={28} className="text-primary" />Internship Preferences</h2>
            <div className="space-y-8">
              <div><h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Building size={20} className="text-primary" />Preferred Sectors *</h3><div className="flex flex-wrap gap-2 mb-4">{popularSectors.map((sector) => (<Badge key={sector} variant={formData.preferences.sectors.includes(sector) ? "default" : "outline"} className="cursor-pointer transition-colors text-sm py-1 px-3" onClick={() => handleSectorToggle(sector)}>{sector}</Badge>))}</div></div>
               <div><h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><MapPin size={20} className="text-primary" />Preferred Locations *</h3><div className="flex flex-wrap gap-2 mb-4">{popularLocations.map((location) => (<Badge key={location} variant={formData.preferences.locations.includes(location) ? "default" : "outline"} className="cursor-pointer transition-colors text-sm py-1 px-3" onClick={() => handleLocationToggle(location)}>{location}</Badge>))}</div>{formData.preferences.locations.includes("Other") && (<div className="mt-3"><Label className="font-medium mb-2 block">Specify Other Location</Label><Input type="text" placeholder="Enter your preferred location" value={customLocation} onChange={(e) => setCustomLocation(e.target.value)} className="bg-background/50 border border-input" /></div>)}</div>
              <div className="grid md:grid-cols-2 gap-8">
                <div><h3 className="text-xl font-semibold mb-4">Internship Types *</h3><div className="space-y-4">{internshipTypes.map((type) => { const Icon = type.icon; return (<div key={type.id} className="flex items-center space-x-3"><Checkbox id={type.id} checked={formData.preferences.types.includes(type.id)} onCheckedChange={() => handleTypeToggle(type.id)} className="h-5 w-5 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary" /><Label htmlFor={type.id} className="flex items-center gap-2 cursor-pointer text-base"><Icon size={18} className="text-primary" />{type.label}</Label></div>); })}</div></div>
                <div className="space-y-6"><div className="space-y-1.5"><Label className="font-medium flex items-center gap-2"><DollarSign size={16} className="text-primary" />Expected Stipend (per month)</Label><Input type="number" placeholder="e.g. 15000" value={formData.preferences.stipend} onChange={(e) => handlePreferenceChange("stipend", e.target.value)} className="bg-background/50 border border-input" /></div><div className="space-y-1.5"><Label className="font-medium">Region Type</Label><Select value={formData.preferences.regionType} onValueChange={(value) => handlePreferenceChange("regionType", value)}><SelectTrigger className="bg-background/50 border border-input"><SelectValue placeholder="Select region type" /></SelectTrigger><SelectContent><SelectItem value="Rural">Rural</SelectItem><SelectItem value="Urban">Urban</SelectItem><SelectItem value="Tribal">Tribal</SelectItem></SelectContent></Select></div></div>
              </div>
            </div>
            <div className="text-right mt-6"><Button onClick={handleSavePreferences} disabled={savingPreferences}>{savingPreferences ? "Saving..." : "Save and Continue"}</Button></div>
          </GlassContainer>

          {/* Confirmation Section */}
          <GlassContainer variant="card" className="p-8 form-section">
            <h2 className="text-3xl font-bold mb-4">Final Confirmation</h2>
            <div className="flex items-center space-x-3 mt-4">
              <Checkbox id="confirmation" checked={formData.confirmation} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, confirmation: !!checked }))} className="h-5 w-5 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
              <Label htmlFor="confirmation" className="font-medium cursor-pointer text-base">I hereby confirm that all the details I have provided are correct and accurate. *</Label>
            </div>
          </GlassContainer>

          {/* Submit Button */}

          <div className="text-center pt-4">
            <Button 
              variant="destructive" 
              onClick={handleClearForm}
              disabled={submitting}
              size="lg" className="px-16 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              Clear Form
            </Button>

            <Button onClick={handleSubmit} disabled={progress < 100 || !formData.confirmation || submitting} size="lg" className="px-16 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all duration-300">
              {submitting ? "Submitting..." : "Complete Profile"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}