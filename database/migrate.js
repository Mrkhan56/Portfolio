const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'education.db');
const schemaPath = path.join(__dirname, 'schema.sql');
const seedPath = path.join(__dirname, 'seed.sql');

console.log(`Connecting to database at: ${dbPath}`);
const db = new DatabaseSync(dbPath);

// Execute schema
const schemaSql = fs.readFileSync(schemaPath, 'utf8');
db.exec(schemaSql);
console.log('Schema created or already exists.');

// Check if seed data is needed
const educationCount = db.prepare('SELECT COUNT(*) as count FROM education').get().count;
if (educationCount === 0 && fs.existsSync(seedPath)) {
  const seedSql = fs.readFileSync(seedPath, 'utf8');
  db.exec(seedSql);
  console.log('Database seeded with initial sample educational data.');
} else {
  console.log(`Database already has ${educationCount} education records. Skipping seed.`);
}

console.log('Database migration completed successfully.');

