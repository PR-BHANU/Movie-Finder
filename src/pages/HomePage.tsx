import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const api_key = import.meta.env.VITE_API_KEY;

function useGetMovie(name: string) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (!name.trim()) {
      setMovies([]);
      return;
    }

    axios
      .get(
        `https://api.themoviedb.org/3/search/multi?query=${name}&api_key=${api_key}`
      )
      .then((res) => {
        const results = res.data.results || [];
        setMovies(
          results.sort((a: any, b: any) => b.popularity - a.popularity)
        );
      })
      .catch(console.error);
  }, [name]);

  return movies;
}

export function HomePage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("both");
  const movies = useGetMovie(query);
  const navigate = useNavigate();

  const filteredMovies = movies.filter(
    (m: any) => type === "both" || m.media_type === type
  );

  function handleClick(selection: any) {
    // Add type annotation
    navigate(`/${selection.media_type}/${selection.id}`);
  }

  return (
    <div className="app-container">
      <h1 className="app-title">Movie Finder</h1>
      <div className="search">
        <motion.input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a movie / TV show."
          whileFocus={{ scale: 1.02 }}
        />
      </div>

      {/* Dropdown */}
      <div className="type-container">
        <label htmlFor="type" className="type-label">
          Show:
        </label>
        <motion.select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          whileTap={{ scale: 0.95 }}
          className="type-dropdown"
        >
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
          <option value="both">Both</option>
        </motion.select>
      </div>

      {/* Movie Grid */}
      <motion.div
        className="movie-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {filteredMovies.map((movie: any) => (
          <motion.div
            key={movie.id}
            className="movie-card"
            onClick={() => {
              handleClick(movie);
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title || movie.name}
              />
            )}
            <h1>
              {movie.title ||
                movie.name ||
                movie.original_title ||
                movie.original_name}
            </h1>
            <p>⭐ {movie.vote_average}</p>
            <p>{movie.release_date || movie.first_air_date || "N/A"}</p>

            {/* Glow overlay */}
            <motion.div
              className="glow-overlay"
              whileHover={{ opacity: 0.2, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
