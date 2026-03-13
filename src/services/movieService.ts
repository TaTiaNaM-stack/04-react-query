import type { Movie } from '../types/movie';
import axios from 'axios'

const VITE_TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
  page: number;

}

export default async function fetchMovies(query: string, page: number): Promise<{ movies: Movie[]; totalPages: number; query?: string; page: number }> {
  const endpoint = query
    ? `https://api.themoviedb.org/3/search/movie`
    : `https://api.themoviedb.org/3/movie/popular`;

  const { data } = await axios.get<FetchMoviesResponse>(endpoint, {
    params: {
      query: query,
      page: page,
    },
    headers: {
      Authorization: `Bearer ${VITE_TMDB_TOKEN}`,
    }
  });

  return { movies: data.results, totalPages: data.total_pages, page: data.page };
}