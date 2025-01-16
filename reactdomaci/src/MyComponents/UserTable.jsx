import React, { useEffect, useState } from "react";
import UserStatistics from "./UserStatistics";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Za statistike jednog korisnika
  const [showAllStatistics, setShowAllStatistics] = useState(false); // Za sve korisnike
  const [searchQuery, setSearchQuery] = useState(""); // Pretraga
  const [sortField, setSortField] = useState(null); // Sortiranje
  const [sortOrder, setSortOrder] = useState("asc");

  // Dohvata sve korisnike
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/users", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Greška pri eksportu podataka korisnika");
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eksportuje podatke za sve korisnike
  const handleExportAll = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/export/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Greška pri eksportu podataka korisnika");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "all_users_data.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert(err.message);
    }
  };

  // Eksportuje podatke za jednog korisnika
  const handleExportUser = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/export/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Greška pri eksportu podataka korisnika");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user_${userId}_data.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Funkcija za sortiranje korisnika
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedUsers = [...users].sort((a, b) => {
      if (order === "asc") {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });

    setUsers(sortedUsers);
  };

  // Filtrirani i sortirani korisnici
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-table-container">
      <h1>Lista korisnika</h1>
      <div className="controls">
        <input
          type="text"
          placeholder="Pretraži po imenu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <button className="export-all-button btn-sm ml-1" onClick={handleExportAll} >
          Exportuj sve korisnike
        </button>
      </div>
      {loading && <p>Učitavanje...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <table className="user-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>ID</th>
              <th onClick={() => handleSort("name")}>Ime</th>
              <th onClick={() => handleSort("email")}>Email</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="export-user-button btn-sm mr-1"
                    onClick={() => handleExportUser(user.id)}
                  >
                    Exportuj
                  </button>
                  <button
                    className="statistics-button"
                    onClick={() => setSelectedUser(user)}
                  >
                    Statistike
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

 

      {/* Modal za statistike jednog korisnika */}
      {selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={() => setSelectedUser(null)} type="submit" className="btnSubmit mb-2">Zatvori</button>
            <UserStatistics
              userId={selectedUser.id}
              onClose={() => setSelectedUser(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
