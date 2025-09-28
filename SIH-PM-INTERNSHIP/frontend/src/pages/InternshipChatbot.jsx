import React, { useState } from "react";
import axios from "axios";

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
    <div className="max-w-4xl mx-auto p-6 bg-[#0A192F] rounded-lg shadow-xl border border-[#112240]">
      <h2 className="text-3xl font-bold text-center text-[#64FFDA] mb-4">
        Internship Preparation Assistant
      </h2>
      <p className="text-center text-[#8892B0] mb-8">
        Enter your desired internship domain and your current skills to get a
        personalized preparation guide with steps and resources.
      </p>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="internship-domain"
            className="block text-sm font-medium text-[#64FFDA] mb-2"
          >
            Internship Domain
          </label>
          <input
            id="internship-domain"
            type="text"
            placeholder="e.g., Web Development, Data Science, UI/UX, Marketing"
            value={internshipDomain}
            onChange={(e) => setInternshipDomain(e.target.value)}
            className="w-full px-4 py-3 bg-[#112240] border border-[#233554] rounded-lg 
                       focus:ring-2 focus:ring-[#64FFDA] focus:border-[#64FFDA] 
                       transition-colors text-[#CCD6F6] placeholder-[#8892B0]"
          />
        </div>

        <div>
          <label
            htmlFor="current-skills"
            className="block text-sm font-medium text-[#64FFDA] mb-2"
          >
            Current Skills
          </label>
          <input
            id="current-skills"
            type="text"
            placeholder="e.g., HTML, CSS, Python, Excel, Figma"
            value={currentSkills}
            onChange={(e) => setCurrentSkills(e.target.value)}
            className="w-full px-4 py-3 bg-[#112240] border border-[#233554] rounded-lg 
                       focus:ring-2 focus:ring-[#64FFDA] focus:border-[#64FFDA] 
                       transition-colors text-[#CCD6F6] placeholder-[#8892B0]"
          />
        </div>

        <button
          onClick={handleGenerateGuide}
          disabled={loading || !internshipDomain.trim() || !currentSkills.trim()}
          className="w-full bg-[#64FFDA] text-[#0A192F] py-3 px-6 rounded-lg font-semibold 
                     hover:bg-[#4CD8B2] disabled:bg-[#233554] disabled:text-[#8892B0] 
                     disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Generating..." : "Get Internship Guide"}
        </button>

        {error && (
          <div className="p-4 bg-[#112240] border border-[#233554] rounded-lg">
            <p className="text-[#FF6B6B]">{error}</p>
          </div>
        )}

        {guide && (
          <div className="mt-8 space-y-6">
            <h3 className="text-2xl font-bold text-[#64FFDA] border-b border-[#233554] pb-4">
              Internship Guide for {guide.internshipDomain}
            </h3>

            <div className="space-y-8">
              {Array.isArray(guide.steps) && guide.steps.length > 0 ? (
                guide.steps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-[#112240] p-6 rounded-lg border border-[#233554]"
                  >
                    <h4 className="text-xl font-semibold text-[#64FFDA] mb-3">
                      Step {index + 1}: {step.title}
                    </h4>
                    <p className="text-[#8892B0] mb-4">{step.description}</p>

                    {Array.isArray(step.substeps) && step.substeps.length > 0 && (
                      <ul className="space-y-3">
                        {step.substeps.map((substep, subIndex) => (
                          <li key={subIndex} className="flex items-start">
                            <span className="text-[#64FFDA] mr-2">•</span>
                            <div>
                              <strong className="text-[#CCD6F6]">
                                {substep.title}:
                              </strong>
                              <span className="text-[#8892B0] ml-2">
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
                <p className="text-[#FF6B6B]">⚠️ No guide steps available.</p>
              )}
            </div>

            {guide.resources &&
              Array.isArray(guide.resources) &&
              guide.resources.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-xl font-semibold text-[#64FFDA] mb-4">
                    📚 Recommended Resources
                  </h4>
                  <ul className="space-y-2">
                    {guide.resources.map((resource, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#64FFDA] mr-2">•</span>
                        {resource.url ? (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#64FFDA] hover:text-[#4CD8B2] hover:underline"
                          >
                            {resource.name}
                          </a>
                        ) : (
                          <span className="text-[#8892B0]">{resource.name}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipChatbot;
