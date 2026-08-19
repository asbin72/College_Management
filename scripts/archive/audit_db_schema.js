import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const seedContent = fs.readFileSync(path.join(rootDir, 'scratch', 'run_full_seed.js'), 'utf8');
const serverContent = fs.readFileSync(path.join(rootDir, 'server', 'index.js'), 'utf8');
const dataContextContent = fs.readFileSync(path.join(rootDir, 'src', 'context', 'DataContext.jsx'), 'utf8');

console.log('=== DATABASE AUDIT: TABLES CREATED IN SEED SCRIPT ===');
const tableMatches = [...seedContent.matchAll(/CREATE TABLE\s+([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\);/g)];
const tables = {};

for (const match of tableMatches) {
  const tableName = match[1];
  const body = match[2];
  const columns = [];
  const lines = body.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('PRIMARY KEY') || trimmed.startsWith('KEY') || trimmed.startsWith('FOREIGN KEY') || trimmed.startsWith('INDEX') || trimmed.startsWith('CONSTRAINT')) continue;
    const colMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s+/);
    if (colMatch) {
      columns.push(colMatch[1]);
    }
  }
  tables[tableName] = columns;
}

console.log('Tables found in seed:', Object.keys(tables));

console.log('\n=== TABLES AND ENDPOINT QUERIES IN server/index.js ===');
for (const [table, cols] of Object.entries(tables)) {
  const tableRegex = new RegExp(`\\b${table}\\b`, 'gi');
  const serverMatches = (serverContent.match(tableRegex) || []).length;
  const contextMatches = (dataContextContent.match(tableRegex) || []).length;
  console.log(`Table: ${table}`);
  console.log(`  - Columns (${cols.length}): ${cols.join(', ')}`);
  console.log(`  - Occurrences in server/index.js: ${serverMatches}`);
  console.log(`  - Occurrences in DataContext.jsx: ${contextMatches}`);
}
