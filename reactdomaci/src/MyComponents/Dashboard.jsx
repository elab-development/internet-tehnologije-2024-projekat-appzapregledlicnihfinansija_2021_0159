import React, { useState } from "react";
import GoalCard from "./GoalCard";
import { useFetchGoals } from "./hooks/useFetchGoals";
import axios from "axios";

const Dashboard = () => {
  const { goals,setGoals, loading, error } = useFetchGoals();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target_amount: 0,
    deadline: "",
    status: "in_progress",
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleAddGoal = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/goals",
        newGoal,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGoals((prevGoals) => [...prevGoals, response.data]);
      setNewGoal({
        title: "",
        description: "",
        target_amount: 0,
        deadline: "",
        status: "in_progress",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Greška prilikom dodavanja cilja.", err);
    }
  };

  const handleUpdateGoal = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://127.0.0.1:8000/api/goals/${selectedGoal.id}`,
        selectedGoal,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGoals((prevGoals) =>
        prevGoals.map((goal) => (goal.id === selectedGoal.id ? response.data : goal))
      );
      setSelectedGoal(null);
      setShowModal(false);
    } catch (err) {
      console.error("Greška prilikom ažuriranja cilja.", err);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/goals/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
    } catch (err) {
      alert("GRESKA");
      console.error("Greška prilikom brisanja cilja.", err);
    }
  };

  const openModal = (goal = null) => {
    setSelectedGoal(goal);
    setEditMode(!!goal);
    setShowModal(true);
  };

  if (loading) return <p>Učitavanje podataka...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-container">
      <div className="text-center mb-4">
      <button onClick={() => openModal()} type="submit" className="btn-submit">Dodaj novi cilj</button>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? "Ažuriranje cilja" : "Kreiranje novog cilja"}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editMode ? handleUpdateGoal() : handleAddGoal();
              }}
            >
              <label>
                Naslov:
                <input
                  type="text"
                  value={editMode ? selectedGoal.title : newGoal.title}
                  onChange={(e) =>
                    editMode
                      ? setSelectedGoal({ ...selectedGoal, title: e.target.value })
                      : setNewGoal({ ...newGoal, title: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Opis:
                <input
                  type="text"
                  value={editMode ? selectedGoal.description : newGoal.description}
                  onChange={(e) =>
                    editMode
                      ? setSelectedGoal({ ...selectedGoal, description: e.target.value })
                      : setNewGoal({ ...newGoal, description: e.target.value })
                  }
                />
              </label>
              <label>
                Ciljani iznos:
                <input
                  type="number"
                  value={editMode ? selectedGoal.target_amount : newGoal.target_amount}
                  onChange={(e) =>
                    editMode
                      ? setSelectedGoal({ ...selectedGoal, target_amount: e.target.value })
                      : setNewGoal({ ...newGoal, target_amount: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Rok:
                <input
                  type="date"
                  value={editMode ? selectedGoal.deadline : newGoal.deadline}
                  onChange={(e) =>
                    editMode
                      ? setSelectedGoal({ ...selectedGoal, deadline: e.target.value })
                      : setNewGoal({ ...newGoal, deadline: e.target.value })
                  }
                />
              </label>
              <label>
                Status:
                <select
                  value={editMode ? selectedGoal.status : newGoal.status}
                  onChange={(e) =>
                    editMode
                      ? setSelectedGoal({ ...selectedGoal, status: e.target.value })
                      : setNewGoal({ ...newGoal, status: e.target.value })
                  }
                  required
                >
                  <option value="in_progress">U toku</option>
                  <option value="achieved">Ostvareno</option>
                  <option value="failed">Neuspešno</option>
                </select>
              </label>
              <button type="submit">Sačuvaj</button>
              <button type="button" onClick={() => setShowModal(false)}>
                Zatvori
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="goals-section">
        <h3>Ciljevi</h3>
        <div className="goals-list">
          {goals.map((goal) => (
            <div key={goal.id} className="goal-item">
              <GoalCard
                goal={goal}
                onClick={() => setSelectedGoal(goal)}
                isSelected={selectedGoal?.id === goal.id}
              />
              <button onClick={() => openModal(goal)} type="submit" className="btn-submit">Uredi</button>
              <button onClick={() => handleDeleteGoal(goal.id)} type="submit" className="btn-submit">Obriši</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
