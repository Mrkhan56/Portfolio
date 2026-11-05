const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, '..', 'database', 'education.db');
const db = new DatabaseSync(dbPath);

module.exports = {
  // Query multiple rows
  all(query, params = []) {
    const stmt = db.prepare(query);
    return stmt.all(...params);
  },

  // Query single row
  get(query, params = []) {
    const stmt = db.prepare(query);
    return stmt.get(...params);
  },

  // Execute insert / update / delete and return changes / lastInsertRowid
  run(query, params = []) {
    const stmt = db.prepare(query);
    return stmt.run(...params);
  },

  raw: db
};

