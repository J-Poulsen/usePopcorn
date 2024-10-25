import React, { useEffect, useRef } from 'react';

export function Search({ query, setQuery }) {
  const inputElement = useRef(null);

  useEffect(() => {
    const callback = (e) => {
      if (document.activeElement === inputElement.current) return;

      if (e.code === 'Enter') {
        inputElement.current.focus();
        setQuery('');
      }
    };

    document.addEventListener('keydown', callback);
    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, [setQuery]);

  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputElement}
    />
  );
}
