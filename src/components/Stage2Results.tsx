import React, { useState } from "react";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import type { ISQ } from "../types";

interface Stage2ResultsProps {
  isqs: {
    config: ISQ;
    keys: ISQ[];
    buyers?: ISQ[];
  };
  onDownloadExcel: () => void;
}

export default function Stage2Results({ isqs, onDownloadExcel }: Stage2ResultsProps) {
  const [showDebug, setShowDebug] = useState(false);

  const hasMinOptions = (isq: ISQ) => isq.options && isq.options.length >= 2;

  const config = hasMinOptions(isqs.config) ? isqs.config : null;
  const keys = (isqs.keys || []).filter(hasMinOptions);
  const buyers = (isqs.buyers || []).filter(hasMinOptions);

  const renderISQCard = (isq: ISQ, type: "config" | "key" | "buyer", index?: number) => {
    const colorMap = {
      config: { bg: "bg-red-50", border: "border-red-500", labelBg: "bg-red-200", labelText: "text-red-800", heading: "text-red-900" },
      key: { bg: "bg-blue-50", border: "border-blue-500", labelBg: "bg-blue-200", labelText: "text-blue-800", heading: "text-blue-900" },
      buyer: { bg: "bg-amber-50", border: "border-amber-500", labelBg: "bg-amber-200", labelText: "text-amber-800", heading: "text-amber-900" },
    };

    const colors = colorMap[type];
    const hasOptions = isq.options && isq.options.length > 0;

    return (
      <div key={`${type}-${index}`} className={`${colors.bg} border-l-4 ${colors.border} p-6 rounded-lg`}>
        <div className="mb-4">
          <p className="font-semibold text-lg text-gray-900">
            {type === "config" && "Config ISQ"}
            {type === "key" && `Key ISQ ${index !== undefined ? index + 1 : ""}`}
            {type === "buyer" && `Buyer ISQ ${index !== undefined ? index + 1 : ""}`}
          </p>
          <p className="text-sm font-medium text-gray-700 mt-2">{isq.name}</p>
        </div>

        {hasOptions ? (
          <div className="flex flex-wrap gap-2">
            {isq.options.map((option, idx) => (
              <span key={idx} className={`${colors.labelBg} ${colors.labelText} px-3 py-1 rounded-full text-sm font-medium`}>
                {option}
              </span>
            ))}
          </div>
        ) : (
          <div className="bg-white bg-opacity-50 border border-dashed border-gray-400 p-4 rounded text-center">
            <p className="text-sm text-gray-600">No options extracted from URLs</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Stage 2: ISQ Extraction Complete</h2>
      <p className="text-gray-600 mb-8">Review the extracted ISQs from buyer websites below</p>

      <div className="space-y-8">
        {config ? (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Config ISQ</h3>
            {renderISQCard(config, "config")}
          </div>
        ) : (
          <div className="mb-8 bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-red-800 text-sm">Config ISQ needs at least 2 options to display</p>
          </div>
        )}

        {keys.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key ISQs ({keys.length})</h3>
            <div className="grid gap-4">
              {keys.map((isq, idx) => renderISQCard(isq, "key", idx))}
            </div>
          </div>
        ) : (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">No Key ISQs with minimum 2 options found</p>
          </div>
        )}

        {buyers.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Buyer ISQs ({buyers.length})</h3>
            <div className="grid gap-4">
              {buyers.map((isq, idx) => renderISQCard(isq, "buyer", idx))}
            </div>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
          <button
            onClick={onDownloadExcel}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition"
          >
            <Download size={20} />
            Download Excel Report
          </button>
        </div>

        <div className="border border-gray-300 rounded-lg">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="w-full flex items-center justify-between px-6 py-4 bg-gray-100 hover:bg-gray-200 transition font-semibold text-gray-900"
          >
            <span>Debug: Raw Data</span>
            {showDebug ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {showDebug && (
            <pre className="p-6 bg-gray-900 text-green-400 text-xs overflow-auto max-h-96 rounded-b-lg font-mono">
              {JSON.stringify(isqs, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
