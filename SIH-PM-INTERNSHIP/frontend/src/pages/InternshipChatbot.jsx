import React, { useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

const InternshipChatbot = () => {
    const [internshipDomain, setInternshipDomain] = useState("");
    const [currentSkills, setCurrentSkills] = useState("");
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerateGuide = async () => {
        if (!internshipDomain.trim() || !currentSkills.trim()) {
            setError("Please provide both an internship domain and your current skills.");
            return;
        }

        setLoading(true);
        setError("");
        setGuide(null);

        try {
            console.log("🟢 Sending Request to AI:", { internshipDomain, currentSkills });

            const response = await axios.post(
                "/api/chatbot/internship-helper",
                { internshipDomain, currentSkills },
                { withCredentials: true }
            );

            console.log("🟢 Response Received:", response.data);
            setGuide(response.data);
        } catch (error) {
            console.error("❌ Error generating internship guide", error);
            setError(
                error.response?.data?.error ||
                "Failed to generate internship guide. Please try again with a specific domain."
            );
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div
                className="flex-grow flex flex-col"
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
                    <div className="max-w-5xl mx-auto">

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
                                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
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
                                    Internship Preparation Assistant
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
                                Enter your desired internship domain and your current skills to get a
                                <span className="font-medium text-orange-600"> personalized preparation guide with steps and resources.</span>
                            </p>
                        </div>

                        {/* Input Form Section */}
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-8 mb-8 border border-orange-100/50">
                            <div className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="internship-domain"
                                        className="block text-sm font-semibold mb-2"
                                        style={{ fontFamily: "Inter, sans-serif", color: "#1F2937" }}
                                    >
                                        Internship Domain
                                    </label>
                                    <input
                                        id="internship-domain"
                                        type="text"
                                        placeholder="e.g., Web Development, Data Science, UI/UX, Marketing"
                                        value={internshipDomain}
                                        onChange={(e) => setInternshipDomain(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl 
                             focus:ring-2 focus:ring-orange-400 focus:border-orange-400 
                             transition-all text-gray-800 placeholder-gray-400"
                                        style={{ fontFamily: "Inter, sans-serif" }}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="current-skills"
                                        className="block text-sm font-semibold mb-2"
                                        style={{ fontFamily: "Inter, sans-serif", color: "#1F2937" }}
                                    >
                                        Current Skills
                                    </label>
                                    <input
                                        id="current-skills"
                                        type="text"
                                        placeholder="e.g., HTML, CSS, Python, Excel, Figma"
                                        value={currentSkills}
                                        onChange={(e) => setCurrentSkills(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl 
                             focus:ring-2 focus:ring-orange-400 focus:border-orange-400 
                             transition-all text-gray-800 placeholder-gray-400"
                                        style={{ fontFamily: "Inter, sans-serif" }}
                                    />
                                </div>

                                <button
                                    onClick={handleGenerateGuide}
                                    disabled={loading || !internshipDomain.trim() || !currentSkills.trim()}
                                    className="w-full py-4 px-6 rounded-xl font-semibold text-white 
                           transition-all duration-300 shadow-lg hover:shadow-xl 
                           transform hover:-translate-y-1 disabled:opacity-50 
                           disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
                                    style={{
                                        background: loading || (!internshipDomain.trim() || !currentSkills.trim())
                                            ? "#D1D5DB"
                                            : "linear-gradient(135deg, #FF9933 0%, #FF6B35 100%)",
                                        fontFamily: "Inter, sans-serif",
                                    }}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            <span>Generating Your Guide...</span>
                                        </span>
                                    ) : (
                                        "Get Internship Guide"
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="p-8 text-center rounded-2xl shadow-lg bg-red-50/80 border border-red-200/50 backdrop-blur-md mb-8">
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
                                    Unable to Generate Guide
                                </div>
                                <p
                                    className="text-gray-600"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Guide Display Section */}
                        {guide && (
                            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-orange-100/50">
                                <div className="mb-8 pb-6 border-b border-gray-200">
                                    <h3
                                        className="text-3xl font-bold text-center"
                                        style={{
                                            fontFamily: "Playfair Display, serif",
                                            background: "linear-gradient(135deg, #FF9933 0%, #138808 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text"
                                        }}
                                    >
                                        Your Internship Roadmap
                                    </h3>
                                    <p
                                        className="text-center text-gray-600 mt-2"
                                        style={{ fontFamily: "Inter, sans-serif" }}
                                    >
                                        {guide.internshipDomain}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {Array.isArray(guide.steps) && guide.steps.length > 0 ? (
                                        guide.steps.map((step, index) => (
                                            <div
                                                key={index}
                                                className="bg-gradient-to-br from-orange-50/50 to-green-50/50 p-6 rounded-xl border border-orange-200/50 shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-start mb-4">
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-md"
                                                        style={{
                                                            background: "linear-gradient(135deg, #FF9933 0%, #FF6B35 100%)",
                                                        }}
                                                    >
                                                        <span className="text-white font-bold" style={{ fontFamily: "Inter, sans-serif" }}>
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h4
                                                            className="text-xl font-bold mb-2"
                                                            style={{ fontFamily: "Playfair Display, serif", color: "#1F2937" }}
                                                        >
                                                            {step.title}
                                                        </h4>
                                                        <p
                                                            className="text-gray-700 leading-relaxed"
                                                            style={{ fontFamily: "Inter, sans-serif" }}
                                                        >
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                {Array.isArray(step.substeps) && step.substeps.length > 0 && (
                                                    <ul className="space-y-3 ml-14">
                                                        {step.substeps.map((substep, subIndex) => (
                                                            <li key={subIndex} className="flex items-start">
                                                                <span className="text-orange-500 mr-3 mt-1 flex-shrink-0">•</span>
                                                                <div>
                                                                    <strong
                                                                        className="text-gray-800"
                                                                        style={{ fontFamily: "Inter, sans-serif" }}
                                                                    >
                                                                        {substep.title}:
                                                                    </strong>
                                                                    <span
                                                                        className="text-gray-600 ml-2"
                                                                        style={{ fontFamily: "Inter, sans-serif" }}
                                                                    >
                                                                        {substep.description}
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center p-8 bg-orange-50/50 rounded-xl border border-orange-200/50">
                                            <p
                                                className="text-orange-700 font-medium"
                                                style={{ fontFamily: "Inter, sans-serif" }}
                                            >
                                                ⚠️ No guide steps available.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {guide.resources &&
                                    Array.isArray(guide.resources) &&
                                    guide.resources.length > 0 && (
                                        <div className="mt-8 pt-8 border-t border-gray-200">
                                            <h4
                                                className="text-2xl font-bold mb-6 flex items-center"
                                                style={{ fontFamily: "Playfair Display, serif", color: "#1F2937" }}
                                            >
                                                <span className="mr-3">📚</span>
                                                Recommended Resources
                                            </h4>
                                            <ul className="space-y-3">
                                                {guide.resources.map((resource, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="text-green-600 mr-3 mt-1">•</span>
                                                        {resource.url ? (
                                                            <a
                                                                href={resource.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-orange-600 hover:text-orange-700 hover:underline font-medium transition-colors"
                                                                style={{ fontFamily: "Inter, sans-serif" }}
                                                            >
                                                                {resource.name}
                                                            </a>
                                                        ) : (
                                                            <span
                                                                className="text-gray-700"
                                                                style={{ fontFamily: "Inter, sans-serif" }}
                                                            >
                                                                {resource.name}
                                                            </span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-8 bg-white/95 backdrop-blur-md border-t border-orange-100/50 mt-auto">
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
        </div>
    );
};

export default InternshipChatbot;