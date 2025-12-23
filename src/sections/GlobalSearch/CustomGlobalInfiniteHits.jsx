import { useState } from 'react';
import { useInfiniteHits, useInstantSearch, useSearchBox } from 'react-instantsearch';
import ReactPaginate from 'react-paginate';
import GlobalSearchResult from './GlobalSearchResult';

export default function CustomGlobalInfiniteHits(props) {
  const { hits, hasMore, refineNext } = useInfiniteHits(props);
  const { query } = useSearchBox();
  const [currentPage, setCurrentPage] = useState(0);
  const hitsPerPage = 10; // Adjust based on your requirements

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    if (refineNext) {
      refineNext(selected);
    }
  };

  const pageCount = Math.ceil(hits.length / hitsPerPage);

  const paginatedHits = hits.slice(currentPage * hitsPerPage, (currentPage + 1) * hitsPerPage);

  return (
    hits?.length > 0 &&
    !!query && (
      <div className="ais-InfiniteHits  pb-20">
        <div className="max-w-screen-xl lg:px-10 px-5 w-full mx-auto my-10">
          <span className="text-brand-black-3 text-p3 font-normal">{hits?.length} Results</span>

          {hits.length > 0 && (
            <ul className="ais-InfiniteHits-list">
              {paginatedHits.map((hit) => (
                <li className="ais-InfiniteHits-item" key={hit.id}>
                  <GlobalSearchResult hit={hit} />
                </li>
              ))}
            </ul>
          )}
        </div>
        {hits.length > 10 && (
          <div className="mt-10 flex justify-center">
            <ReactPaginate
              breakLabel="..."
              nextLabel=""
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel=""
              renderOnZeroPageCount={null}
              className="global-search-pagination"
            />
          </div>
        )}
      </div>
    )
  );
}
