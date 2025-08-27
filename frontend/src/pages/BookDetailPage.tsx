import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';
import AIChatBox from '../components/AIChatBox';
import { bookApi } from '../services/api';
import './BookDetailPage.css';

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

interface Note {
  id: string;
  title?: string;
  content: string;
  pageReference?: number;
  tags: string[];
  createdAt: Date;
}

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'ai'>('overview');

  useEffect(() => {
    if (!id) return;
    fetchBookData();
  }, [id]);

  const fetchBookData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch book details
      const bookResponse = await bookApi.getBookById(id!);
      if (bookResponse.success && bookResponse.data) {
        console.log('Book data:', bookResponse.data);
        const bookData = Array.isArray(bookResponse.data) ? bookResponse.data[0] : bookResponse.data;
        setBook({
          ...bookData,
          createdAt: new Date(bookData.createdAt),
          updatedAt: new Date(bookData.updatedAt)
        });
      } else {
        setError('Failed to fetch book details');
        return;
      }

      // Fetch book notes
      const notesResponse = await bookApi.getBookNotes(id!);
      if (notesResponse.success && notesResponse.data) {
        const notesWithDates = notesResponse.data.map(note => ({
          ...note,
          createdAt: new Date(note.createdAt)
        }));
        setNotes(notesWithDates);
      } else {
        console.warn('Failed to fetch notes:', notesResponse.error);
        setNotes([]);
      }
    } catch (error) {
      console.error('Error fetching book data:', error);
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (noteData: Omit<Note, 'id' | 'createdAt'>) => {
    try {
      // TODO: Implement add note API call
      // For now, simulate adding a note
      const newNote: Note = {
        id: Date.now().toString(),
        ...noteData,
        createdAt: new Date()
      };
      
      setNotes(prev => [newNote, ...prev]);
      setShowAddNote(false);
      
      console.log('Note added successfully (simulated)');
    } catch (error) {
      console.error('Failed to add note:', error);
      setError('Failed to add note');
    }
  };

  const handleUpdateReadingProgress = async (currentPage: number) => {
    try {
      // TODO: Implement update reading progress API call
      console.log('Update reading progress not implemented yet', currentPage);
    } catch (error) {
      console.error('Failed to update reading progress:', error);
      setError('Failed to update reading progress');
    }
  };

  const retryFetch = () => {
    fetchBookData();
  };

  if (loading) {
    return (
      <div className="book-detail-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-detail-page">
        <header className="book-header">
          <button 
            className="back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Library
          </button>
        </header>
        
        <main className="book-content">
          <div className="error-state">
            <h2>❌ Error Loading Book</h2>
            <p>{error || 'Book not found'}</p>
            <button 
              className="retry-btn"
              onClick={retryFetch}
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="book-detail-page">
      <header className="book-header">
        <button 
          className="back-btn"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Library
        </button>
        
        <div className="book-title-section">
          <h1>{book.title}</h1>
          {book.author && <p className="book-author">by {book.author}</p>}
        </div>
      </header>

      <nav className="book-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
        <button 
          className={`tab ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          AI Assistant
        </button>
      </nav>

      <main className="book-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="book-info">
              {book.description && (
                <div className="book-description">
                  <h3>Description</h3>
                  <p>{book.description}</p>
                </div>
              )}
              
              <div className="book-details">
                <div className="detail-item">
                  <span className="label">Genre:</span>
                  <span className="value">{book.genre || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Pages:</span>
                  <span className="value">{book.pageCount || 'Unknown'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className="value">{book.readingStatus}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Current Page:</span>
                  <span className="value">{book.currentPage}</span>
                </div>
                {book.rating && (
                  <div className="detail-item">
                    <span className="label">Rating:</span>
                    <span className="value">{'⭐'.repeat(book.rating)}</span>
                  </div>
                )}
              </div>
              
              <div className="book-tags">
                <h3>Tags</h3>
                <div className="tags-list">
                  {book.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="notes-tab">
            <div className="notes-header">
              <h3>Notes</h3>
              <button 
                className="add-note-btn"
                onClick={() => setShowAddNote(true)}
              >
                + Add Note
              </button>
            </div>
            
            <NoteList 
              notes={notes}
              onNoteClick={(noteId) => console.log('Note clicked:', noteId)}
            />
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="ai-tab">
            <h3>AI Assistant</h3>
            <p>Ask questions about this book and get AI-powered insights!</p>
            <AIChatBox bookId={book.id} />
          </div>
        )}
      </main>

      {showAddNote && (
        <NoteForm
          onSubmit={handleAddNote}
          onCancel={() => setShowAddNote(false)}
        />
      )}
    </div>
  );
};

export default BookDetailPage;
