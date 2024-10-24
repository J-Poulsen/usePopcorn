import { WatchedMovie } from './WatchedMovie';

export function WatchedMovieList({ watched, onRemoveWatchedMovie }) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onRemoveWatchedMovie={onRemoveWatchedMovie}
        />
      ))}
    </ul>
  );
}
