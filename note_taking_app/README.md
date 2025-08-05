
# Note-Taking App

## 1. Project Overview

This project is a Note-Taking App built using Node.js, Express.js, MongoDB, and a simple front-end with HTML, CSS, and JavaScript. It allows users to create, read, update, and delete their own notes with secure user authentication.

---

## 2. Setup Instructions

Follow these steps to run the project locally:

1. **Clone the repository:**

   git clone <your-repo-url>

2. **Navigate into the project directory:**

   cd <your-project-folder>

3. **Install dependencies:**

   npm install

4. **Create a `.env` file in the root folder with these variables:**

   PORT=3000  
   MONGODB_URI=your_mongodb_connection_string  
   JWT_SECRET=your_jwt_secret_key

5. **Start the server:**

   npm start

6. **Open your browser and go to:**

   http://localhost:3000

---

## 3. API Endpoints

All endpoints require the user to be authenticated except for login/signup (if implemented).

### Notes

- **GET /api/notes**

  Retrieves all notes for the logged-in user.

  Response example:

  [
    {
      "_id": "note_id",
      "title": "Sample note",
      "content": "Note content",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ]

- **POST /api/notes**

  Creates a new note.

  Request body example:

  {
    "title": "New note",
    "content": "Note content"
  }

  Response: The created note object.

- **PUT /api/notes/:id**

  Updates a note by ID.

  Request body example:

  {
    "title": "Updated title",
    "content": "Updated content"
  }

  Response: The updated note object.

- **DELETE /api/notes/:id**

  Deletes a note by ID.

  Response: Success message.

### User Profile

- **GET /api/users/me**

  Retrieves current user profile information.

- **PUT /api/users/me**

  Updates user profile information.

  Request body example:

  {
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com"
  }

- **POST /api/users/logout**

  Logs the user out.

---

## 4. Important Details

- Authentication is implemented to ensure each user can only access and modify their own notes.
- All incoming data is validated on the server. If invalid, the API returns clear error messages.
- The front-end interface is simple and user-friendly, allowing users to view, add, edit, and delete notes easily.
- The server uses JSON format for all API requests and responses.
- JWT tokens are stored securely in HTTP-only cookies to manage user sessions.

---

## 5. What I Learned

- How to build a full-stack web application using Node.js and Express.
- How to connect and interact with a MongoDB database using Mongoose.
- Implementing secure user authentication with JWT.
- Designing and documenting RESTful APIs.
- Building a clean front-end interface with vanilla JavaScript, HTML, and CSS.
- Handling asynchronous programming and error handling in JavaScript.

---

Thank you for reviewing my midterm project!

---
