import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";

const InternshipRecommender = () => {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const resp = await fetch(`/api/user/recommendations?top_n=8`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        setRecs(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message || "Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="p-6 flex-grow relative z-10">
        <div className="max-w-7xl mx-auto">

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
                className="text-4xl font-bold"
                style={{ 
                  fontFamily: "Playfair Display, serif", 
                  background: "linear-gradient(135deg, #1F2937 0%, #374151 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                Curated Opportunities
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
              className="text-lg max-w-3xl mx-auto leading-relaxed"
              style={{ 
                fontFamily: "Inter, sans-serif", 
                color: "#4B5563",
                lineHeight: "1.7"
              }}
            >
              Discover handpicked internship opportunities that align with your aspirations and skills. 
              <span className="font-medium text-orange-600"> Your journey to professional excellence begins here.</span>
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-12 text-center bg-white/90 rounded-2xl shadow-lg border border-orange-100/50">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div
                    className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200"
                    style={{ borderTopColor: "#FF9933", borderRightColor: "#138808" }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="text-center">
                  <span
                    className="text-xl font-semibold block"
                    style={{ fontFamily: "Inter, sans-serif", color: "#1F2937" }}
                  >
                    Finding Perfect Matches
                  </span>
                  <span
                    className="text-sm text-gray-500 mt-1 block"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Analyzing your preferences...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-8 text-center rounded-2xl shadow-lg bg-red-50/80 border border-red-200/50 backdrop-blur-md">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div
                className="text-xl font-semibold mb-2"
                style={{ fontFamily: "Inter, sans-serif", color: "#DC2626" }}
              >
                Unable to Load Recommendations
              </div>
              <p 
                className="text-gray-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Internship Cards */}
          {!loading && !error && (
            <>
              {recs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {recs.map((it, idx) => (
                    <Cards key={it.id || idx} internship={it} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-12 bg-white/90 rounded-2xl shadow-lg border border-orange-100/50 backdrop-blur-md">
                  <div className="mb-6">
                    <div 
                      className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg"
                      style={{ 
                        background: "linear-gradient(135deg, #FF9933 0%, #138808 100%)",
                      }}
                    >
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ 
                      fontFamily: "Playfair Display, serif", 
                      color: "#1F2937"
                    }}
                  >
                    Complete Your Professional Profile
                  </h3>
                  
                  <p
                    className="mb-8 max-w-md mx-auto text-gray-600 leading-relaxed"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Help us understand your skills, interests, and career goals to unlock 
                    personalized internship recommendations tailored just for you.
                  </p>
                  
                  <button
                    className="group px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #138808 0%, #059669 100%)",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Complete Profile</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-white/95 backdrop-blur-md border-t border-orange-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Decorative Element */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-0.5 bg-gradient-to-r from-orange-400 to-orange-300 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-400 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
              </div>
              <div className="w-8 h-0.5 bg-gradient-to-l from-green-400 to-green-300 rounded-full"></div>
            </div>
            
            {/* Footer Text */}
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

export default InternshipRecommender;