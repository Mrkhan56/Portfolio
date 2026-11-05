import React from 'react';
import { GraduationCap, Calendar, Award, ExternalLink, Edit2, Trash2, FileCheck, Building2 } from 'lucide-react';

export default function EducationList({ list, onEdit, onDelete, onViewDoc, onAddNew }) {
  if (list.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Education Records Yet</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">
          Keep track of your high school, undergraduate, master's or PhD degrees in one secure place.
        </p>
        <button
          onClick={() => onAddNew('education')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all"
        >
          Add First Degree
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {list.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
        >
          <div>
            {/* Header: Institution & Years */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span className="truncate">{item.institution}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>
                  {item.start_year || '?'} – {item.end_year || 'Present'}
                </span>
              </div>
            </div>

            {/* Degree & Major */}
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {item.degree}
            </h3>
            <p className="text-sm font-medium text-slate-600 mb-3">
              in {item.field_of_study}
            </p>

            {/* Grade / GPA Badge */}
            {item.grade && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100 mb-3">
                <Award className="w-3.5 h-3.5" />
                Grade: {item.grade}
              </div>
            )}

            {/* Description */}
            {item.description && (
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                {item.description}
              </p>
            )}
          </div>

          {/* Footer: Attachments & Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
            <div>
              {item.document_url ? (
                <button
                  onClick={() => onViewDoc(item.document_url, item.document_name || 'Degree Document')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline bg-indigo-50/60 px-2.5 py-1 rounded-lg"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[130px]">{item.document_name || 'View Transcript'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              ) : (
                <span className="text-xs text-slate-400 italic">No document attached</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit('education', item)}
                title="Edit record"
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete('education', item.id)}
                title="Delete record"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

