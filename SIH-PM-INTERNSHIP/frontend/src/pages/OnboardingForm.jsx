import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Upload, FileText, X, CheckCircle, User, Mail, Phone, Calendar, Users,
  GraduationCap, Plus, Trash2, School, Award, Code, Briefcase, ExternalLink,
  MapPin, Building, Wifi, DollarSign, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { UserData } from "@/context/UserContext";
import Navbar from "@/components/Navbar";

// GlassContainer component (replace with your actual implementation)
const GlassContainer = ({ children, className }) => (
  <div className={`bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100/50 ${className}`}>
    {children}
  </div>
);

// ProgressBar component
const ProgressBar = ({ value, completedSections, totalSections }) => (
  <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-100/50 py-3 mb-6">
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800" style={{ fontFamily: "Playfair Display, serif" }}>
          Profile Completion
        </h3>
        <span className="text-sm font-medium text-gray-600">
          {completedSections} of {totalSections} sections complete ({Math.round(value)}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
        <div
          className="bg-gradient-to-r from-orange-500 to-green-600 h-2 rounded-full transition-all duration-500"
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
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEducation, setSavingEducation] = useState(false);
  const [savingSkills, setSavingSkills] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const TOTAL_SECTIONS = 4;
  const [completedSections, setCompletedSections] = useState(new Set());
  const [progress, setProgress] = useState(0);

  // Popular options
  const popularSkills = ["JavaScript", "Python", "React", "Node.js", "Java", "C++", "HTML/CSS", "SQL", "Git", "AWS", "Docker", "MongoDB"];
  const popularCertifications = ["AWS Certified", "Google Cloud Certified", "Microsoft Azure", "Coursera Certificate", "edX Certificate", "Udemy Certificate", "Other"];
  const popularSectors = ["Technology", "Finance", "Healthcare", "Education", "Marketing", "Consulting", "Manufacturing", "Retail", "Media", "Government", "Non-Profit", "Startups"];
  const popularLocations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Gurgaon", "Noida", "Remote", "Any Location", "Other"];
  const internshipTypes = [{ id: "Onsite", label: "Onsite", icon: Building }, { id: "Remote", label: "Remote", icon: Wifi }, { id: "Hybrid", label: "Hybrid", icon: Home }];

  // Load saved data and progress
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

  // Auto-save form data and progress
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
    <>
    <Navbar />
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(to right, rgba(255,153,51,0.15) 0%, rgba(255,255,255,0.95) 33%, rgba(255,255,255,0.95) 67%, rgba(19,136,8,0.15) 100%)",
      }}
    >
      {/* Decorative Pattern Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B35' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Page Content */}
      <main className="p-6 flex-grow relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="rounded-2xl shadow-lg p-8 mb-8 text-center bg-white/95 backdrop-blur-md border border-orange-100/50">
            <div className="flex items-center justify-center mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mr-3 shadow-md"
                style={{
                  background: "linear-gradient(135deg, #FF9933 0%, #FF6B35 100%)",
                }}
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h2
                className="text-3xl font-bold"
                style={{
                  fontFamily: "Playfair Display, serif",
                  background: "linear-gradient(135deg, #1F2937 0%, #374151 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                Complete Your Profile
              </h2>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="flex space-x-1">
                <div className="w-3 h-1 rounded-full bg-orange-400"></div>
                <div className="w-8 h-1 rounded-full bg-blue-500"></div>
                <div className="w-3 h-1 rounded-full bg-green-500"></div>
              </div>
            </div>
            <p
              className="text-lg max-w-2xl mx-auto leading-relaxed"
              style={{
                fontFamily: "Inter, sans-serif",
                color: "#4B5563",
                lineHeight: "1.7"
              }}
            >
              Help us understand your skills, interests, and career goals to unlock personalized internship recommendations.
            </p>
          </div>

          <ProgressBar value={progress} completedSections={completedSections.size} totalSections={TOTAL_SECTIONS} />

          <div className="space-y-6">
            {/* Resume Upload Section */}
            <GlassContainer className="p-5">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Upload size={20} className="text-orange-500" /> Resume Upload
              </h2>
              <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileInput} className="hidden" disabled={uploading} />
              {!formData.resume ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-300 ${dragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-orange-300"}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="mb-3">
                    <div className="w-10 h-10 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-2">
                      <Upload size={20} className="text-orange-500" />
                    </div>
                    <h3 className="text-base font-semibold mb-1">Drop your resume here</h3>
                    <p className="text-gray-600 mb-2 text-sm">or click to browse your files</p>
                    <p className="text-xs text-gray-500">Supports PDF and DOCX files up to 10MB</p>
                  </div>
                  <Button
                    variant="outline"
                    className="cursor-pointer border-orange-500 text-orange-500 hover:bg-orange-50"
                    disabled={uploading}
                    onClick={() => resumeInputRef.current?.click()}
                  >
                    {uploading ? "Processing..." : "Choose File"}
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 p-3 bg-orange-50 rounded-lg mb-3 border border-orange-200">
                    <FileText size={18} className="text-orange-500" />
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-gray-800 text-sm">{formData.resume.name}</h4>
                      <p className="text-xs text-gray-500">{formatFileSize(formData.resume.size)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle size={12} className="text-green-500" />
                      <Button variant="ghost" size="sm" onClick={removeFile} className="text-red-500 hover:text-red-700 p-1 h-6 w-6">
                        <X size={12} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Resume uploaded! We've pre-filled some fields for you.</p>
                  <Button
                    variant="outline"
                    className="cursor-pointer border-orange-500 text-orange-500 hover:bg-orange-50"
                    disabled={uploading}
                    onClick={() => resumeInputRef.current?.click()}
                  >
                    {uploading ? "Processing..." : "Replace File"}
                  </Button>
                </div>
              )}
            </GlassContainer>

            {/* Profile Section */}
            <GlassContainer className="p-5">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <User size={20} className="text-orange-500" /> Profile Information
              </h2>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="font-medium flex items-center gap-1 text-sm">
                    <User size={14} className="text-orange-500" /> Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.profile.fullName}
                    onChange={(e) => handleProfileChange("fullName", e.target.value)}
                    className="w-full bg-white/70 border border-gray-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="font-medium flex items-center gap-1 text-sm">
                      <Mail size={14} className="text-orange-500" /> Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.profile.email}
                      readOnly
                      className="bg-gray-100 cursor-not-allowed w-full border border-gray-300 text-sm"
                    />
                    <p className="text-xs text-gray-500">Pre-filled, cannot be changed.</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="font-medium flex items-center gap-1 text-sm">
                      <Phone size={14} className="text-orange-500" /> Phone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={formData.profile.phone}
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                      className="w-full bg-white/70 border border-gray-300"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="dateOfBirth" className="font-medium flex items-center gap-1 text-sm">
                      <Calendar size={14} className="text-orange-500" /> Date of Birth *
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.profile.dateOfBirth}
                      onChange={(e) => handleProfileChange("dateOfBirth", e.target.value)}
                      className="w-full bg-white/70 border border-gray-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-medium flex items-center gap-1 text-sm">
                      <Users size={14} className="text-orange-500" /> Gender
                    </Label>
                    <Select value={formData.profile.gender} onValueChange={(value) => handleProfileChange("gender", value)}>
                      <SelectTrigger className="w-full bg-white/70 border border-gray-300">
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
                <Button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white"
                >
                  {savingProfile ? "Saving..." : "Save and Continue"}
                </Button>
              </div>
            </GlassContainer>

            {/* Education Section */}
            <GlassContainer className="p-5">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <GraduationCap size={20} className="text-orange-500" /> Education Details *
              </h2>
              <div className="space-y-4">
                {formData.education.map((edu, index) => (
                  <div key={index} className="dynamic-entry">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-semibold flex items-center gap-1">
                        <GraduationCap size={16} className="text-orange-500" /> Education #{index + 1}
                      </h3>
                      {formData.education.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(index)}
                          className="text-red-500 hover:text-red-700 p-1 h-6 w-6"
                        >
                          <Trash2 size={12} />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="font-medium flex items-center gap-1 text-sm">
                            <Award size={14} className="text-orange-500" /> Education Level *
                          </Label>
                          <Select value={edu.level} onValueChange={(value) => handleEducationChange(index, "level", value)}>
                            <SelectTrigger className="bg-white/70 border border-gray-300">
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
                          <Input
                            type="text"
                            placeholder="B.Tech Computer Science"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                            className="bg-white/70 border border-gray-300"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="font-medium flex items-center gap-1 text-sm">
                          <School size={14} className="text-orange-500" /> College Name *
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter college/university name"
                          value={edu.college}
                          onChange={(e) => handleEducationChange(index, "college", e.target.value)}
                          className="bg-white/70 border border-gray-300"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="font-medium flex items-center gap-1 text-sm">
                            <Calendar size={14} className="text-orange-500" /> Year of Study *
                          </Label>
                          <Select value={edu.yearOfStudy} onValueChange={(value) => handleEducationChange(index, "yearOfStudy", value)}>
                            <SelectTrigger className="bg-white/70 border border-gray-300">
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
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            placeholder="CGPA (0.0 - 10.0)"
                            value={edu.cgpa || ""}
                            onChange={(e) => handleEducationChange(index, "cgpa", parseFloat(e.target.value) || 0)}
                            className="bg-white/70 border border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3">
                <Button
                  variant="outline"
                  onClick={addEducation}
                  className="border-orange-500 text-orange-500 hover:bg-orange-50 text-sm py-1 px-3 h-8"
                >
                  <Plus size={12} className="mr-1" /> Add Education
                </Button>
                <Button
                  onClick={handleSaveEducation}
                  disabled={savingEducation}
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white"
                >
                  {savingEducation ? "Saving..." : "Save and Continue"}
                </Button>
              </div>
            </GlassContainer>

            {/* Skills & Certifications Section */}
            <GlassContainer className="p-5">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Code size={20} className="text-orange-500" /> Skills & Certifications
              </h2>
              <div className="mb-4">
                <h3 className="text-base font-semibold mb-2 flex items-center gap-1">
                  <Code size={16} className="text-orange-500" /> Technical Skills *
                </h3>
                <div className="mb-3 space-y-2">
                  <Label className="font-medium text-sm">Popular Skills</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {popularSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={formData.skills.includes(skill) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors text-xs py-0.5 px-1.5 ${formData.skills.includes(skill) ? "bg-orange-500 hover:bg-orange-600" : "border-orange-300 hover:bg-orange-50"}`}
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
                      className="bg-white/70 border border-gray-300 text-sm py-1 px-3 h-8 flex-1"
                    />
                    <Button
                      onClick={() => addSkill(newSkill)}
                      variant="outline"
                      className="border-orange-500 text-orange-500 hover:bg-orange-50 text-sm py-1 px-3 h-8"
                    >
                      Add
                    </Button>
                  </div>
                </div>
                {formData.skills.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-medium text-sm">Your Skills</Label>
                    <div className="flex flex-wrap gap-1.5 p-2 bg-orange-50 rounded-md">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} className="bg-orange-500 text-white text-xs py-0.5 px-1.5">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="ml-1 font-bold hover:text-red-500" type="button">&times;</button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-base font-semibold mb-2 flex items-center gap-1">
                  <Award size={16} className="text-orange-500" /> Certifications
                </h3>
                <div className="mb-3 space-y-2">
                  <Label className="font-medium text-sm">Popular Certifications</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {popularCertifications.map((cert) => (
                      <Badge
                        key={cert}
                        variant={formData.certifications.includes(cert) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors text-xs py-0.5 px-1.5 ${formData.certifications.includes(cert) ? "bg-green-600 hover:bg-green-700" : "border-green-300 hover:bg-green-50"}`}
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
                      className="bg-white/70 border border-gray-300 text-sm py-1 px-3 h-8 flex-1"
                    />
                    <Button
                      onClick={() => addCertification(newCertification)}
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50 text-sm py-1 px-3 h-8"
                    >
                      Add
                    </Button>
                  </div>
                </div>
                {formData.certifications.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-medium text-sm">Your Certifications</Label>
                    <div className="flex flex-wrap gap-1.5 p-2 bg-green-50 rounded-md">
                      {formData.certifications.map((cert) => (
                        <Badge key={cert} className="bg-green-600 text-white text-xs py-0.5 px-1.5">
                          {cert}
                          <button onClick={() => removeCertification(cert)} className="ml-1 font-bold hover:text-red-500" type="button">&times;</button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-base font-semibold mb-2 flex items-center gap-1">
                  <Briefcase size={16} className="text-orange-500" /> Projects (Optional)
                </h3>
                <div className="space-y-3">
                  {formData.projects.map((project, index) => (
                    <div key={index} className="dynamic-entry">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Project #{index + 1}</h4>
                        {formData.projects.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProject(index)}
                            className="text-red-500 hover:text-red-700 p-1 h-6 w-6"
                          >
                            <Trash2 size={12} />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="font-medium text-xs">Project Title</Label>
                          <Input
                            type="text"
                            placeholder="Enter project title"
                            value={project.title}
                            onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                            className="bg-white/70 border border-gray-300 text-sm py-1 px-2 h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="font-medium text-xs">Description</Label>
                          <Textarea
                            placeholder="Describe your project and technologies used"
                            value={project.description}
                            onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                            className="min-h-[60px] bg-white/70 border border-gray-300 text-sm py-1 px-2"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="font-medium text-xs flex items-center gap-1">
                            <ExternalLink size={12} className="text-orange-500" /> Project Link (Optional)
                          </Label>
                          <Input
                            type="url"
                            placeholder="https://github.com/username/project"
                            value={project.link}
                            onChange={(e) => handleProjectChange(index, "link", e.target.value)}
                            className="bg-white/70 border border-gray-300 text-sm py-1 px-2 h-8"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <Button
                    variant="outline"
                    onClick={addProject}
                    className="border-orange-500 text-orange-500 hover:bg-orange-50 text-sm py-1 px-3 h-8"
                  >
                    <Plus size={12} className="mr-1" /> Add Project
                  </Button>
                  <Button
                    onClick={handleSaveSkills}
                    disabled={savingSkills}
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white"
                  >
                    {savingSkills ? "Saving..." : "Save and Continue"}
                  </Button>
                </div>
              </div>
            </GlassContainer>

            {/* Preferences Section */}
            <GlassContainer className="p-5">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <MapPin size={20} className="text-orange-500" /> Internship Preferences
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold mb-2 flex items-center gap-1">
                    <Building size={16} className="text-orange-500" /> Preferred Sectors *
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {popularSectors.map((sector) => (
                      <Badge
                        key={sector}
                        variant={formData.preferences.sectors.includes(sector) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors text-xs py-0.5 px-1.5 ${formData.preferences.sectors.includes(sector) ? "bg-orange-500 hover:bg-orange-600" : "border-orange-300 hover:bg-orange-50"}`}
                        onClick={() => handleSectorToggle(sector)}
                      >
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-2 flex items-center gap-1">
                    <MapPin size={16} className="text-orange-500" /> Preferred Locations *
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {popularLocations.map((location) => (
                      <Badge
                        key={location}
                        variant={formData.preferences.locations.includes(location) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors text-xs py-0.5 px-1.5 ${formData.preferences.locations.includes(location) ? "bg-green-600 hover:bg-green-700" : "border-green-300 hover:bg-green-50"}`}
                        onClick={() => handleLocationToggle(location)}
                      >
                        {location}
                      </Badge>
                    ))}
                  </div>
                  {formData.preferences.locations.includes("Other") && (
                    <div className="mt-2">
                      <Label className="font-medium text-sm mb-1 block">Specify Other Location</Label>
                      <Input
                        type="text"
                        placeholder="Enter your preferred location"
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                        className="bg-white/70 border border-gray-300 text-sm py-1 px-3 h-8"
                      />
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
                              className="h-4 w-4 border-2 border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                            />
                            <Label htmlFor={type.id} className="flex items-center gap-1 cursor-pointer text-sm">
                              <Icon size={14} className="text-orange-500" />
                              {type.label}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="font-medium text-sm flex items-center gap-1">
                        <DollarSign size={14} className="text-orange-500" /> Expected Stipend (per month)
                      </Label>
                      <Input
                        type="number"
                        placeholder="e.g. 15000"
                        value={formData.preferences.stipend}
                        onChange={(e) => handlePreferenceChange("stipend", e.target.value)}
                        className="bg-white/70 border border-gray-300 text-sm py-1 px-3 h-8"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-medium text-sm">Region Type</Label>
                      <Select value={formData.preferences.regionType} onValueChange={(value) => handlePreferenceChange("regionType", value)}>
                        <SelectTrigger className="bg-white/70 border border-gray-300 text-sm py-1 px-3 h-8">
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
                <Button
                  onClick={handleSavePreferences}
                  disabled={savingPreferences}
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white"
                >
                  {savingPreferences ? "Saving..." : "Save and Continue"}
                </Button>
              </div>
            </GlassContainer>

            {/* Confirmation Section */}
            <GlassContainer className="p-5">
              <h2 className="text-xl font-bold mb-2">Final Confirmation</h2>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="confirmation"
                  checked={formData.confirmation}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, confirmation: !!checked }))}
                  className="h-4 w-4 border-2 border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
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
                className="px-6 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/20 transition-all duration-300 mr-3"
              >
                Clear Form
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={progress < 100 || !formData.confirmation || submitting}
                size="sm"
                className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
              >
                {submitting ? "Submitting..." : "Complete Profile"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
