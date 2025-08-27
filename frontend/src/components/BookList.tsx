import React from 'react';
import './BookList.css';

// Types
interface Book {
  id: string;
  title: string;
  author?: string;
  readingStatus: 'not_started' | 'reading' | 'completed' | 'paused';
  currentPage: number;
  pageCount?: number;
  rating?: number;
  tags: string[];
  createdAt: Date;
}

interface BookListProps {
  books: Book[];
  onBookClick: (bookId: string) => void;
  onEditBookClick: (bookId: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onBookClick, onEditBookClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'reading': return 'status-reading';
      case 'paused': return 'status-paused';
      default: return 'status-not-started';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '✓ Completed';
      case 'reading': return '📖 Reading';
      case 'paused': return '⏸️ Paused';
      default: return '📚 Not Started';
    }
  };

  const getProgressPercentage = (currentPage: number, pageCount?: number) => {
    if (!pageCount) return 0;
    return Math.round((currentPage / pageCount) * 100);
  };

  return (
    <div className="book-list">
      {books.map(book => (
        <div 
          key={book.id} 
          className="book-card"
          onClick={() => onBookClick(book.id)}
        >
          <div className="book-header">
            <h3 className="book-title">{book.title}</h3>
            {book.author && <p className="book-author">{book.author}</p>}

            <div className="edit-book-button">
              <button 
                className="edit-book-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditBookClick(book.id);
                }}
              >
                <span className="edit-book-icon">📝</span>
                <span className="edit-book-text">Edit Book</span>
              </button>
            </div>
          </div>
          
          <div className="book-status">
            <span className={`status-badge ${getStatusColor(book.readingStatus)}`}>
              {getStatusLabel(book.readingStatus)}
            </span>
          </div>
          
          {book.pageCount && (
            <div className="book-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${getProgressPercentage(book.currentPage, book.pageCount)}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {book.currentPage} / {book.pageCount} pages
              </span>
            </div>
          )}
          
          {book.rating && (
            <div className="book-rating">
              <span className="rating-stars">{'⭐'.repeat(book.rating)}</span>
            </div>
          )}
          
          <div className="book-tags">
            {book.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
            {book.tags.length > 3 && (
              <span className="tag-more">+{book.tags.length - 3} more</span>
            )}
          </div>
          
          <div className="book-date">
            Added {book.createdAt.toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookList;
