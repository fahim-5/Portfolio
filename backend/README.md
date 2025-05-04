# Express Backend Server

A simple Express server using the MVC pattern.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the root directory with:
```
PORT=5000
NODE_ENV=development
```

## Running the server

Development mode with auto-restart:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Todos
- GET `/api/todos` - Get all todos
- GET `/api/todos/:id` - Get a single todo
- POST `/api/todos` - Create a new todo
- PUT `/api/todos/:id` - Update a todo
- DELETE `/api/todos/:id` - Delete a todo

## Tech Stack
- Express.js
- Node.js
- CORS for cross-origin requests 