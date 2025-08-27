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
exports.NoteController = void 0;
const NoteService_1 = require("../services/NoteService");
class NoteController {
    constructor() {
        this.noteService = new NoteService_1.NoteService();
    }
    /**
     * Gets all notes for a specific book
     */
    getNotesByBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.query.userId;
                const notes = yield this.noteService.getNotesByBook(id, userId);
                res.status(200).json({
                    success: true,
                    data: notes,
                    total: notes.length,
                    message: 'Notes retrieved successfully'
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to get notes' });
            }
        });
    }
    /**
     * Gets a specific note by ID
     */
    getNoteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // var userId = (req as any).user.id; // From auth middleware
                // TODO: Implement get book by ID
                // - Validate book ownership
                // - Call BookService.getBookById(bookId, userId)
                // - Return book details
                const userId = '123';
                const note = yield this.noteService.getNoteById(id, userId);
                console.log('note', note);
                res.status(200).json({
                    success: true,
                    data: note,
                    message: 'Note retrieved successfully'
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to get note' });
            }
        });
    }
    /**
     * Creates a new note
     */
    createNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.body.userId;
                const noteData = req.body.note;
                // TODO: Implement create note
                // - Validate note data (content, bookId, etc.)
                const note = yield this.noteService.createNote(noteData, id, userId);
                console.log('Note created', note);
                res.status(201).json({
                    success: true,
                    data: note,
                    message: 'Note created successfully'
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create note' });
            }
        });
    }
    /**
     * Updates an existing note
     */
    updateNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const updateData = req.body;
                // TODO: Implement update note
                // - Validate note ownership
                // - Call NoteService.updateNote(noteId, updateData, userId)
                // - Return updated note
                res.status(501).json({ message: 'Update note not implemented yet', noteId: id, updateData });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update note' });
            }
        });
    }
    /**
     * Deletes a note
     */
    deleteNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                // TODO: Implement delete note
                // - Validate note ownership
                // - Call NoteService.deleteNote(noteId, userId)
                // - Return success confirmation
                res.status(501).json({ message: 'Delete note not implemented yet', noteId: id });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete note' });
            }
        });
    }
    /**
     * Searches notes across all user's books
     */
    searchNotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { query, bookId, tags, dateRange } = req.query;
                // TODO: Implement note search
                // - Parse search parameters
                // - Call NoteService.searchNotes(searchParams, userId)
                // - Return filtered and ranked results
                res.status(501).json({ message: 'Note search not implemented yet', query, bookId, tags, dateRange });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to search notes' });
            }
        });
    }
    /**
     * Gets all unique tags used in user's notes
     */
    getNoteTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                // TODO: Implement get note tags
                // - Call NoteService.getNoteTags(userId)
                // - Return list of unique tags with usage counts
                res.status(501).json({ message: 'Get note tags not implemented yet' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to get note tags' });
            }
        });
    }
}
exports.NoteController = NoteController;
//# sourceMappingURL=NoteController.js.map