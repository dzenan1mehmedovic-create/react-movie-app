const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <img
        src={movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "/no-movie.png"}
        alt={movie.title}
      />

      <h3>{movie.title}</h3>
    </div>
  );
};

export default MovieCard;