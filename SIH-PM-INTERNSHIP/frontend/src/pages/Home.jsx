import React, { useEffect, useState } from "react";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, logoutUser } = UserData();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">InternConnect</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium">
            Welcome, {user?.name || "Guest"}
          </span>
          <button
            onClick={() => logoutUser(navigate)}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Recommended internships</h2>
          <p className="mt-2 text-gray-600 text-center">Personalized based on your profile and preferences.</p>

          {loading && (
            <div className="mt-6 text-center text-gray-500">Loading recommendations...</div>
          )}
          {error && (
            <div className="mt-6 text-center text-red-600">{error}</div>
          )}

          {!loading && !error && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recs.map((it, idx) => (
                <div key={it.id || idx} className="bg-white rounded-lg shadow p-4 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{it.title || "Internship"}</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{it.sector || "General"}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{it.company || "Company"}</p>
                  <p className="text-sm text-gray-500">{it.location || "Location"}</p>
                  {Array.isArray(it.skills) && it.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {it.skills.slice(0, 6).map((s, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {it.explanation && (
                    <p className="text-xs text-gray-600 mt-3">{it.explanation}</p>
                  )}
                  <div className="mt-4 flex gap-2">
                    {it.apply_url && (
                      <a
                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                        href={it.apply_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Apply
                      </a>
                    )}
                    <button
                      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded"
                      onClick={() => navigate("/onboarding")}
                    >
                      Improve matches
                    </button>
                  </div>
                </div>
              ))}
              {recs.length === 0 && (
                <div className="col-span-full text-center text-gray-500">No recommendations yet. Complete your profile to see better matches.</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
