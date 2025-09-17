import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Building2,
  ExternalLink,
  User,
  GraduationCap,
  Target,
  Settings,
  Briefcase,
  Star,
  Filter,
  RefreshCw,
  Heart,
  CheckCircle,
} from "lucide-react";

const API_BASE = "http://localhost:8000"; // Adjust this to your backend URL

const App = () => {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("recommendations");
  const [savedInternships, setSavedInternships] = useState([]);

  // Fetch user profile on mount
  useEffect(() => {
    fetchUser();
    fetchRecommendations();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/user`);
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/recommendations?top_n=5`);
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (internship) => {
    setSavedInternships((prev) => {
      const isSaved = prev.some((item) => item.id === internship.id);
      if (isSaved) {
        return prev.filter((item) => item.id !== internship.id);
      } else {
        return [...prev, internship];
      }
    });
  };

  const isSaved = (internshipId) => {
    return savedInternships.some((item) => item.id === internshipId);
  };

  const InternshipCard = ({ internship, showSaveButton = true }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-orange-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {internship.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Building2 className="h-4 w-4 mr-2" />
            <span className="font-medium">{internship.company}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{internship.location}</span>
          </div>
        </div>
        {showSaveButton && (
          <button
            onClick={() => toggleSave(internship)}
            className={`p-2 rounded-full transition-colors ${
              isSaved(internship.id)
                ? "text-red-500 hover:text-red-600"
                : "text-gray-400 hover:text-red-500"
            }`}
          >
            <Heart
              className={`h-5 w-5 ${
                isSaved(internship.id) ? "fill-current" : ""
              }`}
            />
          </button>
        )}
      </div>

      <div className="mb-4">
        <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
          {internship.sector}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {internship.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {internship.explanation && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 italic">
            "{internship.explanation}"
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <Star className="h-4 w-4 mr-1" />
          <span>AI Recommended</span>
        </div>
        <a
          href={internship.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center"
        >
          Apply Now <ExternalLink className="h-4 w-4 ml-2" />
        </a>
      </div>
    </div>
  );

  const UserProfile = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center mb-6">
        <div className="bg-navy-100 p-3 rounded-full mr-4">
          <User className="h-6 w-6 text-navy-700" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center mb-3">
            <GraduationCap className="h-5 w-5 mr-2 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Education</h3>
          </div>
          <p className="text-gray-700 ml-7">{user?.education}</p>
        </div>

        <div>
          <div className="flex items-center mb-3">
            <Target className="h-5 w-5 mr-2 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2 ml-7">
            {user?.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center mb-3">
            <Briefcase className="h-5 w-5 mr-2 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Sector Interests</h3>
          </div>
          <div className="flex flex-wrap gap-2 ml-7">
            {user?.sector_interests.map((sector, index) => (
              <span
                key={index}
                className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm"
              >
                {sector}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center mb-3">
            <MapPin className="h-5 w-5 mr-2 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Location</h3>
          </div>
          <p className="text-gray-700 ml-7">{user?.location}</p>
        </div>

        {user?.career_goals && (
          <div>
            <div className="flex items-center mb-3">
              <Target className="h-5 w-5 mr-2 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Career Goals</h3>
            </div>
            <p className="text-gray-700 ml-7">{user.career_goals}</p>
          </div>
        )}

        {user?.preferences && (
          <div>
            <div className="flex items-center mb-3">
              <Settings className="h-5 w-5 mr-2 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Preferences</h3>
            </div>
            <div className="ml-7">
              {user.preferences.remote && (
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                  <span>Prefers remote work</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="bg-navy-900 text-white shadow-lg"
        style={{ backgroundColor: "#0A2342" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">InternMatch</h1>
              <p className="text-navy-200 mt-1">
                AI-Powered Internship Recommendations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-navy-200">{user.email}</p>
              </div>
              <div
                className="bg-orange-500 p-2 rounded-full"
                style={{ backgroundColor: "#FF9933" }}
              >
                <User className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("recommendations")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "recommendations"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Recommendations
              </div>
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "saved"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Saved ({savedInternships.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "recommendations" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Recommended for You
                </h2>
                <p className="text-gray-600 mt-1">
                  AI-curated internships based on your profile and preferences
                </p>
              </div>
              <button
                onClick={fetchRecommendations}
                disabled={loading}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center disabled:opacity-50"
                style={{ backgroundColor: loading ? "#FF9933" : "#FF9933" }}
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-6 animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {recommendations.map((internship, index) => (
                  <InternshipCard
                    key={internship.id || index}
                    internship={internship}
                  />
                ))}
                {recommendations.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No recommendations found. Try refreshing!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Saved Internships
              </h2>
              <p className="text-gray-600 mt-1">
                Your bookmarked opportunities ({savedInternships.length})
              </p>
            </div>

            {savedInternships.length > 0 ? (
              <div className="space-y-6">
                {savedInternships.map((internship) => (
                  <InternshipCard
                    key={internship.id}
                    internship={internship}
                    showSaveButton={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No saved internships yet.</p>
                <p className="text-gray-500 text-sm">
                  Save internships from your recommendations to see them here!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && <UserProfile />}
      </main>
    </div>
  );
};

export default App;
