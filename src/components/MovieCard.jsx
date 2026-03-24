import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const {
    id,
    title,
    poster_path,
    vote_average,
    original_language,
    release_date,
  } = movie;

  return (
    <li>
      <Link to={`/movie/${id}`} className="movie-card-link">
        <div className="movie-card">
          <img
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : "https://placehold.co/600x900/1a1a1a/ffffff?text=No+Image"
            }
            alt={title}
          />

          <div className="mt-4">
            <h3>{title}</h3>

            <div className="content">
              <div className="rating">
                <p>⭐ {vote_average ? vote_average.toFixed(1) : "N/A"}</p>
              </div>

              <span>•</span>
              <p className="lang">{original_language || "N/A"}</p>

              <span>•</span>
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