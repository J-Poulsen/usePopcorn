import { useEffect, useState } from 'react';
import { MovieDetails } from './MovieDetails';
import { WatchedMovieList } from './WatchedMovieList';
import { WatchedSummary } from './WatchedSummary';
import { MovieList } from './MovieList';
import { Box } from './Box';
import { Main } from './Main';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { NavBar } from './NavBar';
import { Logo } from './Logo';
import { Search } from './Search';
import { NumResults } from './NumResults';

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const OMDB_KEY = 'b1183399';

export default function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem('watched');
    return storedValue ? JSON.parse(storedValue) : [];
  });

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleRemoveWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError('');

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${query}`,
          { signal: controller.signal },
        );

        if (!res.ok)
          throw new Error('Something went wrong with fetching movies');

        const data = await res.json();
        if (data.Response === 'False') throw new Error('Movie not found');

        setMovies(data.Search);
        setError('');
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }

    handleCloseMovie();
    fetchMovies();

    return () => controller.abort();
  }, [query]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage error={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onRemoveWatchedMovie={handleRemoveWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
