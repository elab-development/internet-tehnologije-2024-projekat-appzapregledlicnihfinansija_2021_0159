import React, { useState, useEffect } from 'react';
import axios from 'axios';
 

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/expense-categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      setError('Greška u učitavanju kategorija');
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/expense-categories',
        { name: newCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories([...categories, response.data]);
      setNewCategoryName('');
      setSuccess('Uspešno dodata kategorija');
    } catch (error) {
      setError('Neuspešno dodavanje kategorije');
    }
  };

  const handleEditCategory = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/expense-categories/${editCategory.id}`,
        { name: editCategory.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(
        categories.map((category) =>
          category.id === editCategory.id ? response.data : category
        )
      );
      setEditCategory(null);
      setSuccess('Uspešno izmenjena kategorija');
    } catch (error) {
      setError('Neuspešna izmena kategorije');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/expense-categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter((category) => category.id !== id));
      setSuccess('Uspešno obrisana kategorija');
    } catch (error) {
      setError('Neuspešno brisanje kategorije');
    }
  };

  return (
    <div className="category-management-container">
      <h1>Upravljanje kategorijama</h1>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="add-category">
        <input
          type="text"
          placeholder="Dodaj novu kategoriju"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button onClick={handleAddCategory}>Dodaj</button>
      </div>

      <table className="category-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Naziv</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id}>
              <td>{index + 1}</td>
              <td>
                {editCategory && editCategory.id === category.id ? (
                  <input
                    type="text"
                    value={editCategory.name}
                    onChange={(e) =>
                      setEditCategory({ ...editCategory, name: e.target.value })
                    }
                  />
                ) : (
                  category.name
                )}
              </td>
              <td>
                {editCategory && editCategory.id === category.id ? (
                  <button onClick={handleEditCategory}>Sačuvaj</button>
                ) : (
                  <button
                    onClick={() => setEditCategory(category)}
                  >
                    Izmeni
                  </button>
                )}
                <button onClick={() => handleDeleteCategory(category.id)}>
                  Obriši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryManagement;
