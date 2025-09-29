import React, { useRef } from "react";
import { Briefcase, MapPin, Clock } from "lucide-react";

// Cards component for internships
const Cards = ({ internship }) => {
  return (
    <div
      className="flex-shrink-0 w-80 rounded-xl p-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
      }}
    >
      {/* Title */}
      <h3
        className="text-lg font-semibold mb-2"
        style={{ fontFamily: "Merriweather, serif", color: "#0A2342" }}
      >
        {internship.title}
      </h3>

      {/* Company */}
      <p
        className="mb-2 text-sm font-medium"
        style={{ fontFamily: "Roboto, sans-serif", color: "#374151" }}
      >
        <Briefcase className="inline w-4 h-4 mr-1 text-gray-500" />
        {internship.company}
      </p>

      {/* Location */}
      <p
        className="text-sm mb-2"
        style={{ fontFamily: "Roboto, sans-serif", color: "#6B7280" }}
      >
        <MapPin className="inline w-4 h-4 mr-1 text-gray-400" />
        {internship.location}
      </p>

      {/* Duration */}
      <p
        className="text-sm mb-4"
        style={{ fontFamily: "Roboto, sans-serif", color: "#6B7280" }}
      >
        <Clock className="inline w-4 h-4 mr-1 text-gray-400" />
        {internship.duration || "Flexible"}
      </p>

      {/* Button */}
      <button
        className="w-full py-2 rounded-lg text-white font-medium transition-all duration-200 shadow hover:shadow-md"
        style={{
          backgroundColor: "#FF9933",
          fontFamily: "Roboto, sans-serif",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#e67e22")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#FF9933")}
      >
        View Details
      </button>
    </div>
  );
};

// Main HomeCards component
const HomeCards = ({ internships, isRecommended = false }) => {
  const scrollContainerRef = useRef(null);

  // Hardcoded popular internships
  const popularInternships = [
    {
      id: 6,
      title: "Business Analyst Intern",
      company: "Accenture",
      location: "Pune, Maharashtra",
      duration: "4 months",
    },
    {
      id: 7,
      title: "Content Writing Intern",
      company: "Mindtree",
      location: "Bangalore, Karnataka",
      duration: "3 months",
    },
    {
      id: 8,
      title: "Mobile App Development Intern",
      company: "Cognizant",
      location: "Chennai, Tamil Nadu",
      duration: "6 months",
    },
    {
      id: 9,
      title: "Financial Analyst Intern",
      company: "Capgemini",
      location: "Mumbai, Maharashtra",
      duration: "5 months",
    },
    {
      id: 10,
      title: "Cloud Computing Intern",
      company: "IBM India",
      location: "Bangalore, Karnataka",
      duration: "6 months",
    },
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: "smooth",
      });
    }
  };

  // Use provided internships for recommended, hardcoded for popular
  const displayInternships = isRecommended ? internships : popularInternships;

  if (!displayInternships || displayInternships.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
          No internships available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-6 z-10">
        <button
          onClick={scrollLeft}
          className="w-12 h-12 rounded-full bg-white shadow-lg border border-orange-200 flex items-center justify-center text-gray-600 hover:text-orange-600 hover:border-orange-400 transition-all duration-300 hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 -right-6 z-10">
        <button
          onClick={scrollRight}
          className="w-12 h-12 rounded-full bg-white shadow-lg border border-orange-200 flex items-center justify-center text-gray-600 hover:text-orange-600 hover:border-orange-400 transition-all duration-300 hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4"
      >
        {displayInternships.map((internship) => (
          <Cards key={internship.id} internship={internship} />
        ))}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default HomeCards;
