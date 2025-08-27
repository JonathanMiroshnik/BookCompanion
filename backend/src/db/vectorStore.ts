import { Pinecone } from '@pinecone-database/pinecone';

let pinecone: Pinecone;
let bookIndex: any;
let noteIndex: any;
let isInitialized = false;

/**
 * Initializes vector store (Pinecone) for storing book embeddings
 */
export async function initializeVectorStore(): Promise<void> {
  try {
    // Initialize Pinecone client
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || 'dummy-key'
    });

    // Get or create the book chunks index
    const bookIndexName = process.env.PINECONE_BOOK_INDEX || 'book-chunks';
    try {
      bookIndex = pinecone.index(bookIndexName);
      await bookIndex.describeIndexStats();
    } catch (error) {
      console.log(`ℹ️ Book index '${bookIndexName}' doesn't exist, will create on first use`);
      bookIndex = pinecone.index(bookIndexName);
    }

    // Get or create the note embeddings index
    const noteIndexName = process.env.PINECONE_NOTE_INDEX || 'note-embeddings';
    try {
      noteIndex = pinecone.index(noteIndexName);
      await noteIndex.describeIndexStats();
    } catch (error) {
      console.log(`ℹ️ Note index '${noteIndexName}' doesn't exist, will create on first use`);
      noteIndex = pinecone.index(noteIndexName);
    }
    
    isInitialized = true;
    console.log('✅ Vector store (Pinecone) initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize vector store:', error);
    throw error;
  }
}

/**
 * Gets the Pinecone book index instance
 */
export function getBookIndex(): any {
  if (!isInitialized || !bookIndex) {
    throw new Error('Vector store not initialized. Call initializeVectorStore() first.');
  }
  return bookIndex;
}

/**
 * Gets the Pinecone note index instance
 */
export function getNoteIndex(): any {
  if (!isInitialized || !noteIndex) {
    throw new Error('Vector store not initialized. Call initializeVectorStore() first.');
  }
  return noteIndex;
}

/**
 * Adds book chunks to the vector store
 */
export async function addBookChunks(
  bookId: string,
  userId: string,
  chunks: Array<{ content: string; metadata: any }>,
  embeddings: number[][]
): Promise<void> {
  try {
    if (!isInitialized || !bookIndex) {
      throw new Error('Vector store not initialized');
    }

    // Prepare vectors for Pinecone
    const vectors = chunks.map((chunk, index) => ({
      id: `${bookId}_chunk_${index}`,
      values: embeddings[index],
      metadata: {
        ...chunk.metadata,
        book_id: bookId,
        user_id: userId,
        type: 'book_chunk',
        content: chunk.content
      }
    }));

    // Upsert to Pinecone (upsert handles both insert and update)
    await bookIndex.upsert(vectors);

    console.log(`✅ Added ${chunks.length} chunks for book ${bookId}`);
  } catch (error) {
    console.error('❌ Failed to add book chunks to vector store:', error);
    throw error;
  }
}

/**
 * Searches for similar chunks in the vector store
 */
export async function searchSimilarChunks(
  query: string,
  userId: string,
  bookIds?: string[],
  limit: number = 10
): Promise<Array<{ content: string; metadata: any; score: number }>> {
  try {
    if (!isInitialized || !bookIndex) {
      throw new Error('Vector store not initialized');
    }

    // For now, we'll need to get embeddings from an external service
    // This is a placeholder - you'll need to implement embedding generation
    const queryEmbedding = await generateEmbedding(query);
    
    // Build filter for user and optional book filtering
    const filter: any = { user_id: { $eq: userId } };
    if (bookIds && bookIds.length > 0) {
      filter.book_id = { $in: bookIds };
    }

    // Query Pinecone
    const queryResponse = await bookIndex.query({
      vector: queryEmbedding,
      topK: limit,
      filter: filter,
      includeMetadata: true
    });

    // Transform results
    return queryResponse.matches.map((match: any) => ({
      content: match.metadata.content,
      metadata: match.metadata,
      score: match.score
    }));
  } catch (error) {
    console.error('❌ Failed to search vector store:', error);
    throw error;
  }
}

/**
 * Deletes all chunks for a specific book
 */
export async function deleteBookChunks(bookId: string, userId: string): Promise<void> {
  try {
    if (!isInitialized || !bookIndex) {
      throw new Error('Vector store not initialized');
    }

    // Delete chunks by book ID and user ID
    await bookIndex.deleteMany({
      filter: {
        book_id: { $eq: bookId },
        user_id: { $eq: userId }
      }
    });

    console.log(`✅ Deleted chunks for book ${bookId}`);
  } catch (error) {
    console.error('❌ Failed to delete book chunks:', error);
    throw error;
  }
}

/**
 * Gets collection statistics
 */
export async function getCollectionStats(): Promise<{ totalChunks: number; totalNotes: number }> {
  try {
    if (!isInitialized || !bookIndex || !noteIndex) {
      throw new Error('Vector store not initialized');
    }

    const bookStats = await bookIndex.describeIndexStats();
    const noteStats = await noteIndex.describeIndexStats();
    
    return {
      totalChunks: bookStats.totalVectorCount || 0,
      totalNotes: noteStats.totalVectorCount || 0
    };
  } catch (error) {
    console.error('❌ Failed to get collection stats:', error);
    throw error;
  }
}

/**
 * Placeholder function for generating embeddings
 * You'll need to implement this using an embedding service like OpenAI, Cohere, etc.
 */
async function generateEmbedding(text: string): Promise<number[]> {
  // TODO: Implement embedding generation
  // This is a placeholder that returns a dummy embedding
  // You should replace this with actual embedding generation
  console.warn('⚠️ Using placeholder embedding - implement generateEmbedding function');
  return new Array(1536).fill(0).map(() => Math.random() - 0.5);
}
