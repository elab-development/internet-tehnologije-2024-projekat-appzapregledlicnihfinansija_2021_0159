import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    address: "",
    phone_number: "",
    type: "regular",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const navigate = useNavigate();

  // Fetch random user data on component mount
  useEffect(() => {
    const fetchRandomUser = async () => {
      try {
        const response = await fetch("https://randomuser.me/api/");
        const data = await response.json();
        const user = data.results[0];

        setFormData({
          name: `${user.name.first} ${user.name.last}`,
          email: user.email,
          password: "password123", // Placeholder password
          password_confirmation: "password123",
          address: `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.country}`,
          phone_number: user.phone,
          type: "regular",
        });
      } catch (error) {
        console.error("Error fetching random user data:", error);
      }
    };

    fetchRandomUser();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", formData);



      setMessage(response.data.message);
      setErrors({});
      
      // Navigate to dashboard
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Registracija</h2>
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="name">Ime</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="error-message">{errors.name[0]}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-message">{errors.email[0]}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Lozinka</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Sakrij" : "Prikaži"}
            </button>
          </div>
          {errors.password && (
            <p className="error-message">{errors.password[0]}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password_confirmation">Potvrda lozinke</label>
          <div className="password-input-wrapper">
            <input
              type={showPasswordConfirmation ? "text" : "password"}
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
            >
              {showPasswordConfirmation ? "Sakrij" : "Prikaži"}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="address">Adresa</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone_number">Telefon</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn-submit">
          Registruj se
        </button>
      </form>
    </div>
  );
}

export default Register;
