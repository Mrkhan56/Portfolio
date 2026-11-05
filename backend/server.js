const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Helper for formatted file size
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// --- FILE UPLOAD API ---
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(201).json({
      message: 'File uploaded successfully',
      fileUrl,
      fileName: req.file.originalname,
      storedName: req.file.filename,
      fileSize: formatBytes(req.file.size),
      mimeType: req.file.mimetype
    });
  } catch (err) {
    console.error('File upload error:', err);
    return res.status(500).json({ error: 'Failed to process file upload' });
  }
});

// --- OVERVIEW / STATS API ---
app.get('/api/overview', (req, res) => {
  try {
    const eduCount = db.get('SELECT COUNT(*) as count FROM education').count;
    const certCount = db.get('SELECT COUNT(*) as count FROM certificates').count;
    const activeCertCount = db.get('SELECT COUNT(*) as count FROM certificates WHERE status = ?', ['Active']).count;
    const cvCount = db.get('SELECT COUNT(*) as count FROM cv_documents').count;
    const primaryCV = db.get('SELECT * FROM cv_documents WHERE is_primary = 1 LIMIT 1') || null;

    const recentEducation = db.all('SELECT * FROM education ORDER BY end_year DESC, id DESC LIMIT 3');
    const recentCertificates = db.all('SELECT * FROM certificates ORDER BY issue_date DESC, id DESC LIMIT 3');
    const recentCVs = db.all('SELECT * FROM cv_documents ORDER BY is_primary DESC, id DESC LIMIT 3');

    res.json({
      counts: {
        education: eduCount,
        certificates: certCount,
        activeCertificates: activeCertCount,
        cvs: cvCount
      },
      primaryCV,
      recent: {
        education: recentEducation,
        certificates: recentCertificates,
        cvs: recentCVs
      }
    });
  } catch (err) {
    console.error('Error fetching overview:', err);
    res.status(500).json({ error: 'Failed to retrieve overview statistics' });
  }
});

// --- EDUCATION CRUD APIs ---
app.get('/api/education', (req, res) => {
  try {
    const list = db.all('SELECT * FROM education ORDER BY end_year DESC, id DESC');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/education', (req, res) => {
  try {
    const { institution, degree, field_of_study, start_year, end_year, grade, description, document_url, document_name } = req.body;
    if (!institution || !degree || !field_of_study) {
      return res.status(400).json({ error: 'Institution, degree, and field of study are required' });
    }

    const result = db.run(
      `INSERT INTO education (institution, degree, field_of_study, start_year, end_year, grade, description, document_url, document_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [institution, degree, field_of_study, start_year || null, end_year || null, grade || null, description || null, document_url || null, document_name || null]
    );

    const inserted = db.get('SELECT * FROM education WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/education/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { institution, degree, field_of_study, start_year, end_year, grade, description, document_url, document_name } = req.body;

    const existing = db.get('SELECT * FROM education WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Education record not found' });
    }

    db.run(
      `UPDATE education SET 
        institution = ?, 
        degree = ?, 
        field_of_study = ?, 
        start_year = ?, 
        end_year = ?, 
        grade = ?, 
        description = ?, 
        document_url = ?, 
        document_name = ?
       WHERE id = ?`,
      [
        institution || existing.institution,
        degree || existing.degree,
        field_of_study || existing.field_of_study,
        start_year !== undefined ? start_year : existing.start_year,
        end_year !== undefined ? end_year : existing.end_year,
        grade !== undefined ? grade : existing.grade,
        description !== undefined ? description : existing.description,
        document_url !== undefined ? document_url : existing.document_url,
        document_name !== undefined ? document_name : existing.document_name,
        id
      ]
    );

    const updated = db.get('SELECT * FROM education WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/education/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.get('SELECT * FROM education WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Education record not found' });
    }
    db.run('DELETE FROM education WHERE id = ?', [id]);
    res.json({ message: 'Education record deleted successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CERTIFICATES CRUD APIs ---
app.get('/api/certificates', (req, res) => {
  try {
    const list = db.all('SELECT * FROM certificates ORDER BY issue_date DESC, id DESC');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/certificates', (req, res) => {
  try {
    const { title, issuing_organization, issue_date, expiration_date, credential_id, credential_url, status, document_url, document_name } = req.body;
    if (!title || !issuing_organization || !issue_date) {
      return res.status(400).json({ error: 'Title, issuing organization, and issue date are required' });
    }

    const result = db.run(
      `INSERT INTO certificates (title, issuing_organization, issue_date, expiration_date, credential_id, credential_url, status, document_url, document_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, issuing_organization, issue_date, expiration_date || null, credential_id || null, credential_url || null, status || 'Active', document_url || null, document_name || null]
    );

    const inserted = db.get('SELECT * FROM certificates WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/certificates/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, issuing_organization, issue_date, expiration_date, credential_id, credential_url, status, document_url, document_name } = req.body;

    const existing = db.get('SELECT * FROM certificates WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    db.run(
      `UPDATE certificates SET
        title = ?,
        issuing_organization = ?,
        issue_date = ?,
        expiration_date = ?,
        credential_id = ?,
        credential_url = ?,
        status = ?,
        document_url = ?,
        document_name = ?
       WHERE id = ?`,
      [
        title || existing.title,
        issuing_organization || existing.issuing_organization,
        issue_date || existing.issue_date,
        expiration_date !== undefined ? expiration_date : existing.expiration_date,
        credential_id !== undefined ? credential_id : existing.credential_id,
        credential_url !== undefined ? credential_url : existing.credential_url,
        status || existing.status,
        document_url !== undefined ? document_url : existing.document_url,
        document_name !== undefined ? document_name : existing.document_name,
        id
      ]
    );

    const updated = db.get('SELECT * FROM certificates WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/certificates/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.get('SELECT * FROM certificates WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    db.run('DELETE FROM certificates WHERE id = ?', [id]);
    res.json({ message: 'Certificate deleted successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CV / RESUMES CRUD APIs ---
app.get('/api/cvs', (req, res) => {
  try {
    const list = db.all('SELECT * FROM cv_documents ORDER BY is_primary DESC, id DESC');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cvs', (req, res) => {
  try {
    const { title, version, is_primary, notes, document_url, document_name, file_size, file_type } = req.body;
    if (!title || !document_url) {
      return res.status(400).json({ error: 'CV title and uploaded document are required' });
    }

    const primaryFlag = is_primary ? 1 : 0;
    if (primaryFlag === 1) {
      // Unset previous primary CV
      db.run('UPDATE cv_documents SET is_primary = 0');
    }

    const result = db.run(
      `INSERT INTO cv_documents (title, version, is_primary, notes, document_url, document_name, file_size, file_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, version || 'v1.0', primaryFlag, notes || '', document_url, document_name || 'CV.pdf', file_size || null, file_type || 'application/pdf']
    );

    const inserted = db.get('SELECT * FROM cv_documents WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/cvs/:id/primary', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.get('SELECT * FROM cv_documents WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'CV document not found' });
    }
    // Set all to 0, then set this to 1
    db.run('UPDATE cv_documents SET is_primary = 0');
    db.run('UPDATE cv_documents SET is_primary = 1 WHERE id = ?', [id]);
    const updated = db.get('SELECT * FROM cv_documents WHERE id = ?', [id]);
    res.json({ message: 'Primary CV updated', cv: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/cvs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.get('SELECT * FROM cv_documents WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'CV document not found' });
    }
    db.run('DELETE FROM cv_documents WHERE id = ?', [id]);
    res.json({ message: 'CV document removed successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'education-vault-backend', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Educational Vault Backend API running on http://localhost:${PORT}`);
});

