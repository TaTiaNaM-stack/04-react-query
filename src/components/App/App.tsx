import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import css from './App.module.css'
import type { Movie } from '../../types/movie'
import fetchMovies from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';


export default function App() {
      const [page, setPage] = useState(1);
      const [movies, setMovies] = useState<Movie[]>([]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

 const { data, isLoading, isError, error } = useQuery({
        queryKey: ['movies', page],
        queryFn: () => fetchMovies(),
        placeholderData: keepPreviousData,
        enabled: page > 0
        }
      );

      const totalPages = data?.totalPages || 0;

      if (isLoading) {
        return <p> {isLoading} </p>
      }
    
      if (isError) {
        return <p> {error.message} </p>
      }

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
      setMovies([]);
      setPage(1);
      const results = await fetchMovies(query);
      setMovies(results.movies);
      if (results.movies.length === 0) {
        toast('No movies found for your request.');
      }
    } catch (error) {
      console.error('Error:', error);
    } 
  };    

  return (
    <>
      <SearchBar 
            onSubmit={handleSearch}
      />
      {isLoading
            && <Loader 
              loader={isLoading} 
            />
      }
      <ReactPaginate 
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
      />
      {movies.length > 0 
            ? <MovieGrid 
              movies={movies} 
              onSelect={openModal}
            />       
            : <Toaster />
      }
      {error 
            && <ErrorMessage
              error={error}
            />
      }
      {isModalOpen
            && selectedMovie
            && <MovieModal
              movie={selectedMovie}
              onClose={closeModal}
            />
      }
    </>
  )
}