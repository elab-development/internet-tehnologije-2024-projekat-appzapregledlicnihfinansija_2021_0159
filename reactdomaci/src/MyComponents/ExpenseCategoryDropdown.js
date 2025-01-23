import React from "react";

const ExpenseCategoryDropdown = ({ categories, selectedCategory, onChange }) => (
  <select value={selectedCategory} onChange={(e) => onChange(e.target.value)}>
    <option value="">Izaberite kategoriju</option>
    {categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </select>
);

export default ExpenseCategoryDropdown;
