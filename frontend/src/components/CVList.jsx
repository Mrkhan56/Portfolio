import React from 'react';
import { FileText, Download, Star, ExternalLink, Trash2, Calendar, HardDrive } from 'lucide-react';

export default function CVList({ list, onSetPrimary, onDelete, onViewDoc, onAddNew }) {
  if (list.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No CV or Resumes Uploaded</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">
          Store your latest versions of your Curriculum Vitae, academic resumes, or role-specific profiles.
        </p>
        <button
          onClick={() => onAddNew('cvs')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all"
        >
          Upload First CV
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {list.map((cv) => {
        const isPrimary = cv.is_primary === 1 || cv.is_primary === true;
        return (
          <div
            key={cv.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isPrimary
                ? 'bg-gradient-to-r from-indigo-50/50 via-white to-white border-indigo-200 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Left: Info */}
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isPrimary ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <FileText className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900">{cv.title}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {cv.version || 'v1.0'}
                  </span>
                  {isPrimary && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      <Star className="w-3 h-3 fill-indigo-600 text-indigo-600" />
                      Primary CV
                    </span>
                  )}
                </div>

                {cv.notes && (
                  <p className="text-xs text-slate-500 mt-1 max-w-xl line-clamp-2">
                    {cv.notes}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5" />
                    {cv.file_size || 'PDF'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Uploaded {cv.created_at ? new Date(cv.created_at).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {!isPrimary && (
                <button
                  onClick={() => onSetPrimary(cv.id)}
                  title="Make Primary CV"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                >
                  <Star className="w-3.5 h-3.5" />
                  Set Primary
                </button>
              )}

              <button
                onClick={() => onViewDoc(cv.document_url, cv.document_name || cv.title)}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Preview
              </button>

              <a
                href={cv.document_url}
                download
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>

              <button
                onClick={() => onDelete('cvs', cv.id)}
                title="Delete CV"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

