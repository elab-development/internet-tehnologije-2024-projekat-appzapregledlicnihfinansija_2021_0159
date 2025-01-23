import React from "react";

const GoalCard = ({ goal, onClick, isSelected }) => (
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
    <p>Status: {goal.status}</p>
    <p>Rok: {goal.deadline}</p>
  </div>
);

export default GoalCard;
