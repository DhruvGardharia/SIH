import { useState, useCallback } from "react"
import { Upload, FileText, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import GlassContainer from "@/components/glass-container"

export default function ResumeUpload({ formData, setFormData, onNext, onBack, isEditing }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(formData.resume)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]
        if (file.type === "application/pdf" || file.type.includes("document")) {
          setUploadedFile(file)
          setFormData({ ...formData, resume: file })
        }
      }
    },
    [formData, setFormData]
  )

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadedFile(file)
      setFormData({ ...formData, resume: file })
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setFormData({ ...formData, resume: null })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-[family-name:var(--font-merriweather)]">
            Upload Your Resume
          </h1>
          <p className="text-lg text-muted-foreground font-[family-name:var(--font-roboto)]">
            Upload your resume to auto-fill your profile information
          </p>
        </div>

        {/* Upload Area */}
        <GlassContainer variant="card" className="p-8 mb-8">
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive ? "border-primary bg-primary/5 scale-105" : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                  <Upload size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Drop your resume here</h3>
                <p className="text-muted-foreground mb-4">or click to browse your files</p>
                <p className="text-sm text-muted-foreground">Supports PDF and DOCX files up to 10MB</p>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInput}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload">
                <Button variant="outline" className="cursor-pointer bg-transparent">
                  Choose File
                </Button>
              </label>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 p-6 bg-muted/30 rounded-lg mb-6">
                <FileText size={32} className="text-primary" />
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-foreground">{uploadedFile.name}</h4>
                  <p className="text-sm text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-secondary" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-destructive hover:text-destructive"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Resume uploaded successfully! We'll extract your information automatically.
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInput}
                className="hidden"
                id="resume-replace"
              />
              <label htmlFor="resume-replace">
                <Button variant="outline" className="cursor-pointer bg-transparent">
                  Replace File
                </Button>
              </label>
            </div>
          )}
        </GlassContainer>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onBack} className="px-8 bg-transparent">
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!uploadedFile}
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
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <div className="w-3 h-3 rounded-full bg-muted"></div>
          </div>
          <p className="text-sm text-muted-foreground">Step 2 of 6</p>
        </div>
      </div>
    </div>
  )
}
