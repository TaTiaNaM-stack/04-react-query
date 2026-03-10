import type { Movie } from '../types/movie';
import axios from 'axios'

const VITE_TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface FetchMoviesParams {
  results: Movie[];
}

export default async function fetchMovies(query?: string): Promise<Movie[]> {
  const endpoint = query
    ? `https://api.themoviedb.org/3/search/movie`
    : `https://api.themoviedb.org/3/movie/popular`;

  const { data } = await axios.get<FetchMoviesParams>(endpoint, {
    params: {
      ...(query && { query })

    },
    headers: {
      Authorization: `Bearer ${VITE_TMDB_TOKEN}`,
    }
  });

  return data.results;
}