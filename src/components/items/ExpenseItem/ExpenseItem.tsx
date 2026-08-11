import type { Expense } from "../../../types/Expense";
import { formatDate } from "../../../utils/formatters";
import { ArrowDownRight } from "lucide-react";
import "./ExpenseItem.css";

function ExpenseItem({ expense }: { expense: Expense }) {
  return (
    <div className="expense-card">
      <div className="expense-card-header">
        <div className="expense-card-name-wrapper">
          <ArrowDownRight size={18} className="expense-icon" />
          <span className="expense-card-name">{expense.name}</span>
        </div>
        {expense.is_recurrent && <span className="expense-card-tag">Recorrente</span>}
      </div>
      <div className="expense-card-info">
        <span className="expense-card-label">Valor</span>
        <span className="expense-card-value">{expense.amount}</span>
      </div>
      <div className="expense-card-info">
        <span className="expense-card-label">Data</span>
        <span className="expense-card-value">{formatDate(expense.date)}</span>
      </div>
      <div className="expense-card-info">
        <span className="expense-card-label">Carteira</span>
        <span className="expense-card-value">
          {expense.wallet_name || "Nenhuma carteira selecionada"}
        </span>
      </div>
    </div>
  );
}

export default ExpenseItem;