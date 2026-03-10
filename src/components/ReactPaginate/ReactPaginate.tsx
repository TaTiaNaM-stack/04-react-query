import { useQuery } from '@tanstack/react-query';
import fetchMovies from '../../services/movieService';

interface ReactPaginateProps {
    pageCount={totalPages}
    pageRangeDisplayed={5}
    marginPagesDisplayed={1}
    onPageChange={({ selected }) => setPage(selected + 1)}
    forcePage={page - 1}
    containerClassName={css.pagination}
    activeClassName={css.active}
    nextLabel="→"
    previousLabel="←"
}

export default function ReactPaginate({ pageCount, pageRangeDisplayed, marginPagesDisplayed, onPageChange, forcePage, containerClassName, activeClassName, nextLabel, previousLabel }: ReactPaginateProps) {
      const { data, error, isLoading, isError } = useQuery({
        queryKey: ['movies'],
        queryFn: () => fetchMovies(),
      })
    
      if (isLoading) {
        return <p> {isLoading} </p>
      }
    
      if (isError) {
        return <p> {error.message} </p>
      }

    return (
        <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={pageRangeDisplayed}
            marginPagesDisplayed={marginPagesDisplayed}
            onPageChange={onPageChange}
            forcePage={forcePage}
            containerClassName={containerClassName}
            activeClassName={activeClassName}
            nextLabel={nextLabel}
            previousLabel={previousLabel}
        />
    )
}