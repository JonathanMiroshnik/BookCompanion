import React, { useState } from 'react';
import './NoteForm.css';

// Types
interface NoteFormData {
  title?: string;
  content: string;
  pageReference?: number;
  tags: string[];
}

interface NoteFormProps {
  onSubmit: (data: NoteFormData) => void;
  onCancel: () => void;
  initialData?: Partial<NoteFormData>;
}

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    pageReference: undefined,
    tags: [],
    ...initialData
  });

  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (!formData.content.trim()) return;
    
    onSubmit(formData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="note-form-overlay">
      <div className="note-form-modal">
        <div className="form-header">
          <h2>{initialData ? 'Edit Note' : 'Add New Note'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="note-form">
          <div className="form-group">
            <label htmlFor="title">Title (Optional)</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              placeholder="Give your note a title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={6}
              placeholder="Write your note here..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="pageReference">Page Reference</label>
            <input
              type="number"
              id="pageReference"
              name="pageReference"
              value={formData.pageReference || ''}
              onChange={handleNumberInputChange}
              min="1"
              placeholder="Page number (optional)"
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

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {initialData ? 'Update Note' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
