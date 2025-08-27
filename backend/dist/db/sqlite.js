"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSQLite = initializeSQLite;
exports.getDatabase = getDatabase;
exports.closeDatabase = closeDatabase;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
let db;
/**
 * Initializes SQLite database with required tables
 */
function initializeSQLite() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Use absolute path to database file
            const dbPath = path_1.default.join(__dirname, '../../bookcompanion.db');
            console.log('🗄️ Database path:', dbPath);
            // Open database connection
            db = yield (0, sqlite_1.open)({
                filename: dbPath,
                driver: sqlite3_1.default.Database
            });
            // Enable foreign keys
            yield db.exec('PRAGMA foreign_keys = ON');
            // Create tables
            yield createTables();
            console.log('✅ SQLite database initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize SQLite database:', error);
            throw error;
        }
    });
}
/**
 * Creates all required database tables
 */
function createTables() {
    return __awaiter(this, void 0, void 0, function* () {
        // Users table
        yield db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      google_id TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      picture_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
        // Books table
        yield db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      author TEXT,
      isbn TEXT,
      description TEXT,
      page_count INTEGER,
      genre TEXT,
      tags TEXT, -- JSON array of tags
      reading_status TEXT DEFAULT 'not_started', -- not_started, reading, completed, paused
      current_page INTEGER DEFAULT 0,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
        // Notes table
        yield db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      title TEXT,
      content TEXT NOT NULL,
      page_reference INTEGER,
      tags TEXT, -- JSON array of tags
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
        // Book embeddings table
        yield db.exec(`
    CREATE TABLE IF NOT EXISTS book_embeddings (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      content TEXT NOT NULL,
      embedding_vector BLOB, -- Store embedding as binary data
      metadata TEXT, -- JSON metadata
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      UNIQUE(book_id, chunk_index)
    )
  `);
        // Embedding jobs table
        yield db.exec(`
    CREATE TABLE IF NOT EXISTS embedding_jobs (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
      total_chunks INTEGER DEFAULT 0,
      processed_chunks INTEGER DEFAULT 0,
      error_message TEXT,
      metadata TEXT, -- JSON metadata
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
        // Create indexes for better performance
        yield db.exec('CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id)');
        yield db.exec('CREATE INDEX IF NOT EXISTS idx_notes_book_id ON notes(book_id)');
        yield db.exec('CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id)');
        yield db.exec('CREATE INDEX IF NOT EXISTS idx_book_embeddings_book_id ON book_embeddings(book_id)');
        yield db.exec('CREATE INDEX IF NOT EXISTS idx_embedding_jobs_book_id ON embedding_jobs(book_id)');
    });
}
/**
 * Gets the database instance
 */
function getDatabase() {
    if (!db) {
        throw new Error('Database not initialized. Call initializeSQLite() first.');
    }
    return db;
}
/**
 * Closes the database connection
 */
function closeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        if (db) {
            yield db.close();
        }
    });
}
//# sourceMappingURL=sqlite.js.map