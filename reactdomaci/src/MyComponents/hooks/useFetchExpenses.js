import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Greška prilikom učitavanja troškova.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return { expenses, loading, error };
};
