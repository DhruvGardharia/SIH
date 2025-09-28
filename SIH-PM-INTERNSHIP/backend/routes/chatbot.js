import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyDZUXAxZIuhKadt6FMwpfsCnYpNfEXW82k"); // Replace with your key

router.post("/internship-helper", async (req, res) => {
  try {
    const { internshipDomain, currentSkills } = req.body;

    // Basic validation
    if (!internshipDomain || !currentSkills) {
      return res.status(400).json({ error: "Internship domain and current skills are required." });
    }

    if (internshipDomain.length < 3 || currentSkills.length < 3) {
      return res.status(400).json({ error: "Please provide meaningful inputs for domain and skills." });
    }

    // Validate domain keywords
    const validDomains = [
      "software", "web", "data", "ui", "ux", "design", "marketing",
      "finance", "product", "ml", "ai", "devops", "cloud"
    ];

    const isLikelyValidDomain =
      validDomains.some(keyword => internshipDomain.toLowerCase().includes(keyword)) ||
      internshipDomain.split(" ").length >= 2;

    if (!isLikelyValidDomain) {
      return res.status(400).json({
        error: "Please enter a valid internship domain related to a professional field."
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prompt
    const prompt = `
      Generate a structured preparation and resource guide for someone looking for an internship in "${internshipDomain}" 
      who currently has skills in: "${currentSkills}".

      Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
      {
        "internshipDomain": "${internshipDomain}",
        "steps": [
          {
            "title": "Step title",
            "description": "Brief overview",
            "substeps": [
              {
                "title": "Specific action",
                "description": "What to learn or do"
              }
            ]
          }
        ],
        "resources": [
          {
            "name": "Resource Name",
            "url": "https://example.com"
          }
        ]
      }

      Include 3–5 main steps with 3–5 substeps each, covering skill improvement, resume/portfolio building, 
      application strategy, interview preparation, and networking. Provide 3–6 resources such as internship portals, guides, and courses.
    `;

    // ✅ Use simple string prompt like your working roadmap example
    const result = await model.generateContent(prompt);
    let roadmapText = result.response.text();

    // Clean JSON
    roadmapText = roadmapText
      .replace(/```json|```/g, "")
      .replace(/^\s*\{/m, "{")
      .replace(/\}\s*$/m, "}")
      .trim();

    try {
      const roadmap = JSON.parse(roadmapText);

      if (!roadmap.steps || !Array.isArray(roadmap.steps) || roadmap.steps.length === 0) {
        throw new Error("Invalid internship guide structure: missing steps");
      }

      res.json(roadmap);
    } catch (jsonError) {
      console.error("❌ JSON Parsing Error:", jsonError, roadmapText);
      res.status(500).json({
        error: "Failed to generate a proper internship guide. Please try again with more specific domain details."
      });
    }
  } catch (error) {
    console.error("❌ Internship Helper Error:", error);
    res.status(500).json({
      error: "Unable to generate internship guide. Please check your inputs and try again."
    });
  }
});

export default router;
