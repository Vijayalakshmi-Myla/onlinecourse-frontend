"use client";

export default function ProgressBar({ progress }) {
  // Ensure progress stays between 0 and 100
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div
        className="bg-blue-600 h-full text-xs text-white flex items-center justify-center transition-all duration-500"
        style={{ width: `${safeProgress}%` }}
      >
        {safeProgress > 10 && <span>{safeProgress}%</span>}
      </div>
    </div>
  );
}
