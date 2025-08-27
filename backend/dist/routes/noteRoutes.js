"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNoteRoutes = createNoteRoutes;
const express_1 = require("express");
const NoteController_1 = require("../controllers/NoteController");
const authMiddleware_1 = require("../middleware/authMiddleware");
function createNoteRoutes() {
    const router = (0, express_1.Router)();
    const noteController = new NoteController_1.NoteController();
    // Apply authentication middleware to all note routes
    router.use(authMiddleware_1.authMiddleware);
    // Note CRUD routes
    router.get('/:id', noteController.getNoteById.bind(noteController));
    router.put('/:id', noteController.updateNote.bind(noteController));
    router.delete('/:id', noteController.deleteNote.bind(noteController));
    // Search and tags
    router.get('/search', noteController.searchNotes.bind(noteController));
    router.get('/tags', noteController.getNoteTags.bind(noteController));
    return router;
}
exports.default = createNoteRoutes;
//# sourceMappingURL=noteRoutes.js.map