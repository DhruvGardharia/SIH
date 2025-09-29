import React from "react";
import { Briefcase, MapPin, Clock } from "lucide-react";

const Cards = ({ internship }) => {
  return (
    <div
      className="rounded-xl p-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
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

export default Cards;
