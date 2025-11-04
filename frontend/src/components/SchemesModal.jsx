import React, { useState, useEffect } from "react";
import { FaTimes, FaExternalLinkAlt } from "react-icons/fa";
import axios from "axios";

const SchemeCard = ({ scheme }) => (
  <div className="bg-background-secondary p-4 rounded-lg border border-border">
    <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded-full mb-2">
      {Array.isArray(scheme.disabilityType)
        ? scheme.disabilityType.join(", ")
        : scheme.disabilityType || "General"}
    </span>
    <h3 className="text-lg font-bold font-display text-text-primary mb-1">
      {scheme.title}
    </h3>
    <p className="text-sm text-text-secondary mb-3">{scheme.description}</p>
    {scheme.link && (
      <a
        href={scheme.link}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-accent hover:text-accent-hover text-sm inline-flex items-center gap-2"
      >
        Learn More <FaExternalLinkAlt size={12} />
      </a>
    )}
  </div>
);

const SchemesModal = ({ isOpen, onClose, user }) => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchSchemes = async () => {
      try {
        setLoading(true);
        const disabilityType =
          user?.disabilityType && user?.disabilityType !== "null"
            ? user.disabilityType
            : "general";

        const res = await axios.get(
          `http://localhost:3000/api/schemes?disabilityType=${disabilityType}`
        );
        setSchemes(res.data || []);
      } catch (error) {
        console.error("Failed to fetch schemes:", error);
        setSchemes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background-primary rounded-lg shadow-xl w-full max-w-2xl m-4 flex flex-col"
        style={{ height: "80vh" }}
      >
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-2xl font-display font-bold text-text-primary">
            Personalized Schemes
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {loading ? (
            <p className="text-center text-text-secondary">Loading schemes...</p>
          ) : (
            <>
              <p className="text-text-secondary mb-4">
                Showing schemes relevant for{" "}
                <span className="font-bold text-text-primary">
                  {user?.disabilityType || "General"}
                </span>{" "}
                and <span className="font-bold text-text-primary">general</span>{" "}
                categories.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schemes.length > 0 ? (
                  schemes.map((scheme) => (
                    <SchemeCard key={scheme._id || scheme.title} scheme={scheme} />
                  ))
                ) : (
                  <p className="text-text-secondary">
                    No schemes found for your profile.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemesModal;