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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteService = void 0;
const sqlite_1 = require("../db/sqlite");
class NoteService {
    constructor() {
        this.db = (0, sqlite_1.getDatabase)();
    }
    /**
     * Gets all notes for a specific book
     */
    getNotesByBook(bookId_1, userId_1) {
        return __awaiter(this, arguments, void 0, function* (bookId, userId, page = 1, limit = 50) {
            const offset = (page - 1) * limit;
            // Get paginated notes
            const query = `
      SELECT * FROM notes 
      WHERE book_id = ? AND user_id = ? 
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
            const notes = yield this.db.all(query, [bookId, userId, limit, offset]);
            if (!notes) {
                return [];
            }
            return notes.map(note => ({
                id: note.id,
                bookId: note.book_id,
                userId: note.user_id,
                title: note.title || undefined,
                content: note.content,
                pageReference: note.page_reference || undefined,
                tags: JSON.parse(note.tags || '[]'),
                createdAt: new Date(note.created_at),
                updatedAt: new Date(note.updated_at)
            }));
        });
    }
    /**
     * Gets a specific note by ID
     */
    getNoteById(noteId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT * FROM notes 
      WHERE id = ? AND user_id = ?
    `;
            const note = yield this.db.get(query, [noteId, userId]);
            if (!note) {
                throw new Error('Note not found');
            }
            return Object.assign(Object.assign({}, note), { tags: JSON.parse(note.tags || '[]'), createdAt: new Date(note.created_at), updatedAt: new Date(note.updated_at) });
        });
    }
    /**
     * Gets a specific note from a book (with book validation)
     */
    getBookNote(bookId, noteId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT * FROM notes 
      WHERE id = ? AND book_id = ? AND user_id = ?
    `;
            const note = yield this.db.get(query, [noteId, bookId, userId]);
            if (!note) {
                throw new Error('Note not found or does not belong to the specified book');
            }
            return Object.assign(Object.assign({}, note), { tags: JSON.parse(note.tags || '[]'), createdAt: new Date(note.created_at), updatedAt: new Date(note.updated_at) });
        });
    }
    /**
     * Creates a new note
     */
    createNote(noteData, bookId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      INSERT INTO notes (
        id, book_id, user_id, title, content, page_reference, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
            const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const tags = JSON.stringify(noteData.tags || []);
            try {
                yield this.db.run(query, [
                    noteId,
                    bookId,
                    userId,
                    noteData.title || null,
                    noteData.content,
                    noteData.pageReference || null,
                    tags
                ]);
            }
            catch (error) {
                console.error('Error creating note:', error);
                throw error;
            }
            return this.getNoteById(noteId, userId);
        });
    }
    /**
     * Updates an existing note
     */
    updateNote(noteId, updateData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Build dynamic update query
            const fields = [];
            const values = [];
            if (updateData.title !== undefined) {
                fields.push('title = ?');
                values.push(updateData.title);
            }
            if (updateData.content !== undefined) {
                fields.push('content = ?');
                values.push(updateData.content);
            }
            if (updateData.pageReference !== undefined) {
                fields.push('page_reference = ?');
                values.push(updateData.pageReference);
            }
            if (updateData.tags !== undefined) {
                fields.push('tags = ?');
                values.push(JSON.stringify(updateData.tags));
            }
            if (fields.length === 0) {
                throw new Error('No fields to update');
            }
            fields.push('updated_at = CURRENT_TIMESTAMP');
            const query = `
      UPDATE notes 
      SET ${fields.join(', ')} 
      WHERE id = ? AND user_id = ?
    `;
            values.push(noteId, userId);
            const result = yield this.db.run(query, values);
            if (result.changes === 0) {
                throw new Error('Note not found or no changes made');
            }
            return this.getNoteById(noteId, userId);
        });
    }
    /**
     * Updates a note from a specific book (with book validation)
     */
    updateBookNote(bookId, noteId, updateData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate that the note belongs to the specified book
            const noteQuery = `SELECT id FROM notes WHERE id = ? AND book_id = ? AND user_id = ?`;
            const note = yield this.db.get(noteQuery, [noteId, bookId, userId]);
            if (!note) {
                throw new Error('Note not found or does not belong to the specified book');
            }
            return this.updateNote(noteId, updateData, userId);
        });
    }
    /**
     * Deletes a note
     */
    deleteNote(noteId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.run('DELETE FROM notes WHERE id = ? AND user_id = ?', [noteId, userId]);
            if (result.changes === 0) {
                throw new Error('Note not found');
            }
        });
    }
    /**
     * Deletes a note from a specific book (with book validation)
     */
    deleteBookNote(bookId, noteId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate that the note belongs to the specified book
            const noteQuery = `SELECT id FROM notes WHERE id = ? AND book_id = ? AND user_id = ?`;
            const note = yield this.db.get(noteQuery, [noteId, bookId, userId]);
            if (!note) {
                throw new Error('Note not found or does not belong to the specified book');
            }
            yield this.deleteNote(noteId, userId);
        });
    }
    /**
     * Searches notes across all user's books
     */
    searchNotes(searchParams, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query, tags, bookId, pageFrom, pageTo } = searchParams;
            let sqlQuery = `
      SELECT n.* FROM notes n
      JOIN books b ON n.book_id = b.id
      WHERE n.user_id = ?
    `;
            const values = [userId];
            if (query) {
                sqlQuery += ` AND (n.title LIKE ? OR n.content LIKE ?)`;
                values.push(`%${query}%`, `%${query}%`);
            }
            if (bookId) {
                sqlQuery += ` AND n.book_id = ?`;
                values.push(bookId);
            }
            if (pageFrom !== undefined) {
                sqlQuery += ` AND n.page_reference >= ?`;
                values.push(pageFrom);
            }
            if (pageTo !== undefined) {
                sqlQuery += ` AND n.page_reference <= ?`;
                values.push(pageTo);
            }
            sqlQuery += ` ORDER BY n.created_at DESC`;
            const notes = yield this.db.all(sqlQuery, values);
            if (!notes) {
                return [];
            }
            return notes.map(note => (Object.assign(Object.assign({}, note), { tags: JSON.parse(note.tags || '[]'), createdAt: new Date(note.created_at), updatedAt: new Date(note.updated_at) })));
        });
    }
    /**
     * Gets all unique tags used in user's notes
     */
    getNoteTags(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT 
        json_extract(tag.value, '$') as tag,
        COUNT(*) as count
      FROM notes n,
           json_each(n.tags) as tag
      WHERE n.user_id = ?
      GROUP BY tag
      ORDER BY count DESC
    `;
            const tags = yield this.db.all(query, [userId]);
            return tags || [];
        });
    }
    /**
     * Gets notes by tag
     */
    getNotesByTag(tag, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT * FROM notes 
      WHERE user_id = ? AND json_extract(tags, '$') LIKE ?
      ORDER BY created_at DESC
    `;
            const notes = yield this.db.all(query, [userId, `%${tag}%`]);
            if (!notes) {
                return [];
            }
            return notes.map(note => (Object.assign(Object.assign({}, note), { tags: JSON.parse(note.tags || '[]'), createdAt: new Date(note.created_at), updatedAt: new Date(note.updated_at) })));
        });
    }
    /**
     * Adds tags to a note
     */
    addTagsToNote(noteId, tags, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield this.getNoteById(noteId, userId);
            const existingTags = note.tags || [];
            const newTags = [...new Set([...existingTags, ...tags])];
            yield this.updateNote(noteId, { tags: newTags }, userId);
        });
    }
    /**
     * Removes tags from a note
     */
    removeTagsFromNote(noteId, tags, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield this.getNoteById(noteId, userId);
            const existingTags = note.tags || [];
            const newTags = existingTags.filter(tag => !tags.includes(tag));
            yield this.updateNote(noteId, { tags: newTags }, userId);
        });
    }
}
exports.NoteService = NoteService;
//# sourceMappingURL=NoteService.js.map