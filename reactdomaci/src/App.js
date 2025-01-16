import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./MyComponents/Navbar";
import WelcomePage from "./MyComponents/WelcomePage";
import Register from "./MyComponents/Register";
import Login from "./MyComponents/Login";
import Dashboard from "./MyComponents/Dashboard";
import ExpensesIncomes from "./MyComponents/ExpensesIncomes";
import "./Bootstrap.css";
import "./App.css";
import CurrencyConverter from "./MyComponents/CurrencyConverter";
import CategoryManagement from "./MyComponents/CategoryManagement";
import UserTable from "./MyComponents/UserTable";
import Breadcrumbs from "./MyComponents/Breadcrumbs";
 

function App() {
  const [user, setUser] = useState(null);

  // Funkcija za proveru prijave korisnika
  const checkLoginStatus = () => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <Router>
      <div className="App">
      
        <Navbar user={user} setUser={setUser} />
        <Breadcrumbs></Breadcrumbs>
        <Routes>
          <Route
            path="/"
            element={<WelcomePage />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/login"
            element={<Login setUser={setUser} />}
          />
          <Route
            path="/dashboard"   // dodata funkcija UPDATE za seminarski
            element={<Dashboard />}
          />
          <Route
            path="/transakcije"  //dodata funkcionalnost za preuzimanje pdfa
            element={<ExpensesIncomes />}
          />
           <Route
            path="/currencyconverter"  //dodata cela komponenta za seminarski
            element={<CurrencyConverter />}
          />

            <Route
            path="/categoryManagement"  //dodata cela komponenta za seminarski
            element={<CategoryManagement />}
          />


          <Route
            path="/userManagement"  //dodata cela komponenta za seminarski
            element={<UserTable />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
