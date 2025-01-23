import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Uklanjanje korisničkih podataka iz sessionStorage
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");

      setUser(null); // Resetovanje korisnika
      navigate("/login"); // Preusmeravanje na stranicu za prijavu
    } catch (error) {
      console.error("Greška prilikom odjave:", error);
    }
  };

  // Provera da li korisnik ima pristup određenoj ruti
  const hasAccess = (requiredRole) => {
    if (!user) return false;
    return user.type === requiredRole;
  };

  // Onemogućavanje pristupa određenim rutama
  React.useEffect(() => {
    if (user) {
      if (location.pathname === "/userManagement" && !hasAccess("admin")) {
        navigate("/dashboard"); // Redirektuj regularnog korisnika na dashboard
      }
      /* if (location.pathname === "/categoryManagement" && !hasAccess("admin")) {
        navigate("/dashboard"); // Redirektuj regularnog korisnika na dashboard
      }  */
    }
  }, [location, user, navigate]);

  return (
    <nav className="navbar header_section">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <span>MyFinance</span>
        </Link>
        <ul className="navbar-nav">
          {/* Uvek prikazujemo "Početna" i "Currency Converter" */}
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Početna
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/currencyconverter" className="nav-link">
              Konverzija valuta
            </Link>
          </li>

          {/* Prikazujemo dodatne linkove u zavisnosti od uloge korisnika */}
          {user ? (
            <>
              {user.type === "regular" && (
                <>
                  <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">
                      Kontrolna tabla
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/transakcije" className="nav-link">
                      Transakcije
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/categoryManagement" className="nav-link">
                      Upravljanje kategorijama troškova
                    </Link>
                  </li>
                </>
              )}

              {user.type === "admin" && (
                <>
                  <li className="nav-item">
                    <Link to="/userManagement" className="nav-link">
                      Upravljanje korisnicima
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    <Link to="/categoryManagement" className="nav-link">
                      Upravljanje kategorijama troškova
                    </Link>
                  </li> */}
                </>
              )}

              {/* Dugme za odjavu */}
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Odjavi se
                </button>
              </li>
            </>
          ) : (
            <>
              {/* Ako korisnik nije ulogovan, prikazujemo linkove za prijavu i registraciju */}
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Prijava
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Registracija
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;