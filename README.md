# React Movie App

A modern movie browsing web application built with React, Vite, TMDB API, and Appwrite.

---

## Features

- Search movies (with debounce)
- Filter movies by genre
- Sort movies by Name, Year and Rating
- Movie details page
- Trending movies (tracked with Appwrite)
- Favorites (stored locally)
- Authentication (login/register)
- Hover popup with rating, language and genre
- Clean and responsive UI

---

## Tech Stack

- React (Vite)
- React Router DOM
- Appwrite
- TMDB API
- CSS

---

## Installation

Clone the repository:

```bash
git clone https://github.com/dzenan1mehmedovic-create/react-movie-app.git
cd react-movie-app
npm install
```

---

## Running the project

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal, usually:

http://localhost:5173

---

## Environment Variables

Create a `.env.local` file in the root of the project and add:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
```

Important:

- Do not push `.env` or `.env.local` to GitHub
- They are included in `.gitignore`
- Use `.env.example` as a template

---

## Notes

- Movie data is fetched from TMDB API
- Trending movies are stored using Appwrite
- Favorites are stored in localStorage
- Authentication is handled with Appwrite

---

## Author

GitHub: https://github.com/dzenan1mehmedovic-create
