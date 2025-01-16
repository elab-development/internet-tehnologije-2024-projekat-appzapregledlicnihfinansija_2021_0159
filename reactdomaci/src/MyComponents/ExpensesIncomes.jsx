import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import FilterSection from "./FilterSection";
import PaginationSection from "./PaginationSection";
import FormSection from "./FormSection";
import ExpenseItem from "./ExpenseItem";
import IncomeItem from "./IncomeItem";

const ExpensesIncomes = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState([]);
  const [newEntry, setNewEntry] = useState({
    type: "income",
    amount: "",
    description: "",
    source: "",
    expense_category_id: "",
    goal_id: null,
    date: "",
    currency: "USD",
  });

  const [filters, setFilters] = useState({
    description: "",
    date: "",
    currency: "",
    goal_id: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (page = 1, filtersObj = {}) => {
    try {
      setLoading(true);
      setError(null);

      const token = sessionStorage.getItem("token");
      const [
        expensesResponse,
        incomesResponse,
        goalsResponse,
        categoriesResponse,
      ] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/expenses", {
          params: { page, ...filtersObj },
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://127.0.0.1:8000/api/incomes", {
          params: { page, ...filtersObj },
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://127.0.0.1:8000/api/goals", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://127.0.0.1:8000/api/expense-categories", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setExpenses(expensesResponse.data.data);
      setIncomes(incomesResponse.data.data);
      setGoals(goalsResponse.data);
      setCategories(categoriesResponse.data);

      const expensesLastPage = expensesResponse.data.last_page || 1;
      const incomesLastPage = incomesResponse.data.last_page || 1;
      setLastPage(Math.max(expensesLastPage, incomesLastPage));
    } catch (err) {
      setError("Greška prilikom učitavanja podataka.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, appliedFilters);
  }, [currentPage, appliedFilters]);

  const handleAddEntry = async () => {
    try {
      setError(null);

      const token = sessionStorage.getItem("token");
      const url =
        newEntry.type === "income"
          ? "http://127.0.0.1:8000/api/incomes"
          : "http://127.0.0.1:8000/api/expenses";

      const payload = {
        amount: parseFloat(newEntry.amount),
        description: newEntry.description,
        goal_id: newEntry.goal_id || null,
        date: newEntry.date,
        currency: newEntry.currency,
      };
      console.log("Payload:", payload);
      if (newEntry.type === "income") {
        payload.source = newEntry.source;
      } else {
        payload.expense_category_id = newEntry.expense_category_id;
        payload.status = "paid";
      }

      const response = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (newEntry.type === "income") {
        setIncomes([...incomes, response.data]);
      } else {
        setExpenses([...expenses, response.data]);
      }

      setNewEntry({
        type: "income",
        amount: "",
        description: "",
        source: "",
        expense_category_id: "",
        goal_id: null,
        date: "",
        currency: "USD",
      });
    } catch (err) {
      setError("Greška prilikom dodavanja unosa.");
    }
  };

  const handleDeleteEntry = async (id, type) => {
    try {
      setError(null);

      const token = sessionStorage.getItem("token");
      const url = `http://127.0.0.1:8000/api/${type}s/${id}`;

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (type === "income") {
        setIncomes(incomes.filter((income) => income.id !== id));
      } else {
        setExpenses(expenses.filter((expense) => expense.id !== id));
      }
    } catch (err) {
      setError("Greška prilikom brisanja unosa.");
    }
  };
 
  
  

  return (
    <div className="expenses-incomes-section">
      <h3>Moje transakcije</h3>
      <button onClick={handleExportPDF} className="btn-secondary mb-3">Izvezi kao PDF</button> 
      <FilterSection
        filters={filters}
        setFilters={setFilters}
        setAppliedFilters={setAppliedFilters}
        setCurrentPage={setCurrentPage}
      />
      <PaginationSection
        currentPage={currentPage}
        lastPage={lastPage}
        setCurrentPage={setCurrentPage}
      />
      <FormSection
        newEntry={newEntry}
        setNewEntry={setNewEntry}
        handleAddEntry={handleAddEntry}
        categories={categories}
        goals={goals}
      />
      <div className="expenses-incomes-table">
        <div className="column expenses-column">
          <h4>Troškovi</h4>
          <ul>
            {expenses.map((expense) => (
              <li key={expense.id}>
                <ExpenseItem expense={expense} />
                <button
                  onClick={() => handleDeleteEntry(expense.id, "expense")}
                >
                  Obriši
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="column incomes-column">
          <h4>Prihodi</h4>
          <ul>
            {incomes.map((income) => (
              <li key={income.id}>
                <IncomeItem income={income} />
                <button onClick={() => handleDeleteEntry(income.id, "income")}>
                  Obriši
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExpensesIncomes;
