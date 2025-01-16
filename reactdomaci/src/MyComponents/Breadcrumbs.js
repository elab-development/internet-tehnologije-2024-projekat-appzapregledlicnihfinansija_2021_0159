import React from "react";
import { Link, useLocation } from "react-router-dom";

// Opcionalno: Mapiranje prilagođenih naziva za specifične stranice
const pageNames = {
  currencyconverter: "Konverzija valuta",
  login: "Prijava",
  register: "Registracija",
  blog: "Blog",
  dashboard: "Kontrolna tabla",
  categoryManagement: "Upravljanje kategorijama troškova",
  userManagement: "Upravljanje korisnicima",
  transakcije: "Transakcije",

  // Dodajte nazive za specifične segmente po potrebi
};

const Breadcrumbs = () => {
  const location = useLocation();

  // Razbijamo trenutnu putanju u segmente
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="breadcrumbs">
      <ol>
        {/* Početna stranica */}
        <li>
          <Link to="/" className="breadcrumb-link">Početna</Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          // Formatiramo ime stranice: prvo proveravamo u mapi, inače automatski pravimo prvo slovo veliko
          const pageName =
            pageNames[value] || value.charAt(0).toUpperCase() + value.slice(1);

          return isLast ? (
            <li key={to} className="breadcrumb-current">
              {` / ${pageName}`}
            </li>
          ) : (
            <li key={to}>
              {` / `}
              <Link to={to}>{pageName}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
