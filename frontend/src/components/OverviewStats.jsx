import React from 'react';
import { GraduationCap, Award, FileText, Download, CheckCircle, ExternalLink } from 'lucide-react';

export default function OverviewStats({ counts, primaryCV, onSelectTab, onViewDoc }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Degrees Card */}
      <div 
        onClick={() => onSelectTab('education')}
        className="cursor-pointer group p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-500">Degrees & Diplomas</span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-800">{counts.education || 0}</span>
          <span className="text-xs text-slate-400">Programs recorded</span>
        </div>
      </div>

      {/* Certificates Card */}
      <div 
        onClick={() => onSelectTab('certificates')}
        className="cursor-pointer group p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-500">Certifications</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-800">{counts.certificates || 0}</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> {counts.activeCertificates || 0} Active
          </span>
        </div>
      </div>

      {/* CVs & Resumes Card */}
      <div 
        onClick={() => onSelectTab('cvs')}
        className="cursor-pointer group p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-500">CVs & Resumes</span>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-800">{counts.cvs || 0}</span>
          <span className="text-xs text-slate-400">Versions stored</span>
        </div>
      </div>

      {/* Primary Resume Highlight */}
      <div className="p-5 bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl shadow-sm text-white flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Featured CV</span>
            <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">
              {primaryCV ? primaryCV.title : 'No Primary CV'}
            </h4>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-700/60 text-indigo-100 rounded-full border border-indigo-500/30">
            {primaryCV?.version || 'Default'}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {primaryCV ? (
            <a
              href={primaryCV.document_url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-semibold rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download CV
            </a>
          ) : (
            <button
              onClick={() => onSelectTab('cvs')}
              className="flex-1 py-1.5 px-3 bg-indigo-700/60 hover:bg-indigo-700 text-xs font-semibold rounded-lg text-center"
            >
              Upload Primary CV
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

