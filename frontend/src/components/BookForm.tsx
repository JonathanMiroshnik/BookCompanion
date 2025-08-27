import React, { useState } from 'react';
import './BookForm.css';

// Types
interface BookFormData {
  title: string;
  author?: string;
  isbn?: string;
  description?: string;
  pageCount?: number;
  genre?: string;
  tags: string[];
  readingStatus: 'not_started' | 'reading' | 'completed' | 'paused';
  currentPage: number;
  rating?: number;
  notes?: string;
}

interface BookFormProps {
  onSubmit: (data: BookFormData) => void;
  onCancel: () => void;
  initialData?: Partial<BookFormData>;
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    description: '',
    pageCount: undefined,
    genre: '',
    tags: [],
    readingStatus: 'not_started',
    currentPage: 0,
    rating: undefined,
    notes: '',
    ...initialData
  });

  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : parseInt(value)
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    onSubmit(formData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="book-form-overlay">
      <div className="book-form-modal">
        <div className="form-header">
          <h2>{initialData ? 'Edit Book' : 'Add New Book'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter book title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="author">Author</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author || ''}
                onChange={handleInputChange}
                placeholder="Enter author name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn || ''}
                onChange={handleInputChange}
                placeholder="Enter ISBN"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="genre">Genre</label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre || ''}
                onChange={handleInputChange}
                placeholder="e.g., Fiction, Science, History"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pageCount">Total Pages</label>
              <input
                type="number"
                id="pageCount"
                name="pageCount"
                value={formData.pageCount || ''}
                onChange={handleNumberInputChange}
                min="1"
                placeholder="Enter total pages"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="currentPage">Current Page</label>
              <input
                type="number"
                id="currentPage"
                name="currentPage"
                value={formData.currentPage}
                onChange={handleNumberInputChange}
                min="0"
                placeholder="Current page"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="readingStatus">Reading Status</label>
              <select
                id="readingStatus"
                name="readingStatus"
                value={formData.readingStatus}
                onChange={handleInputChange}
              >
                <option value="not_started">Not Started</option>
                <option value="reading">Reading</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <select
                id="rating"
                name="rating"
                value={formData.rating || ''}
                onChange={handleInputChange}
              >
                <option value="">No rating</option>
                <option value="1">⭐ 1</option>
                <option value="2">⭐⭐ 2</option>
                <option value="3">⭐⭐⭐ 3</option>
                <option value="4">⭐⭐⭐⭐ 4</option>
                <option value="5">⭐⭐⭐⭐⭐ 5</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="Enter book description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <div className="tags-input">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type tag and press Enter"
              />
              <button type="button" onClick={handleAddTag} className="add-tag-btn">
                Add
              </button>
            </div>
            <div className="tags-list">
              {formData.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tag)}
                    className="remove-tag-btn"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="Add any additional notes"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {initialData ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
