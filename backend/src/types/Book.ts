export interface Book {
  id: string;
  userId: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookData {
  title: string;
  author?: string;
  isbn?: string;
  description?: string;
  pageCount?: number;
  genre?: string;
  tags?: string[];
  readingStatus?: 'not_started' | 'reading' | 'completed' | 'paused';
  currentPage?: number;
  rating?: number;
  notes?: string;
}

export interface UpdateBookData {
  title?: string;
  author?: string;
  isbn?: string;
  description?: string;
  pageCount?: number;
  genre?: string;
  tags?: string[];
  readingStatus?: 'not_started' | 'reading' | 'completed' | 'paused';
  currentPage?: number;
  rating?: number;
  notes?: string;
}

// export interface BookWithNotes extends Book {
//   notes: Note[];
// }

export interface Note {
  id: string;
  bookId: string;
  userId: string;
  title?: string;
  content: string;
  pageReference?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
