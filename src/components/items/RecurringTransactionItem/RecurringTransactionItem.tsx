import { ArrowDownRight, ArrowUpRight, Repeat, Calendar, Tag, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import type { RecurringTransaction } from "../../../types";

import { deleteRecurringTransaction } from "../../../api/recurringTransactions";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { toastApiError } from "../../../utils/toast";
import ConfirmDialog from "../../ui/ConfirmDialog/ConfirmDialog";

import "./RecurringTransactionItem.css";

interface RecurringTransactionItemProps {
  transaction: RecurringTransaction;
  onUpdate?: () => void;
  onEdit?: (transaction: RecurringTransaction) => void;
}

export default function RecurringTransactionItem({
  transaction,
  onUpdate,
  onEdit,
}: RecurringTransactionItemProps) {
  const isIncome = transaction.type === "income";
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleDelete = async () => {
    try {
      await deleteRecurringTransaction(transaction.id);
      setIsDeleteModalOpen(false);
      onUpdate?.();
    } catch (err) {
      toastApiError(err, "Erro ao excluir recorrente");
    }
  };

  return (
    <>
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

        <div className="item-actions">
          <button
            type="button"
            className="item-edit-btn"
            onClick={() => onEdit?.(transaction)}
            title="Editar"
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            className="item-delete-btn"
            onClick={() => setIsDeleteModalOpen(true)}
            title="Excluir"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Excluir recorrente"
        message={`Deseja excluir a recorrente "${transaction.name}"? Os lançamentos já gerados nos meses permanecem.`}
        confirmText="Excluir"
        onConfirm={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
