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

export interface CreateNoteData {
  bookId: string;
  title?: string;
  content: string;
  pageReference?: number;
  tags?: string[];
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  pageReference?: number;
  tags?: string[];
}

export interface NoteSearchParams {
  query?: string;
  bookId?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  page?: number;
  limit?: number;
}
