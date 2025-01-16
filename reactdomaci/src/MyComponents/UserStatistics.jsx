import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const UserStatistics = ({ userId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/statistics`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Greška prilikom kreiranja statistike");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [userId]);

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const labels = data.expenses.map((item) => `${item.month}/${item.year}`);
  const expenseData = data.expenses.map((item) => item.total_expense);
  const incomeData = data.incomes.map((item) => item.total_income);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Prihodi",
        data: incomeData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Troškovi",
        data: expenseData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  return (
    <div className="statistics-modal">
      <h3><strong>Statistika za korisnika {userId}</strong></h3>
      <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      
    </div>
  );
};

export default UserStatistics;
