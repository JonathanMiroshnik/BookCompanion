import React from 'react';
import './NoteList.css';

// Types
interface Note {
  id: string;
  title?: string;
  content: string;
  pageReference?: number;
  tags: string[];
  createdAt: Date;
}

interface NoteListProps {
  notes: Note[];
  onNoteClick: (noteId: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onNoteClick }) => {
  if (notes.length === 0) {
    return (
      <div className="note-list">
        <div className="empty-notes">
          <p>No notes yet for this book.</p>
          <p>Add your first note to start tracking your thoughts!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="note-list">
      {notes.map(note => (
        <div 
          key={note.id} 
          className="note-card"
          onClick={() => onNoteClick(note.id)}
        >
          <div className="note-header">
            {note.title && <h4 className="note-title">{note.title}</h4>}
            {note.pageReference && (
              <span className="page-reference">Page {note.pageReference}</span>
            )}
          </div>
          
          <div className="note-content">
            <p>{note.content}</p>
          </div>
          
          {note.tags.length > 0 && (
            <div className="note-tags">
              {note.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
          
          <div className="note-footer">
            <span className="note-date">
              {note.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
