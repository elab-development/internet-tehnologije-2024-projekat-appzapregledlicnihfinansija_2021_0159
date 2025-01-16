import React from "react";

const IncomeItem = ({ income }) => (
  <li>
    {income.source} : {income.amount} {income.currency}
  </li>
);

export default IncomeItem;
