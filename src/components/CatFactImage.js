import React, { useState } from "react";
import axios from "axios";

const CatFact = () => {
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(false);

  const getRandomFact = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://catfact.ninja/fact");
      setFact(response.data.fact);
    } catch (error) {
      console.error("Error fetching cat fact:", error);
      setFact("Oops! Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-purple-600">🐱 Random Cat Fact</h1>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md text-center">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <p className="text-gray-700">{fact || "Click the button to get a cat fact!"}</p>
        )}
        <button
          onClick={getRandomFact}
          className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Get Fact
        </button>
      </div>
    </div>
  );
};

export default CatFact;
