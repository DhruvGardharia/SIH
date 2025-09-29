import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserData } from "../context/UserContext";

const UserProfile = () => {
  const { user, loading, logoutUser } = UserData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(to right, rgba(255,153,51,0.15) 0%, rgba(255,255,255,0.95) 33%, rgba(255,255,255,0.95) 67%, rgba(19,136,8,0.15) 100%)",
        }}
      >
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-12 bg-white/90 rounded-2xl shadow-lg border border-orange-100/50">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 mx-auto mb-4"
                 style={{ borderTopColor: "#FF9933", borderRightColor: "#138808" }}>
            </div>
            <span className="text-xl font-semibold" style={{ fontFamily: "Inter, sans-serif", color: "#1F2937" }}>
              Loading Profile...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(to right, rgba(255,153,51,0.15) 0%, rgba(255,255,255,0.95) 33%, rgba(255,255,255,0.95) 67%, rgba(19,136,8,0.15) 100%)",
        }}
      >
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-12 bg-white/90 rounded-2xl shadow-lg border border-orange-100/50">
            <span className="text-xl font-semibold text-red-600" style={{ fontFamily: "Inter, sans-serif" }}>
              Unable to load profile data
            </span>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "👤" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "projects", label: "Projects", icon: "💼" },
    { id: "skills", label: "Skills & Certs", icon: "⚡" },
    { id: "preferences", label: "Preferences", icon: "⚙️" }
  ];

  return (
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

      <Navbar />

      <main className="p-6 flex-grow relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="rounded-2xl shadow-lg p-8 mb-8 bg-white/95 backdrop-blur-md border border-orange-100/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg text-3xl font-bold text-white"
                  style={{ 
                    background: "linear-gradient(135deg, #FF9933 0%, #FF6B35 100%)",
                  }}
                >
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                
                <div className="flex-1">
                  <h1
                    className="text-4xl font-bold mb-2"
                    style={{ 
                      fontFamily: "Playfair Display, serif", 
                      background: "linear-gradient(135deg, #1F2937 0%, #374151 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}
                  >
                    {user.name || "User"}
                  </h1>
                  
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <span className="flex items-center space-x-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span style={{ fontFamily: "Inter, sans-serif" }}>{user.email}</span>
                    </span>
                    
                    {user.phone && (
                      <span className="flex items-center space-x-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span style={{ fontFamily: "Inter, sans-serif" }}>{user.phone}</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-1 rounded-full bg-orange-400"></div>
                    <div className="w-8 h-1 rounded-full bg-blue-500"></div>
                    <div className="w-3 h-1 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
              
              {/* Top Right Menu */}
              <div className="flex items-center space-x-4">
                <div className="text-right text-sm text-gray-500">
                  <p>Member since</p>
                  <p className="font-medium">{formatDate(user.createdAt)}</p>
                </div>
                
                {/* Settings Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => logoutUser(navigate)}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    title="Logout"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Completion Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "Inter, sans-serif", color: "#1F2937" }}>
                    Complete Your Profile
                  </h3>
                  
                  <div className="flex items-center space-x-6 mb-4">
                    {/* Profile Completion Progress */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <div className={`w-3 h-3 rounded-full ${user.stepsCompleted?.basic ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm text-gray-600">Basic</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-3 h-3 rounded-full ${user.stepsCompleted?.education ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm text-gray-600">Education</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-3 h-3 rounded-full ${user.stepsCompleted?.preferences ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm text-gray-600">Preferences</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-3 h-3 rounded-full ${user.stepsCompleted?.projectsCerts ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm text-gray-600">Projects</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-3 h-3 rounded-full ${user.resumeFile ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm text-gray-600">Resume</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                    {user.resumeFile ? 
                      "Your profile is looking great! Keep it updated to get better internship recommendations." :
                      "Complete your profile and upload your resume to unlock personalized internship recommendations."
                    }
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Resume Section */}
                  {user.resumeFile ? (
                    <div className="flex items-center space-x-3">
                      <a
                        href={user.resumeFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-lg transition-colors duration-200 text-sm font-medium"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>View Resume</span>
                      </a>
                    </div>
                  ) : (
                    <div className="text-center px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm">
                      <span style={{ fontFamily: "Inter, sans-serif" }}>No resume uploaded</span>
                    </div>
                  )}

                  {/* Complete Profile Button */}
                  <button
                    onClick={() => navigate('/onboardingForm')}
                    className="group flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #138808 0%, #059669 100%)",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Update Profile</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg mb-8 border border-orange-100/50">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-max px-6 py-4 text-center font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-gray-600 hover:text-orange-600"
                  }`}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    background: activeTab === tab.id 
                      ? "linear-gradient(135deg, #FF9933 0%, #FF6B35 100%)"
                      : "transparent",
                    borderRadius: activeTab === tab.id ? "1rem" : "0",
                    margin: activeTab === tab.id ? "0.5rem" : "0"
                  }}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-orange-100/50">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "Playfair Display, serif", color: "#1F2937" }}>
                  Profile Overview
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-orange-50/50 rounded-xl border border-orange-100">
                    <h3 className="text-xl font-semibold mb-3 text-orange-800" style={{ fontFamily: "Inter, sans-serif" }}>
                      Personal Information
                    </h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Date of Birth:</span> {formatDate(user.dob)}</p>
                      <p><span className="font-medium">Gender:</span> {user.gender || "Not specified"}</p>
                      <p><span className="font-medium">Expected Stipend:</span> {formatCurrency(user.expectedStipend)}</p>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-green-50/50 rounded-xl border border-green-100">
                    <h3 className="text-xl font-semibold mb-3 text-green-800" style={{ fontFamily: "Inter, sans-serif" }}>
                      Profile Completion
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Basic Info</span>
                        <span className={user.stepsCompleted?.basic ? "text-green-600" : "text-red-600"}>
                          {user.stepsCompleted?.basic ? "✓" : "✗"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Education</span>
                        <span className={user.stepsCompleted?.education ? "text-green-600" : "text-red-600"}>
                          {user.stepsCompleted?.education ? "✓" : "✗"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Preferences</span>
                        <span className={user.stepsCompleted?.preferences ? "text-green-600" : "text-red-600"}>
                          {user.stepsCompleted?.preferences ? "✓" : "✗"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Projects & Certs</span>
                        <span className={user.stepsCompleted?.projectsCerts ? "text-green-600" : "text-red-600"}>
                          {user.stepsCompleted?.projectsCerts ? "✓" : "✗"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "Playfair Display, serif", color: "#1F2937" }}>
                  Educational Background
                </h2>
                
                {user.education && user.education.length > 0 ? (
                  <div className="grid gap-6">
                    {user.education
                      .filter(edu => edu.degreeName || edu.collegeName)
                      .map((edu, index) => (
                        <div key={index} className="p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-blue-50/30 to-purple-50/30">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-blue-800 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                                {edu.degreeName || "Degree"}
                              </h3>
                              <p className="text-lg text-gray-700 mb-1">{edu.collegeName || "Institution"}</p>
                              {edu.yearOfStudy && (
                                <p className="text-gray-600">Year: {edu.yearOfStudy}</p>
                              )}
                              {edu.cgpa && (
                                <p className="text-gray-600">CGPA: {edu.cgpa}</p>
                              )}
                              {edu.educationLevel && (
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mt-2">
                                  {edu.educationLevel}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No education information available</p>
                )}
              </div>
            )}

            {activeTab === "projects" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "Playfair Display, serif", color: "#1F2937" }}>
                  Projects Portfolio
                </h2>
                
                {user.projects && user.projects.length > 0 ? (
                  <div className="grid gap-6">
                    {user.projects.map((project, index) => (
                      <div key={index} className="p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-green-50/30 to-teal-50/30">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-semibold text-green-800" style={{ fontFamily: "Inter, sans-serif" }}>
                            {project.title}
                          </h3>
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                        <p className="text-gray-700 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                          {project.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No projects available</p>
                )}
              </div>
            )}

            {activeTab === "skills" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "Playfair Display, serif", color: "#1F2937" }}>
                  Skills & Certifications
                </h2>
                
                {/* Skills Section */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-purple-800" style={{ fontFamily: "Inter, sans-serif" }}>
                    Technical Skills
                  </h3>
                  {user.skills && user.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {user.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No skills listed</p>
                  )}
                </div>

                {/* Certifications Section */}
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-orange-800" style={{ fontFamily: "Inter, sans-serif" }}>
                    Certifications
                  </h3>
                  {user.certifications && user.certifications.length > 0 ? (
                    <div className="grid gap-4">
                      {user.certifications.map((cert, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-orange-50/50 to-yellow-50/50 border border-orange-200 rounded-xl">
                          <p className="text-orange-800 font-medium">{cert}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No certifications available</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "Playfair Display, serif", color: "#1F2937" }}>
                  Career Preferences
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200 rounded-xl">
                    <h3 className="text-xl font-semibold mb-3 text-blue-800" style={{ fontFamily: "Inter, sans-serif" }}>
                      Preferred Sectors
                    </h3>
                    {user.preferredSectors && user.preferredSectors.length > 0 ? (
                      <div className="space-y-2">
                        {user.preferredSectors.map((sector, index) => (
                          <span key={index} className="block px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                            {sector}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Not specified</p>
                    )}
                  </div>

                  <div className="p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 border border-green-200 rounded-xl">
                    <h3 className="text-xl font-semibold mb-3 text-green-800" style={{ fontFamily: "Inter, sans-serif" }}>
                      Preferred Locations
                    </h3>
                    {user.preferredLocations && user.preferredLocations.length > 0 ? (
                      <div className="space-y-2">
                        {user.preferredLocations.map((location, index) => (
                          <span key={index} className="block px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                            {location}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Not specified</p>
                    )}
                  </div>

                  <div className="p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-200 rounded-xl">
                    <h3 className="text-xl font-semibold mb-3 text-purple-800" style={{ fontFamily: "Inter, sans-serif" }}>
                      Internship Types
                    </h3>
                    {user.internshipTypes && user.internshipTypes.length > 0 ? (
                      <div className="space-y-2">
                        {user.internshipTypes.map((type, index) => (
                          <span key={index} className="block px-3 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
                            {type}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Not specified</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-white/95 backdrop-blur-md border-t border-orange-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-0.5 bg-gradient-to-r from-orange-400 to-orange-300 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-400 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
              </div>
              <div className="w-8 h-0.5 bg-gradient-to-l from-green-400 to-green-300 rounded-full"></div>
            </div>
            
            <div className="text-center">
              <p
                className="text-lg font-semibold"
                style={{ 
                  fontFamily: "Playfair Display, serif", 
                  background: "linear-gradient(135deg, #FF9933 0%, #138808 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                भारत सरकार | Government of India
              </p>
              <p
                className="text-sm text-gray-500 mt-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Skill Development & Entrepreneurship Initiative
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserProfile;