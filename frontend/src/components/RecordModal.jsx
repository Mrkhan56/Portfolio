import React, { useState, useEffect } from 'react';
import { X, Upload, FileCheck, Loader2, GraduationCap, Award, FileText } from 'lucide-react';

export default function RecordModal({ isOpen, onClose, initialType, editData, onSave }) {
  const [recordType, setRecordType] = useState(initialType || 'education');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData({ ...editData });
      setRecordType(initialType);
    } else {
      // Default empty form
      setRecordType(initialType || 'education');
      setFormData({
        status: 'Active',
        is_primary: 0,
        version: 'v1.0'
      });
    }
    setUploadError('');
  }, [editData, initialType, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    const bodyData = new FormData();
    bodyData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: bodyData
      });

      if (!res.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        document_url: data.fileUrl,
        document_name: data.fileName,
        file_size: data.fileSize,
        file_type: data.mimeType
      }));
    } catch (err) {
      setUploadError(err.message || 'Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(recordType, formData, editData ? editData.id : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">
              {editData ? 'Edit Record' : 'Add New Credential'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Record Type Selector (Only if not editing) */}
        {!editData && (
          <div className="px-6 pt-4 pb-2">
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setRecordType('education')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                  recordType === 'education'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Degree
              </button>
              <button
                type="button"
                onClick={() => setRecordType('certificates')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                  recordType === 'certificates'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4" />
                Certificate
              </button>
              <button
                type="button"
                onClick={() => setRecordType('cvs')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                  recordType === 'cvs'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                CV / Resume
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          
          {/* DEGREE FIELDS */}
          {recordType === 'education' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  University / Institution *
                </label>
                <input
                  type="text"
                  name="institution"
                  required
                  placeholder="e.g. Stanford University or Oxford"
                  value={formData.institution || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Degree Type *
                  </label>
                  <input
                    type="text"
                    name="degree"
                    required
                    placeholder="e.g. Bachelor of Science"
                    value={formData.degree || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Field of Study / Major *
                  </label>
                  <input
                    type="text"
                    name="field_of_study"
                    required
                    placeholder="e.g. Computer Science"
                    value={formData.field_of_study || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Year</label>
                  <input
                    type="number"
                    name="start_year"
                    placeholder="2020"
                    value={formData.start_year || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End / Grad Year</label>
                  <input
                    type="number"
                    name="end_year"
                    placeholder="2024"
                    value={formData.end_year || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Grade / GPA</label>
                  <input
                    type="text"
                    name="grade"
                    placeholder="3.85 / 4.0"
                    value={formData.grade || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Honors</label>
                <textarea
                  rows="2"
                  name="description"
                  placeholder="Dean's List, Capstone Thesis, Key coursework..."
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </>
          )}

          {/* CERTIFICATE FIELDS */}
          {recordType === 'certificates' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Certificate Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={formData.title || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issuing Organization *</label>
                  <input
                    type="text"
                    name="issuing_organization"
                    required
                    placeholder="e.g. Amazon Web Services, Google"
                    value={formData.issuing_organization || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status || 'Active'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Date *</label>
                  <input
                    type="date"
                    name="issue_date"
                    required
                    value={formData.issue_date || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expiration Date</label>
                  <input
                    type="date"
                    name="expiration_date"
                    value={formData.expiration_date || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Credential ID</label>
                  <input
                    type="text"
                    name="credential_id"
                    placeholder="e.g. AWS-SAA-90231"
                    value={formData.credential_id || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Verification URL</label>
                  <input
                    type="url"
                    name="credential_url"
                    placeholder="https://..."
                    value={formData.credential_url || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </>
          )}

          {/* CV / RESUME FIELDS */}
          {recordType === 'cvs' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resume / CV Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Senior Fullstack Engineer CV - 2026"
                  value={formData.title || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Version Label</label>
                  <input
                    type="text"
                    name="version"
                    placeholder="e.g. v2.1"
                    value={formData.version || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      name="is_primary"
                      checked={formData.is_primary === 1 || formData.is_primary === true}
                      onChange={handleChange}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                    />
                    Mark as Primary CV
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Target Roles</label>
                <textarea
                  rows="2"
                  name="notes"
                  placeholder="Targeting Fullstack, Frontend, Cloud Architect roles..."
                  value={formData.notes || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>
            </>
          )}

          {/* DOCUMENT FILE UPLOAD ATTACHMENT */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Attach Document (PDF, Image, Transcript, Certificate) {recordType === 'cvs' && '*'}
            </label>

            {formData.document_url ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {formData.document_name || 'Attached Document'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formData.file_size || 'Attached'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, document_url: '', document_name: '' }))}
                  className="text-xs text-rose-600 hover:underline ml-2"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-4 text-center transition-colors">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center">
                  {uploading ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading document to backend...
                    </div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <p className="text-xs font-medium text-slate-600">
                        Click or drag document here to upload
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        PDF, DOCX, JPG, PNG up to 25MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {uploadError && (
              <p className="text-xs text-rose-600 mt-1">{uploadError}</p>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {editData ? 'Save Changes' : 'Save to Vault'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

