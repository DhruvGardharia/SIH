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
  <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 py-3 mb-6">
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground">Profile Completion</h3>
        <span className="text-sm font-medium text-muted-foreground">
          {completedSections} of {totalSections} sections complete ({Math.round(value)}%)
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 shadow-inner">
        <div
          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
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

    if (ocrDraft) {
      try {
        const ocrData = JSON.parse(ocrDraft);
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
    if (!(file.type === "application/pdf" || file.type.includes("document"))) {
      toast.error("Invalid file type. Please upload PDF or DOCX.");
      return;
    }
    setUploading(true);
    try {
      const apiFormData = new FormData();
      apiFormData.append("file", file);
      const uploadResponse = await axios.post("/api/user/resume/extract", apiFormData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (uploadResponse.data) {
        const draftResponse = await axios.get("/api/user/ocr-draft");
        const ocrData = draftResponse.data;
        localStorage.setItem("ocrDraft", JSON.stringify(ocrData));
        const transformedEducation = ocrData.education ? ocrData.education.map(edu => ({
          level: edu.educationLevel || "",
          degree: edu.degreeName || "",
          college: edu.collegeName || "",
          yearOfStudy: edu.yearOfStudy || "",
          cgpa: edu.cgpa || 0
        })) : [];
        setFormData(prev => ({
          ...prev,
          resume: file,
          education: transformedEducation,
          skills: ocrData.skills || prev.skills,
          certifications: ocrData.certifications || prev.certifications,
          projects: ocrData.projects || prev.projects,
        }));
        toast.success("Resume processed! Fields pre-filled.");
      }
    } catch (error) {
      console.error("Resume upload error:", error);
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
      const response = await axios.put("/api/user/profile/basic", {
        name: fullName,
        email,
        phone,
        dob: dateOfBirth,
        gender: formData.profile.gender
      });
      setCompletedSections(prev => new Set(prev).add('profile'));
      toast.success("Profile information saved!");
    } catch (error) {
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
      const response = await axios.put("/api/user/profile/education", { education: formData.education });
      setCompletedSections(prev => new Set(prev).add('education'));
      toast.success("Education details saved!");
    } catch (error) {
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
      await axios.put("/api/user/skills", { skills });
      await axios.put("/api/user/profile/projects-certs", { projects, certifications });
      setCompletedSections(prev => new Set(prev).add('skills'));
      toast.success("Skills, Certifications & Projects saved!");
    } catch (error) {
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
    let finalLocations = [...locations];
    if (locations.includes("Other") && customLocation.trim()) {
      finalLocations = locations.filter(loc => loc !== "Other");
      finalLocations.push(customLocation.trim());
    }
    setSavingPreferences(true);
    try {
      const response = await axios.put("/api/user/profile/preferences", {
        preferredSectors: sectors,
        preferredLocations: finalLocations,
        internshipTypes: types,
        expectedStipend: formData.preferences.stipend,
        regionType: formData.preferences.regionType
      });
      setCompletedSections(prev => new Set(prev).add('preferences'));
      toast.success("Internship preferences saved!");
    } catch (error) {
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
        await axios.post("/api/user/ocr-apply", JSON.parse(ocrDraft));
      }
      localStorage.removeItem("onboardingFormData");
      localStorage.removeItem("onboardingProgress");
      localStorage.removeItem("ocrDraft");
      toast.success("Profile completed successfully!");
      navigate("/");
    } catch (error) {
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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-foreground mb-2">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              InternConnect
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete your profile to unlock opportunities
          </p>
        </div>
  
        <ProgressBar value={progress} completedSections={completedSections.size} totalSections={TOTAL_SECTIONS} />
  
        <div className="space-y-6">
          {/* Resume Upload Section */}
          <GlassContainer variant="card" className="p-5">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Upload size={20} className="text-primary" />Resume Upload</h2>
            <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileInput} className="hidden" disabled={uploading} />
            {!formData.resume ? (
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-300 ${dragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="mb-3">
                  <div className="w-10 h-10 mx-auto rounded-full bg-muted flex items-center justify-center mb-2"><Upload size={20} className="text-muted-foreground" /></div>
                  <h3 className="text-base font-semibold mb-1">Drop your resume here</h3>
                  <p className="text-muted-foreground mb-2 text-sm">or click to browse your files</p>
                  <p className="text-xs text-muted-foreground">Supports PDF and DOCX files up to 10MB</p>
                </div>
                <Button variant="outline" className="cursor-pointer bg-transparent" disabled={uploading} onClick={() => resumeInputRef.current?.click()}>
                  {uploading ? "Processing..." : "Choose File"}
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 p-3 bg-muted/30 rounded-lg mb-3 border border-border">
                  <FileText size={18} className="text-primary" />
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-foreground text-sm">{formData.resume.name}</h4>
                    <p className="text-xs text-muted-foreground">{formatFileSize(formData.resume.size)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle size={12} className="text-green-500" />
                    <Button variant="ghost" size="sm" onClick={removeFile} className="text-destructive hover:text-destructive p-1 h-6 w-6">
                      <X size={12} />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Resume uploaded! We've pre-filled some fields for you.</p>
                <Button variant="outline" className="cursor-pointer bg-transparent" disabled={uploading} onClick={() => resumeInputRef.current?.click()}>
                  {uploading ? "Processing..." : "Replace File"}
                </Button>
              </div>
            )}
          </GlassContainer>
  
          {/* Profile Section */}
          <GlassContainer variant="card" className="p-5">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><User size={20} className="text-primary" />Profile Information</h2>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="font-medium flex items-center gap-1 text-sm"><User size={14} className="text-primary" />Full Name *</Label>
                <Input id="fullName" type="text" placeholder="Enter your full name" value={formData.profile.fullName} onChange={(e) => handleProfileChange("fullName", e.target.value)} className="w-full bg-background/50 border border-input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-medium flex items-center gap-1 text-sm"><Mail size={14} className="text-primary" />Email *</Label>
                  <Input id="email" type="email" value={formData.profile.email} readOnly className="bg-muted/50 cursor-not-allowed w-full border border-input text-sm" />
                  <p className="text-xs text-muted-foreground">Pre-filled, cannot be changed.</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="font-medium flex items-center gap-1 text-sm"><Phone size={14} className="text-primary" />Phone *</Label>
                  <Input id="phone" type="tel" placeholder="9876543210" value={formData.profile.phone} onChange={(e) => handleProfileChange("phone", e.target.value)} className="w-full bg-background/50 border border-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="dateOfBirth" className="font-medium flex items-center gap-1 text-sm"><Calendar size={14} className="text-primary" />Date of Birth *</Label>
                  <Input id="dateOfBirth" type="date" value={formData.profile.dateOfBirth} onChange={(e) => handleProfileChange("dateOfBirth", e.target.value)} className="w-full bg-background/50 border border-input" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-medium flex items-center gap-1 text-sm"><Users size={14} className="text-primary" />Gender</Label>
                  <Select value={formData.profile.gender} onValueChange={(value) => handleProfileChange("gender", value)}>
                    <SelectTrigger className="w-full bg-background/50 border border-input">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="text-right mt-3">
              <Button onClick={handleSaveProfile} disabled={savingProfile} size="sm">
                {savingProfile ? "Saving..." : "Save and Continue"}
              </Button>
            </div>
          </GlassContainer>
  
          {/* Education Section */}
          <GlassContainer variant="card" className="p-5">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><GraduationCap size={20} className="text-primary" />Education Details *</h2>
            <div className="space-y-4">
              {formData.education.map((edu, index) => (
                <div key={index} className="dynamic-entry">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold flex items-center gap-1"><GraduationCap size={16} className="text-primary" />Education #{index + 1}</h3>
                    {formData.education.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeEducation(index)} className="text-destructive hover:text-destructive p-1 h-6 w-6">
                        <Trash2 size={12} />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="font-medium flex items-center gap-1 text-sm"><Award size={14} className="text-primary" />Education Level *</Label>
                        <Select value={edu.level} onValueChange={(value) => handleEducationChange(index, "level", value)}>
                          <SelectTrigger className="bg-background/50 border border-input">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Diploma">Diploma</SelectItem>
                            <SelectItem value="UG">Undergraduate (UG)</SelectItem>
                            <SelectItem value="PG">Postgraduate (PG)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="font-medium text-sm">Degree Name *</Label>
                        <Input type="text" placeholder="B.Tech Computer Science" value={edu.degree} onChange={(e) => handleEducationChange(index, "degree", e.target.value)} className="bg-background/50 border border-input" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-medium flex items-center gap-1 text-sm"><School size={14} className="text-primary" />College Name *</Label>
                      <Input type="text" placeholder="Enter college/university name" value={edu.college} onChange={(e) => handleEducationChange(index, "college", e.target.value)} className="bg-background/50 border border-input" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="font-medium flex items-center gap-1 text-sm"><Calendar size={14} className="text-primary" />Year of Study *</Label>
                        <Select value={edu.yearOfStudy} onValueChange={(value) => handleEducationChange(index, "yearOfStudy", value)}>
                          <SelectTrigger className="bg-background/50 border border-input">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2nd Year">2nd Year</SelectItem>
                            <SelectItem value="3rd Year">3rd Year</SelectItem>
                            <SelectItem value="Final Year">Final Year</SelectItem>
                            <SelectItem value="Graduate">Graduate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="font-medium text-sm">CGPA *</Label>
                        <Input type="number" step="0.1" min="0" max="10" placeholder="CGPA (0.0 - 10.0)" value={edu.cgpa || ""} onChange={(e) => handleEducationChange(index, "cgpa", parseFloat(e.target.value) || 0)} className="bg-background/50 border border-input" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3">
              <Button variant="outline" onClick={addEducation} className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm py-1 px-3 h-8">
                <Plus size={12} className="mr-1" /> Add Education
              </Button>
              <Button onClick={handleSaveEducation} disabled={savingEducation} size="sm">
                {savingEducation ? "Saving..." : "Save and Continue"}
              </Button>
            </div>
          </GlassContainer>
  
          {/* Skills & Certifications Section */}
          <GlassContainer variant="card" className="p-5">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Code size={20} className="text-primary" />Skills & Certifications</h2>
            <div className="mb-4">
              <h3 className="text-base font-semibold mb-2 flex items-center gap-1"><Code size={16} className="text-primary" />Technical Skills *</h3>
              <div className="mb-3 space-y-2">
                <Label className="font-medium text-sm">Popular Skills</Label>
                <div className="flex flex-wrap gap-1.5">
                  {popularSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant={formData.skills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer transition-colors text-xs py-0.5 px-1.5"
                      onClick={() => formData.skills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mb-3 space-y-2">
                <Label className="font-medium text-sm">Add Custom Skill</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter a skill and press Enter"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill(newSkill)}
                    className="bg-background/50 border border-input text-sm py-1 px-3 h-8 flex-1"
                  />
                  <Button onClick={() => addSkill(newSkill)} variant="outline" className="bg-transparent text-sm py-1 px-3 h-8">
                    Add
                  </Button>
                </div>
              </div>
              {formData.skills.length > 0 && (
                <div className="space-y-2">
                  <Label className="font-medium text-sm">Your Skills</Label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-muted/20 rounded-md">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} className="bg-secondary text-secondary-foreground text-xs py-0.5 px-1.5">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="ml-1 font-bold hover:text-destructive" type="button">&times;</button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
  
            <div className="mb-4">
              <h3 className="text-base font-semibold mb-2 flex items-center gap-1"><Award size={16} className="text-primary" />Certifications</h3>
              <div className="mb-3 space-y-2">
                <Label className="font-medium text-sm">Popular Certifications</Label>
                <div className="flex flex-wrap gap-1.5">
                  {popularCertifications.map((cert) => (
                    <Badge
                      key={cert}
                      variant={formData.certifications.includes(cert) ? "default" : "outline"}
                      className="cursor-pointer transition-colors text-xs py-0.5 px-1.5"
                      onClick={() => formData.certifications.includes(cert) ? removeCertification(cert) : addCertification(cert)}
                    >
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mb-3 space-y-2">
                <Label className="font-medium text-sm">Add Custom Certification</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter certification and press Enter"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCertification(newCertification)}
                    className="bg-background/50 border border-input text-sm py-1 px-3 h-8 flex-1"
                  />
                  <Button onClick={() => addCertification(newCertification)} variant="outline" className="bg-transparent text-sm py-1 px-3 h-8">
                    Add
                  </Button>
                </div>
              </div>
              {formData.certifications.length > 0 && (
                <div className="space-y-2">
                  <Label className="font-medium text-sm">Your Certifications</Label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-muted/20 rounded-md">
                    {formData.certifications.map((cert) => (
                      <Badge key={cert} className="bg-secondary text-secondary-foreground text-xs py-0.5 px-1.5">
                        {cert}
                        <button onClick={() => removeCertification(cert)} className="ml-1 font-bold hover:text-destructive" type="button">&times;</button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
  
            <div>
              <h3 className="text-base font-semibold mb-2 flex items-center gap-1"><Briefcase size={16} className="text-primary" />Projects (Optional)</h3>
              <div className="space-y-3">
                {formData.projects.map((project, index) => (
                  <div key={index} className="dynamic-entry">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Project #{index + 1}</h4>
                      {formData.projects.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeProject(index)} className="text-destructive hover:text-destructive p-1 h-6 w-6">
                          <Trash2 size={12} />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <Label className="font-medium text-xs">Project Title</Label>
                        <Input type="text" placeholder="Enter project title" value={project.title} onChange={(e) => handleProjectChange(index, "title", e.target.value)} className="bg-background/50 border border-input text-sm py-1 px-2 h-8" />
                      </div>
                      <div className="space-y-1">
                        <Label className="font-medium text-xs">Description</Label>
                        <Textarea placeholder="Describe your project and technologies used" value={project.description} onChange={(e) => handleProjectChange(index, "description", e.target.value)} className="min-h-[60px] bg-background/50 border border-input text-sm py-1 px-2" />
                      </div>
                      <div className="space-y-1">
                        <Label className="font-medium text-xs flex items-center gap-1"><ExternalLink size={12} className="text-primary" />Project Link (Optional)</Label>
                        <Input type="url" placeholder="https://github.com/username/project" value={project.link} onChange={(e) => handleProjectChange(index, "link", e.target.value)} className="bg-background/50 border border-input text-sm py-1 px-2 h-8" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3">
                <Button variant="outline" onClick={addProject} className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm py-1 px-3 h-8">
                  <Plus size={12} className="mr-1" /> Add Project
                </Button>
                <Button onClick={handleSaveSkills} disabled={savingSkills} size="sm">
                  {savingSkills ? "Saving..." : "Save and Continue"}
                </Button>
              </div>
            </div>
          </GlassContainer>
  
          {/* Preferences Section */}
          <GlassContainer variant="card" className="p-5">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><MapPin size={20} className="text-primary" />Internship Preferences</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold mb-2 flex items-center gap-1"><Building size={16} className="text-primary" />Preferred Sectors *</h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {popularSectors.map((sector) => (
                    <Badge
                      key={sector}
                      variant={formData.preferences.sectors.includes(sector) ? "default" : "outline"}
                      className="cursor-pointer transition-colors text-xs py-0.5 px-1.5"
                      onClick={() => handleSectorToggle(sector)}
                    >
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 flex items-center gap-1"><MapPin size={16} className="text-primary" />Preferred Locations *</h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {popularLocations.map((location) => (
                    <Badge
                      key={location}
                      variant={formData.preferences.locations.includes(location) ? "default" : "outline"}
                      className="cursor-pointer transition-colors text-xs py-0.5 px-1.5"
                      onClick={() => handleLocationToggle(location)}
                    >
                      {location}
                    </Badge>
                  ))}
                </div>
                {formData.preferences.locations.includes("Other") && (
                  <div className="mt-2">
                    <Label className="font-medium text-sm mb-1 block">Specify Other Location</Label>
                    <Input type="text" placeholder="Enter your preferred location" value={customLocation} onChange={(e) => setCustomLocation(e.target.value)} className="bg-background/50 border border-input text-sm py-1 px-3 h-8" />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold mb-2">Internship Types *</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {internshipTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <div key={type.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={type.id}
                            checked={formData.preferences.types.includes(type.id)}
                            onCheckedChange={() => handleTypeToggle(type.id)}
                            className="h-4 w-4 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <Label htmlFor={type.id} className="flex items-center gap-1 cursor-pointer text-sm">
                            <Icon size={14} className="text-primary" />
                            {type.label}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="font-medium text-sm flex items-center gap-1"><DollarSign size={14} className="text-primary" />Expected Stipend (per month)</Label>
                    <Input type="number" placeholder="e.g. 15000" value={formData.preferences.stipend} onChange={(e) => handlePreferenceChange("stipend", e.target.value)} className="bg-background/50 border border-input text-sm py-1 px-3 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-medium text-sm">Region Type</Label>
                    <Select value={formData.preferences.regionType} onValueChange={(value) => handlePreferenceChange("regionType", value)}>
                      <SelectTrigger className="bg-background/50 border border-input text-sm py-1 px-3 h-8">
                        <SelectValue placeholder="Select region type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rural">Rural</SelectItem>
                        <SelectItem value="Urban">Urban</SelectItem>
                        <SelectItem value="Tribal">Tribal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right mt-3">
              <Button onClick={handleSavePreferences} disabled={savingPreferences} size="sm">
                {savingPreferences ? "Saving..." : "Save and Continue"}
              </Button>
            </div>
          </GlassContainer>
  
          {/* Confirmation Section */}
          <GlassContainer variant="card" className="p-5">
            <h2 className="text-xl font-bold mb-2">Final Confirmation</h2>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="confirmation"
                checked={formData.confirmation}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, confirmation: !!checked }))}
                className="h-4 w-4 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="confirmation" className="font-medium cursor-pointer text-sm">
                I hereby confirm that all the details I have provided are correct and accurate. *
              </Label>
            </div>
          </GlassContainer>
  
          {/* Submit Button */}
          <div className="text-center pt-3">
            <Button
              variant="destructive"
              onClick={handleClearForm}
              disabled={submitting}
              size="sm"
              className="px-6 py-2 text-sm font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg hover:shadow-destructive/20 transition-all duration-300 mr-3"
            >
              Clear Form
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={progress < 100 || !formData.confirmation || submitting}
              size="sm"
              className="px-6 py-2 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              {submitting ? "Submitting..." : "Complete Profile"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
