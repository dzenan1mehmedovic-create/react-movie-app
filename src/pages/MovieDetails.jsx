import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetails = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}?append_to_response=videos`,
          API_OPTIONS
        );

        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error(error);
        setErrorMessage("Error fetching movie details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (isLoading) {
    return (
      <main>
        <div className="wrapper">
          <Spinner />
        </div>
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main>
        <div className="wrapper">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
          <p className="error-message">{errorMessage || "Movie not found."}</p>
        </div>
      </main>
    );
  }

  const trailer = movie.videos?.results?.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper details-page">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>

        <section className="movie-details">
          <div className="movie-details-poster">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://placehold.co/600x900/1a1a1a/ffffff?text=No+Image"
              }
              alt={movie.title}
            />
          </div>

          <div className="movie-details-content">
            <h1>{movie.title}</h1>

            <div className="movie-meta">
              <span>⭐ {movie.vote_average?.toFixed(1) || "N/A"}</span>
              <span>•</span>
              <span>{movie.release_date?.split("-")[0] || "N/A"}</span>
              <span>•</span>
              <span>{movie.runtime ? `${movie.runtime} min` : "N/A"}</span>
            </div>

            <p className="movie-overview">{movie.overview || "No overview available."}</p>

            <div className="movie-extra">
              <p>
                <strong>Language:</strong> {movie.original_language?.toUpperCase() || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {movie.status || "N/A"}
              </p>
              <p>
                <strong>Genres:</strong>{" "}
                {movie.genres?.length
                  ? movie.genres.map((genre) => genre.name).join(", ")
                  : "N/A"}
              </p>
            </div>

            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noreferrer"
                className="trailer-button"
              >
                Watch Trailer
              </a>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default MovieDetails;