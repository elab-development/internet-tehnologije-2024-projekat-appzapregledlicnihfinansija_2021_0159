import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/goals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGoals(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Greška prilikom učitavanja ciljeva.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  return { goals,setGoals, loading, error };
};
