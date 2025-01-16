import React from "react";

const ExpenseItem = ({ expense }) => (
  <li>
    {expense.description} : {expense.amount} {expense.currency}
  </li>
);

export default ExpenseItem;
