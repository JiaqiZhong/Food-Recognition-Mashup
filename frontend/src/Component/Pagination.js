import React from 'react';
import { usePagination, DOTS } from './usePagination';
import classnames from 'classnames';
import leftArrowIcon from '../Icons/left-arrow-icon.png';
import rightArrowIcon from '../Icons/right-arrow-icon.png';

const Pagination = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul className={classnames('flex list-none m-4', { [className]: className })}>
      <li
        className={classnames('flex items-center justify-center w-8 h-8 mx-1 text-white rounded-full', {
          'pointer-events-none cursor-default bg-transparent': currentPage === 1,
          'hover:bg-secondaryButtonColor hover:bg-opacity-50 cursor-pointer': currentPage !== 1
        })}
        onClick={onPrevious}
      >
        <img className="w-2" src={leftArrowIcon}></img>
      </li>
      {paginationRange.map(pageNumber => {
        if (pageNumber === DOTS) {
          return <li className="flex items-center justify-center w-8 h-8 mx-1 text-white rounded-full cursor-default">...</li>;
        }

        return (
          <li
            key={pageNumber} // Added key to avoid React warnings
            className={classnames('flex items-center justify-center w-8 h-8 mx-1 text-white rounded-full', {
              'bg-secondaryButtonColor': pageNumber === currentPage,
              'hover:bg-secondaryButtonColor hover:bg-opacity-50 cursor-pointer': pageNumber !== currentPage
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={classnames('flex items-center justify-center w-8 h-8 mx-1 text-white rounded-full', {
          'pointer-events-none cursor-default bg-transparent': currentPage === lastPage,
          'hover:bg-secondaryButtonColor hover:bg-opacity-50 cursor-pointer': currentPage !== lastPage
        })}
        onClick={onNext}
      >
        <img className="w-2" src={rightArrowIcon}></img>
      </li>
    </ul>
  );
};

export default Pagination;