import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookList from '../components/BookList';
import BookForm from '../components/BookForm';
import { bookApi } from '../services/api';
import './DashboardPage.css';

// Types
interface Book {
  id: string;
  title: string;
  author?: string;
  description?: string;
  pageCount?: number;
  genre?: string;
  tags: string[];
  readingStatus: 'not_started' | 'reading' | 'completed' | 'paused';
  currentPage: number;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BookFormData {
  title: string;
  author?: string;
  description?: string;
  pageCount?: number;
  genre?: string;
  tags: string[];
  readingStatus: 'not_started' | 'reading' | 'completed' | 'paused';
  currentPage: number;
  rating?: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddBook, setShowAddBook] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bookApi.getAllBooks();
      
      if (response.success && response.data) {
        // Convert date strings back to Date objects
        const booksWithDates = response.data.map(book => ({
          ...book,
          createdAt: new Date(book.createdAt),
          updatedAt: new Date(book.updatedAt)
        }));
        setBooks(booksWithDates);
      } else {
        setError(response.error || 'Failed to fetch books');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (bookData: BookFormData) => {
    try {
      const response = await bookApi.createBook({
        title: bookData.title,
        author: bookData.author,
        pageCount: bookData.pageCount,
        genre: bookData.genre,
        tags: bookData.tags
      });

      if (response.success && response.data) {
        // Add the new book to the list
        const newBook = {
          ...response.data,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt)
        };
        setBooks(prev => [newBook, ...prev]);
        setShowAddBook(false);
        
        // Show success message (you could add a toast notification here)
        console.log('Book added successfully:', response.message);
      } else {
        setError(response.error || 'Failed to create book');
      }
    } catch (error) {
      console.error('Failed to add book:', error);
      setError('Failed to connect to the server');
    }
  };

  const handleBookClick = (bookId: string) => {
    navigate(`/books/${bookId}`);
  };

  const handleLogout = () => {
    // TODO: Implement logout
    // - Clear authentication token
    // - Redirect to login page
    
    console.log('Logout not implemented yet');
    navigate('/login');
  };

  const retryFetch = () => {
    fetchBooks();
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <header className="dashboard-header">
          <h1>📚 My Library</h1>
          <div className="header-actions">
            <button 
              className="add-book-btn"
              onClick={() => setShowAddBook(true)}
            >
              + Add Book
            </button>
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="dashboard-main">
          <div className="error-state">
            <h2>❌ Error Loading Books</h2>
            <p>{error}</p>
            <button 
              className="retry-btn"
              onClick={retryFetch}
            >
              Try Again
            </button>
          </div>
        </main>

        {showAddBook && (
          <BookForm
            onSubmit={handleAddBook}
            onCancel={() => setShowAddBook(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>📚 My Library</h1>
        <div className="header-actions">
          <button 
            className="add-book-btn"
            onClick={() => setShowAddBook(true)}
          >
            + Add Book
          </button>
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {books.length === 0 ? (
          <div className="empty-state">
            <h2>No books yet</h2>
            <p>Start building your reading library by adding your first book!</p>
            <button 
              className="add-first-book-btn"
              onClick={() => setShowAddBook(true)}
            >
              Add Your First Book
            </button>
          </div>
        ) : (
          <BookList 
            books={books}
            onBookClick={handleBookClick}
          />
        )}
      </main>

      {showAddBook && (
        <BookForm
          onSubmit={handleAddBook}
          onCancel={() => setShowAddBook(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
