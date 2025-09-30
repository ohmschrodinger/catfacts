import React, { useState, useEffect } from "react";
import axios from "axios";

const Spinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const CatFactImage = () => {
  const [currentFact, setCurrentFact] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [nextFact, setNextFact] = useState("");
  const [nextImage, setNextImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shareSuccess, setShareSuccess] = useState("");
  const [imageLoaded, setImageLoaded] = useState(true); // Track image load for fade transition

  const fetchFactAndImage = async () => {
    try {
      const [factResponse, imageResponse] = await Promise.all([
        axios.get("https://catfact.ninja/fact"),
        axios.get("https://api.thecatapi.com/v1/images/search"),
      ]);
      return {
        fact: factResponse.data.fact,
        image: imageResponse.data[0].url,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        fact: "Oops! Something went wrong.",
        image: "",
      };
    }
  };

  useEffect(() => {
    const prefetchNext = async () => {
      if (!nextFact || !nextImage) {
        const { fact, image } = await fetchFactAndImage();
        setNextFact(fact);
        setNextImage(image);
      }
    };
    prefetchNext();
  }, [nextFact, nextImage]);

  const getNewCatFactAndImage = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
    setLoading(true);
    setShareSuccess("");
    setImageLoaded(false); // start fading out current image

    // Show prefetched fact/image
    setCurrentFact(nextFact);

    // Delay setting image so opacity transition triggers
    // Or you can set it immediately but manage opacity with imageLoaded below
    setCurrentImage(nextImage);

    // Clear next cached data for loading next prefetch
    setNextFact("");
    setNextImage("");

    fetchFactAndImage().then(({ fact, image }) => {
      setNextFact(fact);
      setNextImage(image);
      setLoading(false);
    });
  };

  const shareFact = async () => {
    const shareText = `${currentFact}\n\nhttps://catfacts-pied.vercel.app/`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Cat Fact",
          text: shareText,
          url: "https://catfacts-pied.vercel.app/",
        });
        setShareSuccess("Fact shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
        setShareSuccess("Sharing canceled or failed.");
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setShareSuccess("Fact copied to clipboard!");
      } catch (error) {
        console.error("Clipboard write failed:", error);
        setShareSuccess("Copying to clipboard failed.");
      }
    }
    setTimeout(() => setShareSuccess(""), 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#171B23] p-4 font-sans">
      <h1 className="text-4xl font-bold mb-8 text-blue-400 tracking-wide drop-shadow-md">
        Random Cat-Facts🐱
      </h1>

      <div
       className="bg-[#212634] rounded-2xl shadow-xl border border-[#2f3645] max-w-md w-full p-8 text-center relative flex flex-col justify-between transition-all duration-500 ease-in-out min-h-[500px]"
        style={{ overflow: "hidden" }}
      >
        <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-blue-400 animate-pulse"></div>

        <div className="flex-grow flex flex-col justify-center">
          {loading && !currentFact ? (
            <Spinner />
          ) : (
            <div
              className={`transition-opacity duration-500 ${
                currentFact ? "opacity-100" : "opacity-0"
              }`}
            >
              {currentImage && (
                <img
                  src={currentImage}
                  alt="Random Cat"
                  className={`w-full h-64 object-cover rounded-xl border-[3px] border-blue-600 shadow-lg mb-5 transition-opacity duration-700 ease-in-out ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              )}
              <p className="text-gray-200 mb-6 min-h-[72px] flex items-center justify-center">
                {currentFact || "Click the button to get a cat fact!"}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={getNewCatFactAndImage}
          disabled={loading && !nextFact && !nextImage}
          className="mt-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-gray-900 font-semibold py-2 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && !nextFact && !nextImage
            ? "Loading..."
            : !isExpanded
            ? "Generate Random Fact"
            : "New Fact"}
        </button>

        {isExpanded && currentFact && !loading && (
          <button
            onClick={shareFact}
            aria-label="Share Fact"
            className="mt-4 w-10 h-10 rounded-full bg-[#23293b] flex items-center justify-center border border-[#2f3645] hover:bg-blue-600 transition-colors duration-150 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 12v.01M12 4v.01M20 12v.01M12 20v.01M16.24 7.76L12 12l-4.24-4.24"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 12l4.24 4.24M12 12v8"
              />
            </svg>
          </button>
        )}

        {shareSuccess && (
          <p className="mt-3 text-green-400 font-semibold">{shareSuccess}</p>
        )}
      </div>
    </div>
  );
};

export default CatFactImage;
