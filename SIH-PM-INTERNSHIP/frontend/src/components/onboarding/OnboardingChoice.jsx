import { Upload, Edit3, CheckCircle } from "lucide-react";
import GlassContainer from "../glass-container";
import { Button } from "@/components/ui/button";

export default function OnboardingChoice({ formData, setFormData, onNext }) {
  const selectedOption = formData.onboardingChoice;

  const handleOptionSelect = (option) => {
    setFormData({
      ...formData,
      onboardingChoice: option,
    });
  };

  const handleContinue = () => {
    if (selectedOption) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6 font-[family-name:var(--font-merriweather)]">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              InternConnect
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-[family-name:var(--font-roboto)]">
            Your gateway to premium internship opportunities in India
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Upload Resume Option */}
          <GlassContainer
            variant="card"
            className={`p-8 h-full cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedOption === "upload"
                ? "ring-2 ring-primary shadow-xl shadow-primary/20"
                : "hover:shadow-xl"
            }`}
            onClick={() => handleOptionSelect("upload")}
          >
            <div className="text-center h-full flex flex-col">
              <div className="mb-6">
                <div
                  className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-colors ${
                    selectedOption === "upload"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Upload size={32} />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 font-[family-name:var(--font-merriweather)]">
                Upload Resume
              </h3>
              <p className="text-base md:text-lg text-muted-foreground mb-6 font-[family-name:var(--font-roboto)]">
                Upload your resume and we'll automatically fill out your profile
                with the extracted information. Quick and convenient!
              </p>
              <div className="mt-auto flex items-center justify-center gap-2">
                {selectedOption === "upload" && (
                  <CheckCircle className="text-primary" size={20} />
                )}
                <span className="text-sm font-medium">
                  {selectedOption === "upload" ? "Selected" : "Recommended"}
                </span>
              </div>
            </div>
          </GlassContainer>

          {/* Manual Entry Option */}
          <GlassContainer
            variant="card"
            className={`p-8 h-full cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedOption === "manual"
                ? "ring-2 ring-primary shadow-xl shadow-primary/20"
                : "hover:shadow-xl"
            }`}
            onClick={() => handleOptionSelect("manual")}
          >
            <div className="text-center h-full flex flex-col">
              <div className="mb-6">
                <div
                  className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-colors ${
                    selectedOption === "manual"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Edit3 size={32} />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 font-[family-name:var(--font-merriweather)]">
                Fill Manually
              </h3>
              <p className="text-base md:text-lg text-muted-foreground mb-6 font-[family-name:var(--font-roboto)]">
                Prefer to enter your information step by step? Fill out the
                forms manually with complete control over your data.
              </p>
              <div className="mt-auto flex items-center justify-center gap-2">
                {selectedOption === "manual" && (
                  <CheckCircle className="text-primary" size={20} />
                )}
                <span className="text-sm font-medium">
                  {selectedOption === "manual" ? "Selected" : "Alternative"}
                </span>
              </div>
            </div>
          </GlassContainer>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedOption}
            size="lg"
            className="px-12 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <div className="w-3 h-3 rounded-full bg-muted"></div>
          </div>
          <p className="text-sm text-muted-foreground">Step 1 of 6</p>
        </div>
      </div>
    </div>
  );
}
