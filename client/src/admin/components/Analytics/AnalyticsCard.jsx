import React from "react";

export default function AnalyticsCard({ val, onClick }) {
  return (
    <div
      className="bg-gray-800 text-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={onClick}
    >
     
      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{val.areaName}</h3>
        <p className="text-white">{val.description || "No description available"}</p>
      </div>

      {/* Card Footer (optional) */}
      {/* <div className="flex items-center justify-end pt-4">
        <a href="#" className="inline-block">
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Learn More
          </button>
        </a>
      </div> */}
    </div>
  );
}
