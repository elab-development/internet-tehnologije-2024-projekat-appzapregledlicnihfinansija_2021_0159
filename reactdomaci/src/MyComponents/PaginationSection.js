import React from "react";

const PaginationSection = ({ currentPage, lastPage, setCurrentPage }) => {
  return (
    <div className="pagination-section">
      <button
      className="btn-sm mr-1"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Prethodna
      </button>
      <span>Strana: {currentPage}</span>
      <button
      className="btn-sm ml-1 mb-3"
        disabled={currentPage === lastPage}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Sledeća
      </button>
    </div>
  );
};

export default PaginationSection;
