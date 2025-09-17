import { useState, useEffect } from "react";
import OnboardingChoice from "../components/onboarding/OnboardingChoice";
import ResumeUpload from "../components/onboarding/ResumeUpload"; 
import ProfileSetup from "../components/onboarding/ProfileSetup";
import EducationDetails from "../components/onboarding/EducationDetails.jsx";
import SkillsCertifications from "../components/onboarding/SkillsCertifications"; 
import Preferences from "../components/onboarding/Preferences";
import ReviewSubmit from "../components/onboarding/ReviewSubmit"; 
import Home from "../components/onboarding/Home";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    onboardingChoice: null,
    resume: null,
    profile: {
      fullName: "",
      email: "user@example.com", // Pre-filled
      phone: "",
      dateOfBirth: "",
      gender: "",
    },
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    preferences: {
      sectors: [],
      locations: [],
      types: [],
      stipend: "",
      regionType: "",
    },
  });
  const [editingStep, setEditingStep] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("internconnect-formdata");
    const savedStep = localStorage.getItem("internconnect-step");
    const savedCompleted = localStorage.getItem("internconnect-completed");

    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
    if (savedStep) {
      setCurrentStep(Number.parseInt(savedStep, 10));
    }
    if (savedCompleted === "true") {
      setHasCompletedOnboarding(true);
      setCurrentStep(7); // Go directly to home
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("internconnect-formdata", JSON.stringify(formData));
    localStorage.setItem("internconnect-step", currentStep.toString());
  }, [formData, currentStep]);

  const steps = [
    OnboardingChoice,
    ResumeUpload, 
    ProfileSetup,
    EducationDetails,
    SkillsCertifications, 
    Preferences,
    ReviewSubmit, 
    Home,
  ];

  const handleNext = () => {
    if (editingStep !== null) {
      setCurrentStep(6);
      setEditingStep(null);
    } else if (currentStep === 0 && formData.onboardingChoice === "manual") {
      setCurrentStep(2);
    } else if (currentStep === 6) {
      setHasCompletedOnboarding(true);
      localStorage.setItem("internconnect-completed", "true");
      setCurrentStep(7);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    if (editingStep !== null) {
      setCurrentStep(6);
      setEditingStep(null);
    } else if (currentStep === 2 && formData.onboardingChoice === "manual") {
      setCurrentStep(0);
    } else if (currentStep === 7 && hasCompletedOnboarding) {
      return;
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleEdit = (step) => {
    setEditingStep(step);
    setCurrentStep(step);
  };

  const handleReset = () => {
    localStorage.removeItem("internconnect-formdata");
    localStorage.removeItem("internconnect-step");
    localStorage.removeItem("internconnect-completed");
    setCurrentStep(0);
    setEditingStep(null);
    setHasCompletedOnboarding(false);
    setFormData({
      onboardingChoice: null,
      resume: null,
      profile: {
        fullName: "",
        email: "user@example.com",
        phone: "",
        dateOfBirth: "",
        gender: "",
      },
      education: [],
      skills: [],
      certifications: [],
      projects: [],
      preferences: {
        sectors: [],
        locations: [],
        types: [],
        stipend: "",
        regionType: "",
      },
    });
  };

  const CurrentComponent = steps[currentStep];

  return (
    <div className="min-h-screen">
      <CurrentComponent
        formData={formData}
        setFormData={setFormData}
        onNext={handleNext}
        onBack={handleBack}
        onEdit={handleEdit}
        onReset={handleReset}
        isEditing={editingStep !== null}
        hasCompletedOnboarding={hasCompletedOnboarding}
      />
    </div>
  );
}
