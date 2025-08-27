# 📚 BookCompanion - Reading Tracker with AI Assistant

A full-stack TypeScript application that helps users track their reading progress and interact with an AI assistant powered by Retrieval-Augmented Generation (RAG).

## 🏗️ Project Structure

This is a **skeleton project** with placeholder implementations. The goal is to have the structure and responsibilities clearly defined, so you can later fill in the business logic.

### Backend (`backend/`)
- **Express.js server** with TypeScript
- **SQLite database** for relational data (books, notes, users)
- **Chroma vector database** for storing book embeddings
- **Google OAuth** authentication
- **LangChain/LangGraph** integration for RAG pipeline

### Frontend (`frontend/`)
- **React** with TypeScript
- **React Router** for navigation
- **Component-based architecture** for reusability
- **Responsive design** for mobile and desktop

## 🚀 Features (Skeleton)

### Authentication
- [ ] Google OAuth login/logout
- [ ] JWT token management
- [ ] Protected routes

### Book Management
- [ ] CRUD operations for books
- [ ] Reading progress tracking
- [ ] Tags and categorization
- [ ] Book content ingestion (PDF, text)

### Note Taking
- [ ] CRUD operations for notes
- [ ] Page references
- [ ] Tagging system
- [ ] Search and filtering

### AI Assistant
- [ ] RAG-powered question answering
- [ ] Book content analysis
- [ ] Conversational chat interface
- [ ] Source citations

## 📁 File Structure

```
BookCompanion/
├── backend/
│   ├── src/
│   │   ├── server.ts              # Main Express server
│   │   ├── routes/                # API route definitions
│   │   │   ├── authRoutes.ts      # Google OAuth endpoints
│   │   │   ├── bookRoutes.ts      # Book CRUD endpoints
│   │   │   ├── noteRoutes.ts      # Note CRUD endpoints
│   │   │   └── aiRoutes.ts        # AI assistant endpoints
│   │   ├── controllers/           # Request handlers
│   │   │   ├── AuthController.ts  # OAuth logic
│   │   │   ├── BookController.ts  # Book operations
│   │   │   ├── NoteController.ts  # Note operations
│   │   │   └── AIController.ts    # AI operations
│   │   ├── services/              # Business logic
│   │   │   ├── AuthService.ts     # Authentication service
│   │   │   ├── BookService.ts     # Book service
│   │   │   ├── NoteService.ts     # Note service
│   │   │   └── AIService.ts       # AI/RAG service
│   │   ├── db/                    # Database layer
│   │   │   ├── sqlite.ts          # SQLite setup
│   │   │   └── vectorStore.ts     # Chroma setup
│   │   ├── middleware/            # Express middleware
│   │   │   └── authMiddleware.ts  # JWT validation
│   │   └── types/                 # TypeScript interfaces
│   │       ├── User.ts            # User types
│   │       ├── Book.ts            # Book types
│   │       └── Note.ts            # Note types
│   ├── package.json               # Backend dependencies
│   └── tsconfig.json              # TypeScript config
├── frontend/
│   ├── src/
│   │   ├── App.tsx                # Main app with routing
│   │   ├── pages/                 # Page components
│   │   │   ├── LoginPage.tsx      # Google OAuth login
│   │   │   ├── DashboardPage.tsx  # Book library view
│   │   │   └── BookDetailPage.tsx # Book details + AI chat
│   │   ├── components/            # Reusable components
│   │   │   ├── PrivateRoute.tsx   # Auth protection
│   │   │   ├── BookList.tsx       # Book grid/list
│   │   │   ├── BookForm.tsx       # Add/edit book
│   │   │   ├── NoteList.tsx       # Note display
│   │   │   ├── NoteForm.tsx       # Add/edit note
│   │   │   └── AIChatBox.tsx      # AI chat interface
│   │   └── index.tsx              # React entry point
│   ├── package.json               # Frontend dependencies
│   └── tsconfig.json              # TypeScript config
└── README.md                      # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- SQLite3
- ChromaDB (optional, for vector storage)

### Backend Setup
```bash
cd backend
npm install
npm run build
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables
Create `.env` files in both `backend/` and `frontend/` directories:

**Backend (.env)**
```env
PORT=5000
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
CHROMA_URL=http://localhost:8000
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔧 Implementation Notes

### What's Implemented (Skeleton)
- ✅ Project structure and file organization
- ✅ TypeScript interfaces and types
- ✅ Express server setup with middleware
- ✅ Route definitions and controllers
- ✅ Service layer architecture
- ✅ Database schemas and initialization
- ✅ React component structure
- ✅ Routing and navigation
- ✅ Form components and state management

### What Needs Implementation
- 🔴 Google OAuth flow and JWT handling
- 🔴 Database CRUD operations
- 🔴 Vector database integration
- 🔴 LangChain/LangGraph RAG pipeline
- 🔴 API integration between frontend/backend
- 🔴 Error handling and validation
- 🔴 CSS styling and responsive design
- 🔴 Testing and error boundaries

## 🎯 Next Steps

1. **Set up Google OAuth credentials** in Google Cloud Console
2. **Implement authentication flow** in `AuthService` and `AuthController`
3. **Add database operations** in service classes
4. **Integrate ChromaDB** for vector storage
5. **Implement LangChain pipeline** for RAG functionality
6. **Connect frontend to backend APIs**
7. **Add proper error handling** and loading states
8. **Style components** with CSS
9. **Add tests** for critical functionality

## 🧠 AI/RAG Pipeline Architecture

The AI assistant uses a Retrieval-Augmented Generation approach:

1. **Content Ingestion**: Book content is chunked and embedded
2. **Vector Storage**: Embeddings stored in ChromaDB
3. **Query Processing**: User questions are embedded and matched
4. **Context Retrieval**: Relevant passages retrieved from vector store
5. **Response Generation**: LLM generates answers using retrieved context
6. **Source Citation**: Responses include source passages and page numbers

## 📚 Tech Stack

- **Backend**: Node.js, Express, TypeScript, SQLite, ChromaDB
- **Frontend**: React, TypeScript, React Router
- **AI**: LangChain, LangGraph, OpenAI embeddings
- **Auth**: Google OAuth, JWT
- **Database**: SQLite (relational), ChromaDB (vector)

## 🤝 Contributing

This is a skeleton project designed for learning and development. Feel free to:

1. Implement the TODO items
2. Add new features
3. Improve the architecture
4. Add tests and documentation
5. Enhance the UI/UX

## 📄 License

ISC License - see LICENSE file for details.
