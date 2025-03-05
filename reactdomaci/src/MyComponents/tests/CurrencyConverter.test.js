import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CurrencyConverter from "../CurrencyConverter";  // ili relativni put do komponente
import axios from "axios";

// Mockovanje axios poziva
jest.mock("axios");

afterEach(() => {
  jest.clearAllMocks();  // This will clear mocks after each test
});


describe("CurrencyConverter Component", () => {
  it("should render correctly and allow conversion", async () => {
    // Mockovanje odgovora sa API-ja za listu valuta
    axios.get.mockResolvedValueOnce({
      data: {
        rates: {
          EUR: 0.85,
          GBP: 0.75,
        },
      },
    });

    // Renderujemo komponentu
    render(<CurrencyConverter />);

    // Čekamo da se lista valuta učita
    await waitFor(() => screen.getByLabelText(/Iz:/));  // čekaj dok se dropdown za 'fromCurrency' ne pojavi

    // Proveravamo da li su dropdown-i sa početnim valutama prisutni
    expect(screen.getByLabelText(/Iz:/)).toBeInTheDocument();
    expect(screen.getByLabelText(/U:/)).toBeInTheDocument();

    // Simuliramo unos iznosa i konverzije
    fireEvent.change(screen.getByLabelText(/Iznos:/), { target: { value: "100" } });
    fireEvent.change(screen.getByLabelText(/Iz:/), { target: { value: "USD" } });
    fireEvent.change(screen.getByLabelText(/U:/), { target: { value: "EUR" } });

    // Mockovanje odgovora za konverziju
    axios.get.mockResolvedValueOnce({
      data: {
        rates: {
          EUR: 0.85,
        },
      },
    });

    // Simuliramo klik na dugme za konverziju
    fireEvent.click(screen.getByText(/Konvertuj/));

    // Čekamo da se rezultat prikaže
    await waitFor(() => screen.getByText(/Rezultat/));

    // Proveravamo da li je rezultat tačan
    expect(screen.getByText(/Rezultat/)).toHaveTextContent("Rezultat: 100 = 85.00 EUR");
  });

  it("should handle error on fetch", async () => {
    // Mockovanje greške prilikom učitavanja podataka
    axios.get.mockRejectedValueOnce(new Error("API greška"));

    render(<CurrencyConverter />);

    // Čekaj da komponenta reaguje na grešku
    await waitFor(() => screen.getByText(/Greška prilikom učitavanja/));

    // Proveri da li je greška prikazana korisniku
    expect(screen.getByText(/Greška prilikom učitavanja valutnih kurseva/)).toBeInTheDocument();
  });

  it("should handle conversion error", async () => {
    // Mockovanje uspešnog odgovora sa listom valuta
    axios.get.mockResolvedValueOnce({
      data: {
        rates: {
          EUR: 0.85,
        },
      },
    });

    // Renderovanje komponente
    render(<CurrencyConverter />);

    // Čekaj dok se lista valuta ne učita
    await waitFor(() => screen.getByLabelText(/Iz:/));

    // Simuliraj unos i izbor valuta
    fireEvent.change(screen.getByLabelText(/Iznos:/), { target: { value: "100" } });
    fireEvent.change(screen.getByLabelText(/Iz:/), { target: { value: "USD" } });
    fireEvent.change(screen.getByLabelText(/U:/), { target: { value: "GBP" } });

    // Mockovanje greške pri konverziji
    axios.get.mockRejectedValueOnce(new Error("Greška tokom konverzije"));

    // Simuliraj klik na dugme za konverziju
    fireEvent.click(screen.getByText(/Konvertuj/));

    // Čekaj dok greška ne bude prikazana
    await waitFor(() => screen.getByText(/Greška tokom konverzije/));

    // Proveri da li je greška prikazana
    expect(screen.getByText(/Greška tokom konverzije/)).toBeInTheDocument();
  });
});
