import React from "react";
import { useNavigate } from "react-router-dom";

const InternshipCard = ({ internship }) => {
  const navigate = useNavigate();
  const { title, sector, company, location, skills, explanation, apply_url } = internship;

  return (
    <div className="rounded-xl glass-card border border-border p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
      {/* Header: Title and Sector */}
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'var(--font-merriweather)' }}>{title || "Internship"}</h3>
        <span className="text-xs bg-secondary/15 text-secondary px-2 py-1 rounded-md font-medium border border-secondary/30">
          {sector || "General"}
        </span>
      </div>

      {/* Company and Location */}
      <p className="text-sm text-foreground/90 mt-1 font-medium">{company || "Company"}</p>
      <p className="text-sm text-muted-foreground">{location || "Location"}</p>

      {/* Skills */}
      {Array.isArray(skills) && skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.slice(0, 6).map((skill, i) => (
            <span
              key={i}
              className="text-xs bg-accent/10 text-foreground px-2 py-1 rounded-md border border-accent/20"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Explanation (if available) */}
      {explanation && (
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{explanation}</p>
      )}

      {/* Action Buttons */}
      <div className="mt-5 flex gap-3">
        {apply_url && (
          <a
            className="text-sm bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg shadow-sm transition-colors"
            href={apply_url}
            target="_blank"
            rel="noreferrer"
          >
            Apply
          </a>
        )}
        <button
          className="text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground px-4 py-2 rounded-lg transition-colors"
          onClick={() => navigate("/onboarding")}
        >
          Improve matches
        </button>
      </div>
    </div>
  );
};

export default InternshipCard;