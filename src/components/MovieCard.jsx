import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { isFavoriteMovie, toggleFavoriteMovie } from "../utils/favorites";

const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const MovieCard = ({ movie, onFavoritesChange }) => {
  const {
    id,
    title,
    poster_path,
    vote_average,
    original_language,
    release_date,
    genre_ids,
  } = movie;

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(isFavoriteMovie(id));
  }, [id]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const updatedFavorites = toggleFavoriteMovie(movie);
    const existsNow = updatedFavorites.some((fav) => fav.id === id);

    setIsFavorite(existsNow);

    if (onFavoritesChange) {
      onFavoritesChange(updatedFavorites);
    }
  };

  const genreText =
    genre_ids && genre_ids.length > 0
      ? genre_ids
          .slice(0, 2)
          .map((genreId) => genreMap[genreId])
          .filter(Boolean)
          .join(", ")
      : "N/A";

  return (
    <li>
      <Link to={`/movie/${id}`} className="movie-card-link">
        <div className="movie-card">
          <button
            className={`favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={handleFavoriteClick}
          >
            {isFavorite ? "♥" : "♡"}
          </button>

          <img
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : "https://placehold.co/600x900/1a1a1a/ffffff?text=No+Image"
            }
            alt={title}
          />

          <div className="movie-hover">
            <p><strong>Rating:</strong> {vote_average ? vote_average.toFixed(1) : "N/A"}</p>
            <p><strong>Language:</strong> {original_language?.toUpperCase() || "N/A"}</p>
            <p><strong>Genre:</strong> {genreText}</p>
          </div>

          <div className="mt-4">
            <h3>{title}</h3>

            <div className="content">
              <p className="year">
                {release_date ? release_date.split("-")[0] : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default MovieCard;