export const getFavorites = () => {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
};

export const isFavoriteMovie = (movieId) => {
  const favorites = getFavorites();
  return favorites.some((movie) => movie.id === movieId);
};

export const toggleFavoriteMovie = (movie) => {
  const favorites = getFavorites();

  const exists = favorites.some((fav) => fav.id === movie.id);

  let updatedFavorites;

  if (exists) {
    updatedFavorites = favorites.filter((fav) => fav.id !== movie.id);
  } else {
    updatedFavorites = [...favorites, movie];
  }

  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  return updatedFavorites;
};
