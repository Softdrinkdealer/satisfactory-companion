import initSqlJs from 'sql.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbDir = join(__dirname, '..', 'data');
mkdirSync(dbDir, { recursive: true });
const dbPath = join(dbDir, 'satisfactory.db');

let db;

export async function initDatabase() {
  const SQL = await initSqlJs();

  if (existsSync(dbPath)) {
    const buffer = readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      experience_level TEXT NOT NULL CHECK(experience_level IN ('neuling', 'kenner', 'veteran')),
      created_at TEXT DEFAULT (datetime('now')),
      last_active TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS guide_phases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      folge_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      tier_requirement TEXT,
      youtube_url TEXT,
      color TEXT,
      power_total_mw REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS productions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phase_id INTEGER NOT NULL REFERENCES guide_phases(id),
      name TEXT NOT NULL,
      power_original_mw REAL,
      power_adjusted_mw REAL,
      prerequisites_text TEXT,
      outputs_json TEXT,
      forwards_to_json TEXT,
      somersloops_needed INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      production_id INTEGER REFERENCES productions(id),
      text TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('einsteiger', 'pro', 'spass', 'server')),
      min_level TEXT NOT NULL CHECK(min_level IN ('neuling', 'kenner', 'veteran'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('bauen', 'forschen', 'erkunden', 'versorgen')),
      source TEXT NOT NULL CHECK(source IN ('leitfaden', 'manuell')),
      production_id INTEGER REFERENCES productions(id),
      assigned_to_player_id INTEGER REFERENCES players(id),
      status TEXT NOT NULL DEFAULT 'offen' CHECK(status IN ('offen', 'in_arbeit', 'fertig')),
      created_by_player_id INTEGER REFERENCES players(id),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      handover_reason TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id INTEGER REFERENCES players(id),
      action_text TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS nodes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resource_type TEXT NOT NULL,
      purity TEXT NOT NULL CHECK(purity IN ('rein', 'normal', 'unrein')),
      location_description TEXT NOT NULL,
      discovered_by_player_id INTEGER REFERENCES players(id),
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS power_tracker (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      production_name TEXT NOT NULL,
      power_consumption_mw REAL NOT NULL,
      is_active INTEGER DEFAULT 1,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS power_production (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      power_output_mw REAL NOT NULL,
      type TEXT DEFAULT 'sonstige',
      is_active INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      output_item TEXT NOT NULL,
      output_rate REAL,
      output_unit TEXT DEFAULT '/min',
      inputs_json TEXT NOT NULL,
      machine TEXT NOT NULL,
      power_original_mw REAL,
      power_adjusted_mw REAL,
      is_alternative INTEGER DEFAULT 0,
      unlock_method TEXT,
      tier TEXT,
      folge_number INTEGER,
      category TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS recipes_unlocked (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_name TEXT NOT NULL,
      production_id INTEGER REFERENCES productions(id),
      is_unlocked INTEGER DEFAULT 0,
      unlock_method TEXT CHECK(unlock_method IN ('hdd', 'mam'))
    )
  `);

  // Migration: set power_adjusted_mw = power_original_mw (remove 50% modifier)
  db.run('UPDATE productions SET power_adjusted_mw = power_original_mw WHERE power_adjusted_mw IS NOT NULL AND power_original_mw IS NOT NULL AND power_adjusted_mw != power_original_mw');
  db.run('UPDATE recipes SET power_adjusted_mw = power_original_mw WHERE power_adjusted_mw IS NOT NULL AND power_original_mw IS NOT NULL AND power_adjusted_mw != power_original_mw');

  // Seed default players if none exist
  const result = db.exec('SELECT COUNT(*) as cnt FROM players');
  const count = result[0]?.values[0]?.[0] ?? 0;
  if (count === 0) {
    db.run("INSERT INTO players (name, experience_level) VALUES ('Patrick', 'veteran')");
    db.run("INSERT INTO players (name, experience_level) VALUES ('Nico', 'kenner')");
    db.run("INSERT INTO players (name, experience_level) VALUES ('Marie', 'neuling')");
  }

  save();
  return db;
}

export function save() {
  const data = db.export();
  const buffer = Buffer.from(data);
  writeFileSync(dbPath, buffer);
}

export function getDb() {
  return db;
}

// Helper to run a SELECT and return rows as objects
export function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// Helper to run a SELECT and return first row as object
export function queryOne(sql, params = []) {
  const rows = queryAll(sql, params);
  return rows[0] || null;
}

// Helper to run INSERT/UPDATE/DELETE
export function execute(sql, params = []) {
  db.run(sql, params);
  save();
  return {
    lastInsertRowid: db.exec('SELECT last_insert_rowid()')[0]?.values[0]?.[0],
    changes: db.getRowsModified()
  };
}
