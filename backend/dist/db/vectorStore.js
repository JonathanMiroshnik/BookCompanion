// import { ChromaClient } from 'chromadb';
// let chromaClient: ChromaClient;
// let isInitialized = false;
// /**
//  * Initializes vector store (Chroma) for storing book embeddings
//  */
// export async function initializeVectorStore(): Promise<void> {
//   try {
//     // Initialize Chroma client
//     // TODO: Configure Chroma connection (local or remote)
//     chromaClient = new ChromaClient({
//       path: process.env.CHROMA_URL || 'http://localhost:8000'
//     });
//     // Test connection
//     await chromaClient.heartbeat();
//     // Create collections if they don't exist
//     await createCollections();
//     isInitialized = true;
//     console.log('✅ Vector store (Chroma) initialized successfully');
//   } catch (error) {
//     console.error('❌ Failed to initialize vector store:', error);
//     throw error;
//   }
// }
// /**
//  * Creates required collections in the vector store
//  */
// async function createCollections(): Promise<void> {
//   try {
//     // Main collection for book chunks
//     await chromaClient.createCollection({
//       name: 'book_chunks',
//       metadata: {
//         description: 'Book content chunks for RAG retrieval',
//         embedding_function: 'text-embedding-ada-002' // TODO: Configure embedding model
//       }
//     });
//     // Collection for note embeddings
//     await chromaClient.createCollection({
//       name: 'note_embeddings',
//       metadata: {
//         description: 'User notes for semantic search',
//         embedding_function: 'text-embedding-ada-002'
//       }
//     });
//     console.log('✅ Vector store collections created');
//   } catch (error) {
//     // Collection might already exist, which is fine
//     console.log('ℹ️ Vector store collections already exist or failed to create');
//   }
// }
// /**
//  * Gets the Chroma client instance
//  */
// export function getChromaClient(): ChromaClient {
//   if (!isInitialized || !chromaClient) {
//     throw new Error('Vector store not initialized. Call initializeVectorStore() first.');
//   }
//   return chromaClient;
// }
// /**
//  * Adds book chunks to the vector store
//  */
// export async function addBookChunks(
//   bookId: string,
//   userId: string,
//   chunks: Array<{ content: string; metadata: any }>,
//   embeddings: number[][]
// ): Promise<void> {
//   try {
//     const collection = await chromaClient.getCollection({ name: 'book_chunks' });
//     // Prepare data for Chroma
//     const ids = chunks.map((_, index) => `${bookId}_chunk_${index}`);
//     const documents = chunks.map(chunk => chunk.content);
//     const metadatas = chunks.map(chunk => ({
//       ...chunk.metadata,
//       book_id: bookId,
//       user_id: userId,
//       type: 'book_chunk'
//     }));
//     // Add to collection
//     await collection.add({
//       ids,
//       embeddings,
//       documents,
//       metadatas
//     });
//     console.log(`✅ Added ${chunks.length} chunks for book ${bookId}`);
//   } catch (error) {
//     console.error('❌ Failed to add book chunks to vector store:', error);
//     throw error;
//   }
// }
// /**
//  * Searches for similar chunks in the vector store
//  */
// export async function searchSimilarChunks(
//   query: string,
//   userId: string,
//   bookIds?: string[],
//   limit: number = 10
// ): Promise<Array<{ content: string; metadata: any; distance: number }>> {
//   try {
//     const collection = await chromaClient.getCollection({ name: 'book_chunks' });
//     // Build where clause for user and optional book filtering
//     const whereClause: any = { user_id: userId };
//     if (bookIds && bookIds.length > 0) {
//       whereClause.book_id = { $in: bookIds };
//     }
//     // Search for similar chunks
//     const results = await collection.query({
//       queryTexts: [query],
//       nResults: limit,
//       where: whereClause
//     });
//     // Transform results
//     return results.documents[0].map((doc, index) => ({
//       content: doc,
//       metadata: results.metadatas[0][index],
//       distance: results.distances[0][index]
//     }));
//   } catch (error) {
//     console.error('❌ Failed to search vector store:', error);
//     throw error;
//   }
// }
// /**
//  * Deletes all chunks for a specific book
//  */
// export async function deleteBookChunks(bookId: string, userId: string): Promise<void> {
//   try {
//     const collection = await chromaClient.getCollection({ name: 'book_chunks' });
//     // Delete chunks by book ID and user ID
//     await collection.delete({
//       where: {
//         book_id: bookId,
//         user_id: userId
//       }
//     });
//     console.log(`✅ Deleted chunks for book ${bookId}`);
//   } catch (error) {
//     console.error('❌ Failed to delete book chunks:', error);
//     throw error;
//   }
// }
// /**
//  * Gets collection statistics
//  */
// export async function getCollectionStats(): Promise<{ totalChunks: number; totalNotes: number }> {
//   try {
//     const bookCollection = await chromaClient.getCollection({ name: 'book_chunks' });
//     const noteCollection = await chromaClient.getCollection({ name: 'note_embeddings' });
//     const bookCount = await bookCollection.count();
//     const noteCount = await noteCollection.count();
//     return {
//       totalChunks: bookCount,
//       totalNotes: noteCount
//     };
//   } catch (error) {
//     console.error('❌ Failed to get collection stats:', error);
//     throw error;
//   }
// }
//# sourceMappingURL=vectorStore.js.map