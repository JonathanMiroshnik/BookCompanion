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
exports.initializeVectorStore = initializeVectorStore;
exports.getBookIndex = getBookIndex;
exports.getNoteIndex = getNoteIndex;
exports.addBookChunks = addBookChunks;
exports.searchSimilarChunks = searchSimilarChunks;
exports.deleteBookChunks = deleteBookChunks;
exports.getCollectionStats = getCollectionStats;
const pinecone_1 = require("@pinecone-database/pinecone");
let pinecone;
let bookIndex;
let noteIndex;
let isInitialized = false;
/**
 * Initializes vector store (Pinecone) for storing book embeddings
 */
function initializeVectorStore() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Initialize Pinecone client
            pinecone = new pinecone_1.Pinecone({
                apiKey: process.env.PINECONE_API_KEY || 'dummy-key'
            });
            // Get or create the book chunks index
            const bookIndexName = process.env.PINECONE_BOOK_INDEX || 'book-chunks';
            try {
                bookIndex = pinecone.index(bookIndexName);
                yield bookIndex.describeIndexStats();
            }
            catch (error) {
                console.log(`ℹ️ Book index '${bookIndexName}' doesn't exist, will create on first use`);
                bookIndex = pinecone.index(bookIndexName);
            }
            // Get or create the note embeddings index
            const noteIndexName = process.env.PINECONE_NOTE_INDEX || 'note-embeddings';
            try {
                noteIndex = pinecone.index(noteIndexName);
                yield noteIndex.describeIndexStats();
            }
            catch (error) {
                console.log(`ℹ️ Note index '${noteIndexName}' doesn't exist, will create on first use`);
                noteIndex = pinecone.index(noteIndexName);
            }
            isInitialized = true;
            console.log('✅ Vector store (Pinecone) initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize vector store:', error);
            throw error;
        }
    });
}
/**
 * Gets the Pinecone book index instance
 */
function getBookIndex() {
    if (!isInitialized || !bookIndex) {
        throw new Error('Vector store not initialized. Call initializeVectorStore() first.');
    }
    return bookIndex;
}
/**
 * Gets the Pinecone note index instance
 */
function getNoteIndex() {
    if (!isInitialized || !noteIndex) {
        throw new Error('Vector store not initialized. Call initializeVectorStore() first.');
    }
    return noteIndex;
}
/**
 * Adds book chunks to the vector store
 */
function addBookChunks(bookId, userId, chunks, embeddings) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!isInitialized || !bookIndex) {
                throw new Error('Vector store not initialized');
            }
            // Prepare vectors for Pinecone
            const vectors = chunks.map((chunk, index) => ({
                id: `${bookId}_chunk_${index}`,
                values: embeddings[index],
                metadata: Object.assign(Object.assign({}, chunk.metadata), { book_id: bookId, user_id: userId, type: 'book_chunk', content: chunk.content })
            }));
            // Upsert to Pinecone (upsert handles both insert and update)
            yield bookIndex.upsert(vectors);
            console.log(`✅ Added ${chunks.length} chunks for book ${bookId}`);
        }
        catch (error) {
            console.error('❌ Failed to add book chunks to vector store:', error);
            throw error;
        }
    });
}
/**
 * Searches for similar chunks in the vector store
 */
function searchSimilarChunks(query_1, userId_1, bookIds_1) {
    return __awaiter(this, arguments, void 0, function* (query, userId, bookIds, limit = 10) {
        try {
            if (!isInitialized || !bookIndex) {
                throw new Error('Vector store not initialized');
            }
            // For now, we'll need to get embeddings from an external service
            // This is a placeholder - you'll need to implement embedding generation
            const queryEmbedding = yield generateEmbedding(query);
            // Build filter for user and optional book filtering
            const filter = { user_id: { $eq: userId } };
            if (bookIds && bookIds.length > 0) {
                filter.book_id = { $in: bookIds };
            }
            // Query Pinecone
            const queryResponse = yield bookIndex.query({
                vector: queryEmbedding,
                topK: limit,
                filter: filter,
                includeMetadata: true
            });
            // Transform results
            return queryResponse.matches.map((match) => ({
                content: match.metadata.content,
                metadata: match.metadata,
                score: match.score
            }));
        }
        catch (error) {
            console.error('❌ Failed to search vector store:', error);
            throw error;
        }
    });
}
/**
 * Deletes all chunks for a specific book
 */
function deleteBookChunks(bookId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!isInitialized || !bookIndex) {
                throw new Error('Vector store not initialized');
            }
            // Delete chunks by book ID and user ID
            yield bookIndex.deleteMany({
                filter: {
                    book_id: { $eq: bookId },
                    user_id: { $eq: userId }
                }
            });
            console.log(`✅ Deleted chunks for book ${bookId}`);
        }
        catch (error) {
            console.error('❌ Failed to delete book chunks:', error);
            throw error;
        }
    });
}
/**
 * Gets collection statistics
 */
function getCollectionStats() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!isInitialized || !bookIndex || !noteIndex) {
                throw new Error('Vector store not initialized');
            }
            const bookStats = yield bookIndex.describeIndexStats();
            const noteStats = yield noteIndex.describeIndexStats();
            return {
                totalChunks: bookStats.totalVectorCount || 0,
                totalNotes: noteStats.totalVectorCount || 0
            };
        }
        catch (error) {
            console.error('❌ Failed to get collection stats:', error);
            throw error;
        }
    });
}
/**
 * Placeholder function for generating embeddings
 * You'll need to implement this using an embedding service like OpenAI, Cohere, etc.
 */
function generateEmbedding(text) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: Implement embedding generation
        // This is a placeholder that returns a dummy embedding
        // You should replace this with actual embedding generation
        console.warn('⚠️ Using placeholder embedding - implement generateEmbedding function');
        return new Array(1536).fill(0).map(() => Math.random() - 0.5);
    });
}
//# sourceMappingURL=vectorStore.js.map