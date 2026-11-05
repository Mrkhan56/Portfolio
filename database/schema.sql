-- Database Schema for Educational Information Vault

CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT NOT NULL,
    start_year INTEGER,
    end_year INTEGER,
    grade TEXT,
    description TEXT,
    document_url TEXT,
    document_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    expiration_date TEXT,
    credential_id TEXT,
    credential_url TEXT,
    status TEXT DEFAULT 'Active', -- 'Active', 'Expired', 'In Progress'
    document_url TEXT,
    document_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cv_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    version TEXT DEFAULT 'v1.0',
    is_primary INTEGER DEFAULT 0, -- 1 for true, 0 for false
    notes TEXT,
    document_url TEXT NOT NULL,
    document_name TEXT NOT NULL,
    file_size TEXT,
    file_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

