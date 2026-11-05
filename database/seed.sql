-- Seed data for Educational Information Vault

INSERT INTO education (institution, degree, field_of_study, start_year, end_year, grade, description, document_url, document_name)
VALUES 
('Stanford University', 'Master of Science', 'Computer Science', 2022, 2024, '3.92 / 4.0', 'Specialization in Artificial Intelligence and Distributed Systems. Published research on scalable data processing.', '/uploads/sample-ms-degree.pdf', 'MS_Degree_Stanford.pdf'),
('University of California, Berkeley', 'Bachelor of Science', 'Electrical Engineering & Computer Science', 2018, 2022, '3.85 / 4.0', 'Dean''s Honor List, Capstone in Fullstack Web Architectures, Member of IEEE.', '/uploads/sample-bs-degree.pdf', 'BS_Degree_UCBerkeley.pdf');

INSERT INTO certificates (title, issuing_organization, issue_date, expiration_date, credential_id, credential_url, status, document_url, document_name)
VALUES
('AWS Certified Solutions Architect - Associate', 'Amazon Web Services', '2024-03-15', '2027-03-15', 'AWS-SAA-8392019', 'https://aws.amazon.com/verification', 'Active', '/uploads/sample-aws-cert.pdf', 'AWS_Certified_Solutions_Architect.pdf'),
('Meta Certified Full-Stack Developer', 'Meta (Coursera)', '2023-11-20', NULL, 'META-FS-449102', 'https://coursera.org/verify/META-FS-449102', 'Active', '/uploads/sample-meta-cert.pdf', 'Meta_FullStack_Certificate.pdf'),
('Google Cloud Professional Data Engineer', 'Google Cloud', '2023-08-10', '2025-08-10', 'GCP-PDE-110293', 'https://google.accredible.com/GCP-PDE-110293', 'Active', '/uploads/sample-gcp-cert.pdf', 'Google_Cloud_Data_Engineer.pdf');

INSERT INTO cv_documents (title, version, is_primary, notes, document_url, document_name, file_size, file_type)
VALUES
('Software Engineer - Fullstack & Cloud CV', 'v2.4', 1, 'Tailored for senior fullstack engineering roles with Node.js and React.', '/uploads/sample-cv-2026.pdf', 'JohnDoe_FullStack_CV_2026.pdf', '245 KB', 'application/pdf'),
('Academic & Research Curriculum Vitae', 'v1.2', 0, 'Includes publications, conferences, and academic projects.', '/uploads/sample-academic-cv.pdf', 'JohnDoe_Academic_CV.pdf', '310 KB', 'application/pdf');

