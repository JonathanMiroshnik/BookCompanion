import React, { useState } from 'react';
import { bookApi, aiApi, healthCheck } from '../services/api';
import './ApiTestPage.css';

const ApiTestPage: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<string>('Not checked');
  const [books, setBooks] = useState<any[]>([]);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loading, setLoading] = useState<string>('');

  const testHealthCheck = async () => {
    setLoading('health');
    try {
      const isHealthy = await healthCheck();
      setHealthStatus(isHealthy ? '✅ Backend is healthy!' : '❌ Backend is not responding');
    } catch (error) {
      setHealthStatus('❌ Health check failed');
    } finally {
      setLoading('');
    }
  };

  const testGetBooks = async () => {
    setLoading('books');
    const userId = '123';
    try {
      const response = await bookApi.getAllBooks(userId);
      if (response.success && response.data) {
        setBooks(response.data);
      } else {
        setBooks([]);
        console.error('Failed to get books:', response.error);
      }
    } catch (error) {
      console.error('Error getting books:', error);
      setBooks([]);
    } finally {
      setLoading('');
    }
  };

  const testCreateBook = async () => {
    const userId = '123';

    setLoading('create');
    try {
      const response = await bookApi.createBook({
        title: 'Test Book ' + Date.now(),
        author: 'Test Author',
        pageCount: 200,
        genre: 'Test',
        tags: ['test', 'demo']
      }, userId);
      
      if (response.success) {
        alert('Book created successfully! Check the books list.');
        testGetBooks(); // Refresh the list
      } else {
        alert('Failed to create book: ' + response.error);
      }
    } catch (error) {
      console.error('Error creating book:', error);
      alert('Error creating book');
    } finally {
      setLoading('');
    }
  };

  const testAIQuery = async () => {
    setLoading('ai');
    try {
      const response = await aiApi.queryAI('What is this book about?', '1');
      if (response.success && response.data) {
        setAiResponse(response.data.response);
      } else {
        setAiResponse('AI query failed: ' + response.error);
      }
    } catch (error) {
      console.error('Error querying AI:', error);
      setAiResponse('Error querying AI');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="api-test-page">
      <div className="container">
        <h1>🔗 API Connection Test</h1>
        <p>This page tests the connection between frontend and backend APIs.</p>

        <div className="test-section">
          <h2>1. Health Check</h2>
          <button 
            onClick={testHealthCheck}
            disabled={loading === 'health'}
            className="test-btn"
          >
            {loading === 'health' ? 'Checking...' : 'Test Backend Health'}
          </button>
          <div className="result">
            <strong>Status:</strong> {healthStatus}
          </div>
        </div>

        <div className="test-section">
          <h2>2. Get Books</h2>
          <button 
            onClick={testGetBooks}
            disabled={loading === 'books'}
            className="test-btn"
          >
            {loading === 'books' ? 'Loading...' : 'Fetch Books'}
          </button>
          <div className="result">
            <strong>Books Found:</strong> {books.length}
            {books.length > 0 && (
              <div className="books-list">
                {books.map(book => (
                  <div key={book.id} className="book-item">
                    <strong>{book.title}</strong> by {book.author}
                    <span className="book-status">({book.readingStatus})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="test-section">
          <h2>3. Create Book</h2>
          <button 
            onClick={testCreateBook}
            disabled={loading === 'create'}
            className="test-btn"
          >
            {loading === 'create' ? 'Creating...' : 'Create Test Book'}
          </button>
          <div className="result">
            <strong>Note:</strong> This will create a test book with a unique title
          </div>
        </div>

        <div className="test-section">
          <h2>4. AI Query</h2>
          <button 
            onClick={testAIQuery}
            disabled={loading === 'ai'}
            className="test-btn"
          >
            {loading === 'ai' ? 'Processing...' : 'Test AI Query'}
          </button>
          <div className="result">
            <strong>AI Response:</strong>
            {aiResponse && (
              <div className="ai-response">
                {aiResponse}
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <h2>📋 API Endpoints Being Tested</h2>
          <ul>
            <li><code>GET /health</code> - Backend health check</li>
            <li><code>GET /api/example/books</code> - Get all books</li>
            <li><code>POST /api/example/books</code> - Create a new book</li>
            <li><code>POST /api/example/ai/query</code> - AI assistant query</li>
          </ul>
          
          <h3>🔧 How to Test</h3>
          <ol>
            <li>Make sure your backend is running on <code>http://localhost:5000</code></li>
            <li>Click each test button to verify the API connection</li>
            <li>Check the browser console for any errors</li>
            <li>Verify that data flows between frontend and backend</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;
