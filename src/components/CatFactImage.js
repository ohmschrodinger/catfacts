import React, { useState } from "react";
import axios from "axios";

const CatFactImage = () => {
  const [fact, setFact] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const getNewCatFactAndImage = async () => {
    setLoading(true);
    try {
      const factResponse = await axios.get("https://catfact.ninja/fact");
      setFact(factResponse.data.fact);

      const imageResponse = await axios.get("https://api.thecatapi.com/v1/images/search");
      setImage(imageResponse.data[0].url);
    } catch (error) {
      console.error("Error fetching data:", error);
      setFact("Oops! Something went wrong.");
      setImage("");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#171B23] p-4">
      <h1 className="text-4xl font-bold mb-8 text-blue-400 tracking-wide drop-shadow-md">🐱 Cat Facts & Images</h1>
      <div className="bg-[#212634] rounded-2xl shadow-xl border border-[#2f3645] max-w-md w-full p-8 text-center relative">
        <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-blue-400 animate-pulse"></div>
        {loading ? (
          <p className="text-gray-400 py-24">Loading...</p>
        ) : (
          <>
            {image && (
              <img
                src={image}
                alt="Random Cat"
                className="w-full h-64 object-cover rounded-xl border-[3px] border-blue-600 shadow-lg mb-5 transition-all duration-300"
              />
            )}
            <p className="text-gray-200 mb-6 min-h-12">{fact || "Click the button to get a cat fact!"}</p>
          </>
        )}
        <button
          onClick={getNewCatFactAndImage}
          className="mt-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-gray-900 font-semibold py-2 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-lg transition-all duration-150"
        >
          New Fact & Image
        </button>
      </div>
      <div className="mt-12 flex flex-row gap-5 opacity-80">
        <button className="w-9 h-9 rounded-full bg-[#23293b] flex items-center justify-center border border-[#2f3645] hover:bg-blue-600 transition-colors duration-150">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </button>
        <button className="w-9 h-9 rounded-full bg-[#23293b] flex items-center justify-center border border-[#2f3645] hover:bg-blue-600 transition-colors duration-150">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CatFactImage;
