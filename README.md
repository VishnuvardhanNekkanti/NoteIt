# NoteIt

A beautiful, full-stack MERN notes app built with React, TypeScript, Vite, Tailwind CSS, and Express + MongoDB.

![NoteIt UI](./public/notepad.svg)

## Features

- 📝 Create, edit, delete, and pin notes
- 🔍 Search and filter notes by title, content, and category
- 🏷️ Categorize notes (Personal, Work, Study, Ideas, Projects, Travel)
- 🌙 Dark mode toggle
- 📦 Export notes to JSON
- ⚡ Fast, modern UI with Vite and Tailwind CSS
- 🗄️ Backend API with Express and MongoDB

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose

## Getting Started

### Prerequisites
- Node.js & npm
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd mern-notes-app
   ```

2. **Install dependencies:**
   ```sh
   cd backend
   npm install
   cd ../project
   npm install
   ```

3. **Start MongoDB:**
   - Make sure MongoDB is running locally (`mongodb://localhost:27017/mern_notes`) or update the connection string in `backend/server.js`.

4. **Run the backend:**
   ```sh
   cd backend
   npm start
   ```

5. **Run the frontend:**
   ```sh
   cd ../project
   npm run dev
   ```

6. **Open in browser:**
   - Visit [http://localhost:5173](http://localhost:5173)

## Folder Structure

```
mern-notes-app/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── project/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── ...
```

## API Endpoints

- `GET /api/notes` — Fetch all notes
- `POST /api/notes` — Create a new note
- `PUT /api/notes/:id` — Update a note
- `DELETE /api/notes/:id` — Delete a note

## Customization

- Change categories in `src/components/NoteForm.tsx`
- Update theme in `tailwind.config.js`
- Replace favicon in `public/notepad.svg`

## Screenshots

> Add screenshots of your app here for a more visual README!

## License

MIT

---


