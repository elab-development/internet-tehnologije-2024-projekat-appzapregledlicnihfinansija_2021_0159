import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchIncomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/incomes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIncomes(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Greška prilikom učitavanja prihoda.");
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

  return { incomes, loading, error };
};
