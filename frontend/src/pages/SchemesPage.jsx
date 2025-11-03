import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExternalLinkAlt } from 'react-icons/fa';

const SchemeCard = ({ scheme }) => (
  <div className="bg-background-secondary p-6 rounded-lg border border-border shadow-sm">
    <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded-full mb-2">
      {scheme.category}
    </span>
    <h3 className="text-xl font-bold font-display text-text-primary mb-2">{scheme.title}</h3>
    <p className="text-text-secondary mb-4">{scheme.description}</p>
    <a
      href={scheme.link}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-accent hover:text-accent-hover inline-flex items-center gap-2"
    >
      Learn More <FaExternalLinkAlt size={12} />
    </a>
  </div>
);

const SchemesPage = () => {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/schemes');
        setSchemes(res.data);
      } catch (error) {
        console.error('Failed to fetch schemes:', error);
      }
    };
    fetchSchemes();
  }, []);

  return (
    <div className="bg-background-primary min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-display font-bold text-text-primary text-center mb-4">
          Government & NGO Schemes
        </h1>
        <p className="text-lg text-text-secondary text-center mb-10">
          Discover benefits, grants, and support available for PwDs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.length > 0 ? (
            schemes.map(scheme => <SchemeCard key={scheme._id} scheme={scheme} />)
          ) : (
            <p className="text-text-secondary">Loading schemes...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemesPage;