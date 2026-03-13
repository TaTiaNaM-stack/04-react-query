import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
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
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

      const { data, isLoading, error, isError, isSuccess } = useQuery({
        queryKey: ['movies', query, page],
        queryFn: () => fetchMovies(query, page),
        enabled: query.trim() !== '',
        placeholderData: (previousData) => previousData,
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
      const handleSearch =  async (query: string) => {
          setQuery(query);
          setPage(page); 
          setPage(1);    
    }  
    useEffect(() => {
      if (isSuccess && data?.movies.length === 0) {        
          toast('No movies found for your request.');       
      }
    }, [data, isSuccess]);
  return (
    <>
      <SearchBar 
            onSubmit={handleSearch}
      />
      <Loader 
              loader={isLoading} 
            />
      
      {isSuccess
            && data?.movies.length > 0  
            && <ReactPaginate 
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
      }
      {data?.movies
            && <MovieGrid 
              movies={data.movies} 
              onSelect={openModal}
            />       

      }
      <Toaster />      
      {isError 
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
  };