import React, { useState } from 'react';
import { Award, CheckCircle2, AlertCircle, ExternalLink, Copy, Check, Calendar, Edit2, Trash2, ShieldCheck } from 'lucide-react';

export default function CertificatesList({ list, onEdit, onDelete, onViewDoc, onAddNew }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (list.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <Award className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Certificates Saved</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">
          Store your AWS, Google, Coursera, Meta, and industry certifications with verifiable credentials.
        </p>
        <button
          onClick={() => onAddNew('certificates')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all"
        >
          Add Certification
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {list.map((cert) => {
        const isActive = cert.status === 'Active';
        return (
          <div
            key={cert.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header: Issuer & Status */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {cert.issuing_organization}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}
                >
                  {isActive ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {cert.status || 'Active'}
                </span>
              </div>

              {/* Certificate Title */}
              <h3 className="text-base font-bold text-slate-900 leading-snug mb-3">
                {cert.title}
              </h3>

              {/* Dates */}
              <div className="space-y-1.5 text-xs text-slate-500 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Issued: {cert.issue_date}</span>
                </div>
                {cert.expiration_date && (
                  <div className="flex items-center gap-2 text-slate-400 pl-5">
                    <span>Expires: {cert.expiration_date}</span>
                  </div>
                )}
              </div>

              {/* Credential ID / Verification Link */}
              {cert.credential_id && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-3">
                  <span className="font-mono truncate mr-2 text-[11px]">{cert.credential_id}</span>
                  <button
                    onClick={() => handleCopy(cert.id, cert.credential_id)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors"
                    title="Copy credential ID"
                  >
                    {copiedId === cert.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Footer: Credential Link, Attachment, Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
              <div className="flex items-center gap-2">
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    title="Verify Online"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verify
                  </a>
                )}
                {cert.document_url && (
                  <button
                    onClick={() => onViewDoc(cert.document_url, cert.document_name || 'Certificate File')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-0.5 rounded"
                  >
                    <ExternalLink className="w-3 h-3" />
                    File
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit('certificates', cert)}
                  title="Edit certificate"
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete('certificates', cert.id)}
                  title="Delete certificate"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

