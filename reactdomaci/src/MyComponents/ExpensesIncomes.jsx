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
  const [editEntry, setEditEntry] = useState(null); 
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

  const handleEditEntry = (entry, type) => {
    setEditEntry({ ...entry, type });
  };

  const handleUpdateEntry = async () => {
    try {
      setError(null);

      const token = sessionStorage.getItem("token");
      const url = `http://127.0.0.1:8000/api/${editEntry.type}s/${editEntry.id}`;

      const payload = {
        amount: parseFloat(editEntry.amount),
        description: editEntry.description,
        goal_id: editEntry.goal_id || null,
        date: editEntry.date,
        currency: editEntry.currency,
      };

      if (editEntry.type === "income") {
        payload.source = editEntry.source;
      } else {
        payload.expense_category_id = editEntry.expense_category_id;
        payload.status = "paid";
      }

      const response = await axios.put(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (editEntry.type === "income") {
        setIncomes(
          incomes.map((income) =>
            income.id === editEntry.id ? response.data : income
          )
        );
      } else {
        setExpenses(
          expenses.map((expense) =>
            expense.id === editEntry.id ? response.data : expense
          )
        );
      }

      setEditEntry(null);
    } catch (err) {
      setError("Greška prilikom ažuriranja unosa.");
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
 
  
  const handleExportPDF = () => {
    // 1. Kreirajte novi jsPDF dokument
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "A4",
    });
  
    // 2. Podesite font (jedan od ugrađenih; "helvetica", "times", "courier")
    //    ili ubacite sopstveni font ako želite strogu usaglašenost sa temom
    doc.setFont("helvetica", "normal");
  
    // 3. Naslov PDF-a (primer)
    doc.setFontSize(18);
    doc.setTextColor("#00204a");  
    doc.text("Izvod transakcija", 40, 40);
  
    // 4. Napravite nizove za prihode i troškove (kao i do sada)
    const incomeRows = incomes.map((income) => [
      "Prihod",
      income.source,
      parseFloat(income.amount).toFixed(2),
      income.currency,
      income.date,
    ]);
  
    const expenseRows = expenses.map((expense) => [
      "Trošak",
      expense.description,
      parseFloat(expense.amount).toFixed(2),
      expense.currency,
      expense.date,
    ]);
  
    const allRows = [...incomeRows, ...expenseRows];
  
    const totalIncome = incomes.reduce(
      (acc, income) => acc + parseFloat(income.amount),
      0
    );
    const totalExpenses = expenses.reduce(
      (acc, expense) => acc + parseFloat(expense.amount),
      0
    );
    const balance = totalIncome - totalExpenses;
  
    // 5. Poziv autoTable sa prilagođenim stilovima
    doc.autoTable({
      startY: 60, // da tablica krene ispod naslova
      head: [["Tip", "Opis", "Iznos", "Valuta", "Datum"]],
      body: allRows,
      theme: "grid",  
      headStyles: {
        fillColor: "#00204a",    
        textColor: "#ffffff",     
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: "#0c0c0c",     
        fillColor: "#ffffff",    
      },
      alternateRowStyles: {
        fillColor: "#f8f8f9",     
      },
      margin: { left: 40, right: 40 }, 
    });
  
    // 6. Dodavanje „podvoda“ (ukupan iznos i balans) ispod tabele
    let finalY = doc.lastAutoTable.finalY + 30; // Y pozicija gde se tabela završila
    doc.setFontSize(12);
    doc.setTextColor("#0c0c0c");
    doc.text(`Ukupno prihodi: ${totalIncome.toFixed(2)} RSD`, 40, finalY);
    doc.text(`Ukupno troškovi: ${totalExpenses.toFixed(2)} RSD`, 40, finalY + 20);
    doc.text(`Balans: ${balance.toFixed(2)} RSD`, 40, finalY + 40);
  
    // 7. Na kraju – snimi PDF fajl
    doc.save("Izvod-transakcija.pdf");
  };
  
  if (loading) return <p>Učitavanje podataka...</p>;
  if (error) return <p>{error}</p>;

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
      {editEntry && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)",
              animation: "fadeIn 0.3s ease-in-out",
            }}
          >
            <h3 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
              Ažuriranje unosa
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateEntry();
              }}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <input
                type="text"
                value={editEntry.description}
                onChange={(e) =>
                  setEditEntry({ ...editEntry, description: e.target.value })
                }
                placeholder="Opis"
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "14px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                }}
              />
              <input
                type="number"
                value={editEntry.amount}
                onChange={(e) =>
                  setEditEntry({ ...editEntry, amount: e.target.value })
                }
                placeholder="Iznos"
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "14px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 15px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#00aaff",
                  color: "#fff",
                }}
              >
                Sačuvaj
              </button>
              <button
                type="button"
                onClick={() => setEditEntry(null)}
                style={{
                  padding: "10px 15px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#ddd",
                  color: "#333",
                }}
              >
                Otkaži
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="expenses-incomes-table">
        <div className="column expenses-column">
          <h4>Troškovi</h4>
          <ul>
            {expenses.map((expense) => (
              <li key={expense.id}>
                <ExpenseItem expense={expense} />
                <div className="d-flex gap-2">
                <button
                  className="mr-1"
                  onClick={() => handleEditEntry(expense, "expense")}
                >
                  Izmeni
                </button>
                <button
                  onClick={() => handleDeleteEntry(expense.id, "expense")}
                >
                  Obriši
                </button>
                </div>
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
                <div className="d-flex gap-2">
                <button onClick={() => handleEditEntry(income, "income")} className="mr-1">
                  Izmeni
                </button>
                <button onClick={() => handleDeleteEntry(income.id, "income")}>
                  Obriši
                </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExpensesIncomes;
