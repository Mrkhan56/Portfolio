import React from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';

export default function DocumentViewerModal({ isOpen, onClose, docUrl, docTitle }) {
  if (!isOpen || !docUrl) return null;

  const isImage = /\.(jpeg|jpg|png|webp|gif|svg)$/i.test(docUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 truncate">
            <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <h3 className="text-sm font-bold text-slate-800 truncate">
              {docTitle || 'Document Viewer'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={docUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 rounded-lg transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={docUrl}
              download
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 rounded-lg transition-colors"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Viewer Body */}
        <div className="flex-1 bg-slate-100 p-4 flex items-center justify-center overflow-auto">
          {isImage ? (
            <img
              src={docUrl}
              alt={docTitle}
              className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
            />
          ) : (
            <iframe
              src={docUrl}
              title={docTitle}
              className="w-full h-full rounded-xl border border-slate-200 shadow-inner bg-white"
            />
          )}
        </div>

      </div>
    </div>
  );
}

