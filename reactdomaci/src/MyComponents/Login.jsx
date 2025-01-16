import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: "andjela.aleksandric17@gmail.com",
    password: "andjela123",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", formData);
      const { user, token, message } = response.data;

      // Čuvanje korisničkih podataka u sessionStorage
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token);

      setMessage(message);
      setErrors({});
      setUser(user); // Ažuriramo stanje korisnika
     // Proveri tip korisnika i redirektuj
        if (user.type === "admin") {
          navigate("/userManagement"); // Redirektuj admina na /userManagement
        } else {
          navigate("/dashboard"); // Redirektuj regularnog korisnika na /dashboard
        }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.status === 401) {
        setMessage("Pogrešan email ili lozinka.");
      } else {
        setMessage("Došlo je do greške. Pokušajte ponovo.");
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Prijava</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="register-form">
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
          {errors.password && <p className="error-message">{errors.password[0]}</p>}
        </div>
        <button type="submit" className="btn-submit">
          Prijavi se
        </button>
      </form>
    </div>
  );
}

export default Login;
