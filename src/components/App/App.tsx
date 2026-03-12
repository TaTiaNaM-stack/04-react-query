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
      const [query, setQuery] = useState('');
      const [movies, setMovies] = useState([]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

 const { data, isLoading, error } = useQuery({
        queryKey: ['movies', page, query],
        queryFn: () => fetchMovies(query),
        placeholderData: keepPreviousData,
        enabled: query.trim() !== '' || page > 1,
        }
      );

      const totalPages = data?.totalPages || 0;

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };
  
  const handleSearch = async (query: string) => {
      setQuery(query);
      setMovies([]);
      setPage(1);
      const results = await fetchMovies(query);
      setMovies(movies);
      if (results.movies.length === 0) {
        toast('No movies found for your request.');
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