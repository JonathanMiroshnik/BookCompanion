import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database;

/**
 * Initializes SQLite database with required tables
 */
export async function initializeSQLite(): Promise<void> {
  try {
    // Use absolute path to database file
    const dbPath = path.join(__dirname, '../../bookcompanion.db');
    console.log('🗄️ Database path:', dbPath);
    
    // Open database connection
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON');

    // Create tables
    await createTables();
    
    console.log('✅ SQLite database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize SQLite database:', error);
    throw error;
  }
}

/**
 * Creates all required database tables
 */
async function createTables(): Promise<void> {
  // Users table
  await db.exec(`
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
  await db.exec(`
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
  await db.exec(`
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
  await db.exec(`
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
  await db.exec(`
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
  await db.exec('CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id)');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_notes_book_id ON notes(book_id)');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id)');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_book_embeddings_book_id ON book_embeddings(book_id)');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_embedding_jobs_book_id ON embedding_jobs(book_id)');
}

/**
 * Gets the database instance
 */
export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initializeSQLite() first.');
  }
  return db;
}

/**
 * Closes the database connection
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
  }
}
