import { useState } from "react";
import Search from "./components/Search";
import MovieCard from "./components/MovieCard";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main>
      <h1>Movie App</h1>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="movies">
        <MovieCard movie={{ title: "Test Movie", poster_path: "" }} />
      </div>
    </main>
  );
};

export default App;