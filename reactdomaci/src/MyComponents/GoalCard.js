import React from "react";

const GoalCard = ({ goal, onClick, isSelected }) => {
  const getStatusLabel = (status) => {
    switch (status) {
      case "in_progress":
        return "U toku";
      case "achieved":
        return "Ostvareno";
      case "failed":
        return "Neuspešno";
      default:
        return status; 
    }
  };

  return (
    <div
      className={`goal-card ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(goal)}
    >
      <h4>{goal.title}</h4>
      <p>{goal.description}</p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${goal.progress}%` }}></div>
      </div>
      <p>
        {goal.current_amount} / {goal.target_amount} ({goal.progress}%)
      </p>
      <p>Status: {getStatusLabel(goal.status)}</p>
      <p>Rok: {goal.deadline}</p>
    </div>
  );
};

export default GoalCard;

