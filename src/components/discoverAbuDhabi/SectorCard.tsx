import React, { useState } from "react";
interface SectorCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  growth: string;
  investment: string;
  color: string;
  detailsContent?: React.ReactNode;
}
const SectorCard = ({
  title,
  description,
  icon,
  growth,
  investment,
  color,
  detailsContent,
}: SectorCardProps) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className={`h-2 ${color}`}></div>
      <div className="p-8 flex-1 flex flex-col">
        <div
          className={`w-14 h-14 rounded-lg flex items-center justify-center mb-6 ${color} bg-opacity-10`}
        >
          {icon}
        </div>
        <h3 className="font-display text-2xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 font-body mb-8 flex-1">{description}</p>
        <div className="grid grid-cols-2 gap-6 mt-auto">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 font-body uppercase tracking-wider mb-1">
              Annual Growth
            </p>
            <p className="text-xl font-display font-bold text-primary">
              {growth}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 font-body uppercase tracking-wider mb-1">
              Investment
            </p>
            <p className="text-xl font-display font-bold text-primary">
              {investment}
            </p>
          </div>
        </div>
        {detailsContent && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-6 text-primary font-body font-medium hover:underline text-center"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
      {detailsContent && expanded && (
        <div className="px-8 pb-8 pt-0 border-t border-gray-100 mt-2 animate-fadeIn">
          {detailsContent}
        </div>
      )}
    </div>
  );
};
export default SectorCard;
