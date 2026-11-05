import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OverviewStats from './components/OverviewStats';
import EducationList from './components/EducationList';
import CertificatesList from './components/CertificatesList';
import CVList from './components/CVList';
import RecordModal from './components/RecordModal';
import DocumentViewerModal from './components/DocumentViewerModal';
import { GraduationCap, Award, FileText, Loader2, Sparkles, FolderArchive } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Data states
  const [counts, setCounts] = useState({ education: 0, certificates: 0, activeCertificates: 0, cvs: 0 });
  const [primaryCV, setPrimaryCV] = useState(null);
  const [educationList, setEducationList] = useState([]);
  const [certificatesList, setCertificatesList] = useState([]);
  const [cvsList, setCvsList] = useState([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('education');
  const [editItem, setEditItem] = useState(null);

  // Document Viewer states
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState({ url: '', title: '' });

  // Load all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [overviewRes, eduRes, certRes, cvRes] = await Promise.all([
        fetch('/api/overview'),
        fetch('/api/education'),
        fetch('/api/certificates'),
        fetch('/api/cvs')
      ]);

      const overviewData = await overviewRes.json();
      const eduData = await eduRes.json();
      const certData = await certRes.json();
      const cvData = await cvRes.json();

      setCounts(overviewData.counts || {});
      setPrimaryCV(overviewData.primaryCV || null);
      setEducationList(Array.isArray(eduData) ? eduData : []);
      setCertificatesList(Array.isArray(certData) ? certData : []);
      setCvsList(Array.isArray(cvData) ? cvData : []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save (Create or Update)
  const handleSave = async (type, formData, id) => {
    try {
      const endpoint = id ? `/api/${type}/${id}` : `/api/${type}`;
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditItem(null);
        fetchData();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to save record');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Error saving record');
    }
  };

  // Delete
  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Set Primary CV
  const handleSetPrimary = async (id) => {
    try {
      const res = await fetch(`/api/cvs/${id}/primary`, { method: 'PATCH' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Primary CV error:', err);
    }
  };

  // Open modal for add
  const handleOpenAdd = (type = 'education') => {
    setModalType(type);
    setEditItem(null);
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (type, item) => {
    setModalType(type);
    setEditItem(item);
    setIsModalOpen(true);
  };

  // Open document viewer
  const handleViewDoc = (url, title) => {
    setViewDoc({ url, title });
    setViewerOpen(true);
  };

  // Filtered lists
  const query = searchQuery.toLowerCase().trim();
  const filteredEducation = educationList.filter(
    (item) =>
      item.institution?.toLowerCase().includes(query) ||
      item.degree?.toLowerCase().includes(query) ||
      item.field_of_study?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
  );

  const filteredCertificates = certificatesList.filter(
    (cert) =>
      cert.title?.toLowerCase().includes(query) ||
      cert.issuing_organization?.toLowerCase().includes(query) ||
      cert.credential_id?.toLowerCase().includes(query)
  );

  const filteredCVs = cvsList.filter(
    (cv) =>
      cv.title?.toLowerCase().includes(query) ||
      cv.version?.toLowerCase().includes(query) ||
      cv.notes?.toLowerCase().includes(query)
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenModal={() => handleOpenAdd(activeTab === 'all' ? 'education' : activeTab)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Banner / Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Educational Portfolio & Credentials
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Academic & Professional Vault
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Store, organize, and quickly retrieve your degrees, verified certificates, and CV versions in one fullstack dashboard.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenAdd('cvs')}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition-all flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              Upload CV
            </button>
            <button
              onClick={() => handleOpenAdd('certificates')}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition-all flex items-center gap-2"
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              Add Certificate
            </button>
            <button
              onClick={() => handleOpenAdd('education')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <GraduationCap className="w-3.5 h-3.5 text-white" />
              Add Degree
            </button>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <OverviewStats
          counts={counts}
          primaryCV={primaryCV}
          onSelectTab={(tab) => setActiveTab(tab)}
          onViewDoc={handleViewDoc}
        />

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-3 text-sm font-medium">Loading credentials...</span>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* SECTION 1: Degrees & Education */}
            {(activeTab === 'all' || activeTab === 'education') && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Degrees & Formal Education</h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-700">
                      {filteredEducation.length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenAdd('education')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    + Add Degree
                  </button>
                </div>

                <EducationList
                  list={filteredEducation}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  onViewDoc={handleViewDoc}
                  onAddNew={handleOpenAdd}
                />
              </section>
            )}

            {/* SECTION 2: Certificates & Licenses */}
            {(activeTab === 'all' || activeTab === 'certificates') && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Certificates & Licenses</h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-700">
                      {filteredCertificates.length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenAdd('certificates')}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800"
                  >
                    + Add Certificate
                  </button>
                </div>

                <CertificatesList
                  list={filteredCertificates}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  onViewDoc={handleViewDoc}
                  onAddNew={handleOpenAdd}
                />
              </section>
            )}

            {/* SECTION 3: CVs & Resumes */}
            {(activeTab === 'all' || activeTab === 'cvs') && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">CV & Resume Vault</h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-700">
                      {filteredCVs.length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenAdd('cvs')}
                    className="text-xs font-bold text-purple-600 hover:text-purple-800"
                  >
                    + Upload CV
                  </button>
                </div>

                <CVList
                  list={filteredCVs}
                  onSetPrimary={handleSetPrimary}
                  onDelete={handleDelete}
                  onViewDoc={handleViewDoc}
                  onAddNew={handleOpenAdd}
                />
              </section>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">EduVault</span>
            <span>• Fullstack Educational Document Management System</span>
          </div>
          <div>
            <span>Node.js Backend • React JS Frontend • SQLite Database</span>
          </div>
        </div>
      </footer>

      {/* Record Add/Edit Modal */}
      <RecordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditItem(null);
        }}
        initialType={modalType}
        editData={editItem}
        onSave={handleSave}
      />

      {/* Document Previewer Modal */}
      <DocumentViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        docUrl={viewDoc.url}
        docTitle={viewDoc.title}
      />

    </div>
  );
}

