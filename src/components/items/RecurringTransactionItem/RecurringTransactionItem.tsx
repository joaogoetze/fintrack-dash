import React from "react";
import { ArrowDownRight, ArrowUpRight, Repeat, Calendar, Tag } from "lucide-react";
import type { RecurringTransaction } from "../../../types";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import "./RecurringTransactionItem.css";

interface RecurringTransactionItemProps {
  transaction: RecurringTransaction;
}

export const RecurringTransactionItem: React.FC<RecurringTransactionItemProps> = ({
  transaction,
}) => {
  const isIncome = transaction.type === "income";

  // Formata o dia recorrente
  const getRecurrenceLabel = () => {
    if (transaction.dueDate) {
      const match = transaction.dueDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const day = parseInt(match[3], 10);
        return `Vence todo dia ${day}`;
      }
      return `Vence em ${formatDate(transaction.dueDate)}`;
    }
    if (transaction.startDate) {
      return `Iniciado em ${formatDate(transaction.startDate)}`;
    }
    return "Mensal";
  };

  return (
    <div className={`recurring-item-card ${isIncome ? "recurring-income" : "recurring-expense"}`}>
      <div className="recurring-item-main">
        <div className={`recurring-type-icon ${isIncome ? "income-icon" : "expense-icon"}`}>
          {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
        </div>

        <div className="recurring-item-content">
          <div className="recurring-title-row">
            <span className="recurring-item-name">{transaction.name}</span>
            <span className={`recurring-type-badge ${isIncome ? "badge-income" : "badge-expense"}`}>
              {isIncome ? "Receita" : "Despesa"}
            </span>
            {transaction.categoryName && (
              <span className="recurring-category-badge">
                <Tag size={12} /> {transaction.categoryName}
              </span>
            )}
          </div>

          <div className="recurring-meta-row">
            <span className="recurring-recurrence">
              <Calendar size={13} /> {getRecurrenceLabel()}
            </span>
            {transaction.startDate && (
              <span className="recurring-start-date">
                Desde: {formatDate(transaction.startDate)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="recurring-item-amount-wrapper">
        <span className={`recurring-item-amount ${isIncome ? "amount-income" : "amount-expense"}`}>
          {isIncome ? "+ " : "- "}
          {formatCurrency(transaction.amount)}
        </span>
        <span className="recurring-indicator">
          <Repeat size={12} /> Mensal
        </span>
      </div>
    </div>
  );
};

export default RecurringTransactionItem;

