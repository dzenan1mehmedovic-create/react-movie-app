import { useEffect, useMemo, useState } from "react";
import {
  Routes,
  Route,
  Link,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDebounce } from "react-use";

import Search from "./components/Search";
import MovieCard from "./components/MovieCard";
import Spinner from "./components/Spinner";
import MovieDetails from "./pages/MovieDetails";
import Auth from "./pages/Auth";

import { getTrendingMovies, updateSearchCount } from "./appwrite";
import { getFavorites } from "./utils/favorites";
import { getCurrentUser, logoutUser } from "./appwriteAuth";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

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

const genreList = ["All", ...Object.values(genreMap)];

const HomePage = ({
  movieList,
  trendingMovies,
  favoriteMovies,
  isLoading,
  errorMessage,
  selectedGenre,
  setSelectedGenre,
  sortBy,
  setSortBy,
  setFavoriteMovies,
}) => {
  const filteredAndSortedMovies = useMemo(() => {
    let updatedMovies = [...movieList];

    if (selectedGenre !== "All") {
      updatedMovies = updatedMovies.filter((movie) =>
        movie.genre_ids?.some((id) => genreMap[id] === selectedGenre)
      );
    }

    if (sortBy === "name") {
      updatedMovies.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "year") {
      updatedMovies.sort((a, b) => {
        const yearA = a.release_date
          ? parseInt(a.release_date.split("-")[0])
          : 0;
        const yearB = b.release_date
          ? parseInt(b.release_date.split("-")[0])
          : 0;
        return yearB - yearA;
      });
    } else if (sortBy === "rating") {
      updatedMovies.sort(
        (a, b) => (b.vote_average || 0) - (a.vote_average || 0)
      );
    }

    return updatedMovies;
  }, [movieList, selectedGenre, sortBy]);

  return (
    <>
      <div className="filters-row">
        <div className="genre-filter">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {genreList.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-filter">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Sort by</option>
            <option value="name">Name</option>
            <option value="year">Year</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {favoriteMovies.length > 0 && (
        <section className="favorites-section">
          <h2>Favorite Movies</h2>
          <ul>
            {favoriteMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onFavoritesChange={setFavoriteMovies}
              />
            ))}
          </ul>
        </section>
      )}

      {trendingMovies.length > 0 && (
        <section className="trending">
          <h2>Trending Movies</h2>
          <ul>
            {trendingMovies.map((movie, index) => (
              <li key={movie.$id} className="trending-item">
                <p>{index + 1}</p>
                <img src={movie.poster_url} alt={movie.title} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="all-movies">
        <h2>All Movies</h2>

        {isLoading ? (
          <Spinner />
        ) : errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : (
          <ul>
            {filteredAndSortedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onFavoritesChange={setFavoriteMovies}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

const Layout = ({ user, handleLogout, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    setSearchTerm("");
    navigate("/");
    window.location.reload();
  };

  const handleGlobalSearchChange = (value) => {
    setSearchTerm(value);

    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <div className="top-bar">
            <button
              type="button"
              className="logo-link logo-button"
              onClick={handleLogoClick}
            >
              <img src="/icon.webp" alt="logo" />
              <span>MovieApp</span>
            </button>

            <div className="auth-bar">
              {user ? (
                <>
                  <p>Welcome, {user.name}</p>
                  <button onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <Link to="/auth" className="auth-link">
                  Login / Register
                </Link>
              )}
            </div>
          </div>

          {location.pathname !== "/auth" && (
            <div className="global-search-wrap">
              <Search
                searchTerm={searchTerm}
                setSearchTerm={handleGlobalSearchChange}
              />
            </div>
          )}
        </header>

        <Outlet />
      </div>
    </main>
  );
};

const AppRoutes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      setMovieList(data.results || []);

      if (query && data.results && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const loadInitialData = async () => {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
      setFavoriteMovies(getFavorites());

      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    loadInitialData();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <Routes>
      <Route
        element={
          <Layout
            user={user}
            handleLogout={handleLogout}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        }
      >
        <Route
          path="/"
          element={
            <HomePage
              movieList={movieList}
              trendingMovies={trendingMovies}
              favoriteMovies={favoriteMovies}
              isLoading={isLoading}
              errorMessage={errorMessage}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              sortBy={sortBy}
              setSortBy={setSortBy}
              setFavoriteMovies={setFavoriteMovies}
            />
          }
        />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/auth" element={<Auth />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return <AppRoutes />;
};

export default App;