// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Book {
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

export interface Note {
  id?: string;
  bookId: string;
  title?: string;
  content: string;
  pageReference?: number;
  tags: string[];
  createdAt: Date;
}

export interface AIQueryResponse {
  response: string;
  sources: Array<{
    bookId: string;
    passage: string;
    page?: number;
    confidence: number;
  }>;
  metadata: any;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Book API functions
export const bookApi = {
  // Get all books
  async getAllBooks(userId: string): Promise<ApiResponse<Book[]>> {
    return apiRequest<Book[]>(`/books?userId=${userId}`);
  },

  // Get a specific book
  async getBookById(id: string): Promise<ApiResponse<Book[]>> {
    return apiRequest<Book[]>(`/books/${id}`);
  },

  // Create a new book
  async createBook(bookData: {
    title: string;
    author?: string;
    pageCount?: number;
    genre?: string;
    tags?: string[];
  }, userId: string): Promise<ApiResponse<Book>> {
    return apiRequest<Book>('/books', {
      method: 'POST',
      body: JSON.stringify({
        book: {...bookData},
        userId: userId
      }),
    });
  },

  // Get notes for a book
  async getBookNotes(bookId: string, userId: string): Promise<ApiResponse<Note[]>> {
    return apiRequest<Note[]>(`/books/${bookId}/notes?userId=${userId}`);
  },

  // Update a book
  async updateBook(bookId: string, bookData: Partial<Book>, userId: string): Promise<ApiResponse<Book>> {
    return apiRequest<Book>(`/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify({
        book: {...bookData},
        userId: userId
      }),
    });
  },
};

// Note API functions
export const noteApi = {
  // Create a new note
  async createNote(bookId: string, noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'bookId'>, userId: string): Promise<ApiResponse<Note>> {
    return apiRequest<Note>(`/books/${bookId}/notes`, {
      method: 'POST',
      body: JSON.stringify({
        note: {...noteData},
        userId: userId
      }),
    });
  },

  // Get all notes for a book
  async getBookNotes(bookId: string): Promise<ApiResponse<Note[]>> {
    return apiRequest<Note[]>(`/books/${bookId}/notes`);
  },

  // Get a specific note
  async getBookNote(bookId: string, noteId: string): Promise<ApiResponse<Note>> {
    return apiRequest<Note>(`/books/${bookId}/notes/${noteId}`);
  },

  // Update a specific note
  async updateBookNote(bookId: string, noteId: string, noteData: Partial<Note>): Promise<ApiResponse<Note>> {
    return apiRequest<Note>(`/books/${bookId}/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
  }
};

// AI API functions
export const aiApi = {
  // Send a query to the AI assistant
  async queryAI(query: string, bookId?: string): Promise<ApiResponse<AIQueryResponse>> {
    return apiRequest<AIQueryResponse>('/ai/query', {
      method: 'POST',
      body: JSON.stringify({ query, bookId }),
    });
  },
};

// Health check function
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

// Export the base API URL for debugging
export { API_BASE_URL };
