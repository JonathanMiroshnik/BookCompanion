import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import routes
import { createAuthRoutes } from './routes/authRoutes';
import { createBookRoutes } from './routes/bookRoutes';
import { createNoteRoutes } from './routes/noteRoutes';
import { createAIRoutes } from './routes/aiRoutes';

// Import database initialization
import { initializeSQLite } from './db/sqlite';
// import { initializeVectorStore } from './db/vectorStore';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
})); // CORS support with frontend origin
app.use(morgan('combined')); // Logging
app.use(express.json()); // JSON body parsing
app.use(express.urlencoded({ extended: true })); // URL-encoded body parsing

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'BookCompanion Backend is running!'
  });
});

// Example working endpoints for demonstration
app.get('/api/example/books', (req, res) => {
  // This simulates what the real BookService would return
  const sampleBooks = [
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      readingStatus: 'reading',
      currentPage: 45,
      pageCount: 180,
      rating: 5,
      tags: ['classic', 'fiction', 'romance'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '2',
      title: '1984',
      author: 'George Orwell',
      readingStatus: 'completed',
      currentPage: 328,
      pageCount: 328,
      rating: 4,
      tags: ['dystopian', 'classic', 'political'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '3',
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      readingStatus: 'not_started',
      currentPage: 0,
      pageCount: 443,
      rating: null,
      tags: ['non-fiction', 'history', 'science'],
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25')
    }
  ];
  
  res.json({
    success: true,
    data: sampleBooks,
    total: sampleBooks.length,
    message: 'Sample books retrieved successfully'
  });
});

app.post('/api/example/books', (req, res) => {
  const { title, author, pageCount } = req.body;
  
  if (!title || !author) {
    return res.status(400).json({
      success: false,
      error: 'Title and author are required'
    });
  }
  
  // Simulate creating a new book
  const newBook = {
    id: Date.now().toString(),
    title,
    author,
    pageCount: pageCount || null,
    readingStatus: 'not_started',
    currentPage: 0,
    rating: null,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  res.status(201).json({
    success: true,
    data: newBook,
    message: 'Book created successfully'
  });
});

app.get('/api/example/books/:id', (req, res) => {
  const { id } = req.params;
  
  // Simulate fetching a specific book
  const book = {
    id,
    title: 'Sample Book',
    author: 'Sample Author',
    description: 'This is a sample book description that demonstrates the API connection.',
    pageCount: 300,
    genre: 'Fiction',
    tags: ['fiction', 'adventure', 'mystery'],
    readingStatus: 'reading',
    currentPage: 50,
    rating: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  };
  
  res.json({
    success: true,
    data: book,
    message: 'Book retrieved successfully'
  });
});

app.get('/api/example/books/:id/notes', (req, res) => {
  const { id } = req.params;
  
  // Simulate fetching notes for a book
  const notes = [
    {
      id: '1',
      title: 'Important quote',
      content: 'This is a sample note about an important quote from the book.',
      pageReference: 25,
      tags: ['quote', 'important'],
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Character analysis',
      content: 'The main character shows significant development throughout the story.',
      pageReference: 150,
      tags: ['character', 'analysis'],
      createdAt: new Date('2024-01-18')
    }
  ];
  
  res.json({
    success: true,
    data: notes,
    total: notes.length,
    message: 'Notes retrieved successfully'
  });
});

app.post('/api/example/ai/query', (req, res) => {
  const { query, bookId } = req.body;
  
  if (!query) {
    return res.status(400).json({
      success: false,
      error: 'Query is required'
    });
  }
  
  // Simulate AI response
  const aiResponse = {
    response: `This is a simulated AI response to your query: "${query}". In a real implementation, this would use the RAG pipeline to search through book content and provide relevant answers.`,
    sources: [
      {
        bookId: bookId || '1',
        passage: 'Sample passage from the book that would be retrieved by the AI.',
        page: 42,
        confidence: 0.95
      }
    ],
    metadata: {
      processingTime: '0.5s',
      tokensUsed: 150,
      model: 'gpt-4-simulated'
    }
  };
  
  // Simulate processing delay
  setTimeout(() => {
    res.json({
      success: true,
      data: aiResponse,
      message: 'AI query processed successfully'
    });
  }, 1000);
});

// Initialize databases and start server
async function startServer() {
  try {
    // Initialize SQLite database
    await initializeSQLite();
    console.log('✅ SQLite database initialized');
    
    // Initialize vector store
    // await initializeVectorStore();
    // console.log('✅ Vector store initialized');
    
    console.log('🔧 Creating API routes...');
    
    const authRoutes = createAuthRoutes();
    const bookRoutes = createBookRoutes();
    const noteRoutes = createNoteRoutes();
    const aiRoutes = createAIRoutes();
    
    // Register routes
    app.use('/api/auth', authRoutes);
    app.use('/api/books', bookRoutes);
    app.use('/api/notes', noteRoutes);
    app.use('/api/ai', aiRoutes);
    
    console.log('✅ API routes created and registered successfully');

    // Error handling middleware
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Error:', err.stack);
      res.status(500).json({ 
        success: false,
        error: 'Something went wrong!',
        message: err.message 
      });
    });

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({ 
        success: false,
        error: 'Route not found',
        message: `The route ${req.originalUrl} does not exist`
      });
    });

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 Example endpoints:`);
      console.log(`   - GET  /api/example/books`);
      console.log(`   - POST /api/example/books`);
      console.log(`   - GET  /api/example/books/:id`);
      console.log(`   - GET  /api/example/books/:id/notes`);
      console.log(`   - POST /api/example/ai/query`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
