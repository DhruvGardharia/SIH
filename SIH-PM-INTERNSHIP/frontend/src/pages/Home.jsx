import React, { useEffect, useState } from "react";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import InternshipCard from "../components/InternshipCard";

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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">InternConnect</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium">Welcome, {user?.name || "Guest"}</span>
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
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Recommended Internships
          </h2>
          <p className="mt-2 text-gray-600 text-center">
            Personalized based on your profile and preferences.
          </p>

          {loading && (
            <div className="mt-6 text-center text-gray-500">
              Loading recommendations...
            </div>
          )}
          {error && (
            <div className="mt-6 text-center text-red-600">{error}</div>
          )}
          {!loading && !error && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recs.length > 0 ? (
                recs.map((it, idx) => (
                  <InternshipCard key={it.id || idx} internship={it} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500">
                  No recommendations yet. Complete your profile to see better matches.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
