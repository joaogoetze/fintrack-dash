import type { Expense } from "../../../types/Expense";
import { formatDate, formatCurrency } from "../../../utils/formatters";
import { ArrowDownRight, Trash2, Pencil } from "lucide-react";
import { updateExpensePaid, deleteExpense } from "../../../api/expenses";
import { useState } from "react";
import SelectWalletModal from "../../ui/SelectWalletModal/SelectWalletModal";
import ConfirmDialog from "../../ui/ConfirmDialog/ConfirmDialog";
import "./ExpenseItem.css";

interface ExpenseItemProps {
  expense: Expense;
  onUpdate?: () => void;
  onEdit?: (expense: Expense) => void;
}

function ExpenseItem({ expense, onUpdate, onEdit }: ExpenseItemProps) {
  const [loading, setLoading] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handlePaidChange = async (newPaid: boolean) => {
    if (newPaid && !expense.wallet_id) {
      setIsWalletModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      await updateExpensePaid(
        expense.id,
        newPaid,
        expense.wallet_id,
        Number(expense.amount)
      );
      onUpdate?.();
    } catch (err) {
      console.error("Erro ao atualizar status de pagamento:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConfirm = async (walletId: number) => {
    setLoading(true);
    try {
      await updateExpensePaid(expense.id, true, walletId, Number(expense.amount));
      onUpdate?.();
    } catch (err) {
      console.error("Erro ao marcar como pago:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteExpense(expense.id);
      setIsDeleteModalOpen(false);
      onUpdate?.();
    } catch (err) {
      console.error("Erro ao excluir despesa:", err);
    } finally {
      setLoading(false);
    }
  };

  const isRecurring = Boolean(expense.recurring_transaction_id);
  const deleteMessage = expense.paid
    ? `O valor de R$ ${expense.amount} será adicionado de volta à carteira. Deseja excluir esta despesa?`
    : "Deseja excluir esta despesa?";

  return (
    <>
      <div className={`expense-item-row ${!expense.paid ? "unpaid" : ""}`}>
        <div className="item-cell item-name-cell">
          <ArrowDownRight size={18} className="expense-icon" />
          <span className="item-name">{expense.name}</span>
        </div>
        <div className="item-cell item-value-cell">
          <span className="item-label-mobile">Valor:</span>
          <span className="item-value">{formatCurrency(Number(expense.amount))}</span>
        </div>
        <div className="item-cell item-date-cell">
          <span className="item-label-mobile">Data:</span>
          <span className="item-date">{formatDate(expense.date)}</span>
        </div>
        <div className="item-cell item-date-cell">
          <span className="item-label-mobile">Vencimento:</span>
          <span className="item-date">{formatDate(expense.due_date) || "-"}</span>
        </div>
        <div className="item-cell item-wallet-cell">
          <span className="item-label-mobile">Carteira:</span>
          <span className="item-wallet">{expense.wallet_name || "-"}</span>
        </div>
        <div className="item-cell item-actions-cell">
          <label className="paid-checkbox" title="Marcar como pago">
            <input
              type="checkbox"
              checked={expense.paid}
              onChange={(e) => handlePaidChange(e.target.checked)}
              disabled={loading}
            />
            <span className="paid-label-text">Pago</span>
          </label>
          <button
            type="button"
            className="item-action-btn edit-btn"
            onClick={() => onEdit?.(expense)}
            disabled={loading}
            title="Editar"
          >
            <Pencil size={18} />
          </button>
          {!isRecurring ? (
            <button
              type="button"
              className="item-action-btn delete-btn"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={loading}
              title="Excluir"
            >
              <Trash2 size={18} />
            </button>
          ) : (
            <div className="item-action-btn" style={{ visibility: "hidden" }}>
              <Trash2 size={18} />
            </div>
          )}
        </div>
      </div>

      <SelectWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConfirm={handleWalletConfirm}
      />

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Excluir despesa"
        message={deleteMessage}
        confirmText="Excluir"
        onConfirm={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}

export default ExpenseItem;