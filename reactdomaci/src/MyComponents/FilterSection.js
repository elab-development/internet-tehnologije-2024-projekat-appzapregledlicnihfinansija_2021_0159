import React from "react";

const FilterSection = ({ filters, setFilters, setAppliedFilters, setCurrentPage }) => {
  return (
    <div className="filter-section">
      <h3>Filteri</h3>
      <input
      className="mr-1"
        type="text"
        placeholder="Opis"
        value={filters.description}
        onChange={(e) =>
          setFilters({ ...filters, description: e.target.value })
        }
      />
      <input
        type="date"
        value={filters.date}
        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
      />
      <button
      className="btn-secondary btn-sm mr-1 ml-1"
        onClick={() => {
          setCurrentPage(1);
          setAppliedFilters(filters);
        }}
      >
        Primeni filtere
      </button>
      <button
      className="btn-secondary btn-sm"
        onClick={() => {
          setFilters({
            description: "",
            date: "",
            currency: "",
            goal_id: "",
          });
          setAppliedFilters({});
          setCurrentPage(1);
        }}
      >
        Resetuj filtere
      </button>
    </div>
  );
};

export default FilterSection;
