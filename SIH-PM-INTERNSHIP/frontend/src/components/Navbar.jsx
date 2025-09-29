import React from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { Briefcase, BarChart2, UserCircle, Bell, Settings, MessageSquare } from "lucide-react";

const Navbar = () => {
  const { user } = UserData();
  const navigate = useNavigate();

  return (
    <nav
      className="px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderBottom: "1px solid rgba(255, 153, 51, 0.2)",
      }}
    >
      {/* Left side with the logo and title */}
      <div className="flex items-center space-x-4">
        {/* Ashoka Chakra-inspired Icon */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
        >
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ backgroundColor: "#000080" }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8a1 1 0 112 0 1 1 0 01-2 0zm1-5a1 1 0 011 1v3a1 1 0 01-2 0V5a1 1 0 011-1z" />
            </svg>
          </div>
          <h1
            className="text-xl font-bold"
            style={{
              fontFamily: "Playfair Display, serif",
              background: "linear-gradient(135deg, #FF9933 0%, #138808 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            InternConnect
          </h1>
        </button>
      </div>

      {/* Center navigation links */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/internships")}
          className="flex items-center gap-2 text-gray-700 hover:text-green-700 font-medium transition-colors"
        >
          <Briefcase className="w-5 h-5" />
          <span>Recommended Internships</span>
        </button>
        <button
          onClick={() => navigate("/internshipdashboard")}
          className="flex items-center gap-2 text-gray-700 hover:text-green-700 font-medium transition-colors"
        >
          <BarChart2 className="w-5 h-5" />
          <span>Market Analysis</span>
        </button>
        <button
          onClick={() => navigate("/internship-chatbot")}
          className="flex items-center gap-2 text-gray-700 hover:text-green-700 font-medium transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Internship Assist</span>
        </button>
        <button
          onClick={() => navigate("/userprofile")}
          className="flex items-center gap-2 text-gray-700 hover:text-green-700 font-medium transition-colors"
        >
          <UserCircle className="w-5 h-5" />
          <span>User Profile</span>
        </button>
      </div>

      {/* Right side with user info and icons */}
      <div className="flex items-center gap-5">
        <span
          className="font-medium text-gray-700"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Welcome, {user?.name || "Guest"}
        </span>

        {/* Notification Bell */}
        <button className="relative text-gray-600 hover:text-green-700 transition">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings */}
        <button
          onClick={() => navigate("/settings")}
          className="text-gray-600 hover:text-green-700 transition"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;