import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./MoviePage.css";

const api_key = import.meta.env.VITE_API_KEY;

interface Movie {
  id: number;
  original_title: string;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  tagline?: string;
  runtime: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
}

export function MoviePages({ type }: { type: "movie" | "tv" }) {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    axios
      .get(`https://api.themoviedb.org/3/${type}/${id}?api_key=${api_key}`)
      .then((res) => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id, type]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!movie) return <div className="loading">Movie not found</div>;

  return (
    <div className="movie-page">
      <div
        className="backdrop"
        style={{
          backgroundImage: `url("https://image.tmdb.org/t/p/original${movie.backdrop_path}")`,
        }}
      >
        <div className="backdrop-content">
          <h1 className="movie-title">{movie.original_title || movie.title}</h1>

          {/* Tagline and buttons on same line */}
          <div className="tagline-buttons-container">
            {movie.tagline && (
              <p className="movie-tagline">"{movie.tagline}"</p>
            )}

            <div className="action-buttons">
              <button className="play-btn">▶ Play</button>
              <button className="trailer-btn">🎬 Trailer</button>
              <button className="watchlist-btn">+ My List</button>
            </div>
          </div>

          <div className="movie-info">
            <div className="rating-badge">
              <span className="rating-text">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
            </div>
            <span className="movie-year">
              {new Date(movie.release_date).getFullYear()}
            </span>
            {movie.runtime && (
              <span className="movie-year">{movie.runtime} min</span>
            )}
            {movie.genres?.slice(0, 2).map((genre) => (
              <span key={genre.id} className="genre-badge">
                {genre.name}
              </span>
            ))}
          </div>

          <p className="movie-overview">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}
