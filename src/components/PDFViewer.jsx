import React from "react";

export default function PDFViewer({ title, pdfUrl }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl flex flex-col">
      <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
        {title}
      </h2>
      <div className="flex-1">
        <iframe
          src={pdfUrl}
          className="w-full h-96 rounded-lg border border-white/20 shadow-inner-glow"
          title={title}
        />
      </div>
    </div>
  );
}
