import React, { useState, useEffect } from "react";
import axios from "axios";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);  // spisak valuta
  const [fromCurrency, setFromCurrency] = useState("USD"); // iz koje valute
  const [toCurrency, setToCurrency] = useState("EUR");     // u koju valutu
  const [amount, setAmount] = useState(1);                 // iznos
  const [result, setResult] = useState(null);              // rezultat konverzije
  const [error, setError] = useState(null);

  // 1. Učitavamo listu kurseva (i valuta) sa API-ja prilikom mounta
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setError(null);
        // Primer API-ja koji vraća listu valuta i njihove kurseve bazirane na valuti "USD"
        const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
        // response.data.rates je objekat tipa { "EUR": 0.92, "GBP": 0.8, ... }
        const ratesObj = response.data.rates;
        // Izvlačimo listu ključeva (npr. ["EUR", "GBP", "AUD", ...])
        const currencyKeys = Object.keys(ratesObj);
        setCurrencies(currencyKeys);
      } catch (err) {
        setError("Greška prilikom učitavanja valutnih kurseva.");
      }
    };

    fetchCurrencies();
  }, []);

  // 2. Funkcija za konverziju
  const handleConvert = async () => {
    try {
      setError(null);
      // Sada pozivamo API *baziran* na valuti iz koje konvertujemo
      // npr. ako je fromCurrency = "USD", API endpoind je:
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );

      // Dohvatamo kurs za "toCurrency"
      const rate = response.data.rates[toCurrency];
      if (!rate) {
        setError("Ne postoji kurs za izabranu valutu.");
        return;
      }

      // Izračunavamo rezultat
      const convertedAmount = amount * rate;
      setResult(convertedAmount);
    } catch (err) {
      setError("Greška tokom konverzije. Pokušajte ponovo.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Konverzija valuta</h2>

      {/* Iznos koji korisnik unosi */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="amount">Iznos: </label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      {/* Izbor početne valute (fromCurrency) */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="fromCurrency">Iz: </label>
        <select
          id="fromCurrency"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

      {/* Izbor ciljane valute (toCurrency) */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="toCurrency">U: </label>
        <select
          id="toCurrency"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

      {/* Dugme za konverziju */}
      <button type="submit" className="btn-submit" onClick={handleConvert} style={{ padding: "10px 15px" }}>
        Konvertuj
      </button>

      {/* Ispis rezultata */}
      {result !== null && (
        <div style={{ marginTop: "20px", fontWeight: "bold" }}>
          Rezultat: {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
        </div>
      )}

      {/* Eventualna greška */}
      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <b>{error}</b>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
