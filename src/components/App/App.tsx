import { useState } from 'react'
import './App.module.css'
import type { Movie } from '../../types/movie'
import fetchMovies from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [error, setError] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };
  
  const handleSearch = async (query: string) => {
    try {
      setLoader(true);
      setError(false);
      setMovies([]);
      
      const results = await fetchMovies(query);
      
      setMovies(results);
      if (results.length === 0) {
        toast('No movies found for your request.');
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError(true);
    } finally {
      setLoader(false);
    }
  };    

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {loader && <Loader loader={loader} />}
      {movies.length > 0 ? <MovieGrid movies={movies} onSelect={openModal} /> : <Toaster />}
      {error && <ErrorMessage error={error} />}
      {isModalOpen && selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
    </>
  )
}