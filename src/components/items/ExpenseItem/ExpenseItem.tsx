import type { Expense } from "../../../types/Expense";
import { formatDate } from "../../../utils/formatters";
import { ArrowDownRight, CheckSquare, Trash2 } from "lucide-react";
import { updateExpensePaid, deleteExpense } from "../../../api/expenses";
import { useState } from "react";
import SelectWalletModal from "../../ui/SelectWalletModal/SelectWalletModal";
import ConfirmDialog from "../../ui/ConfirmDialog/ConfirmDialog";
import "./ExpenseItem.css";

interface ExpenseItemProps {
  expense: Expense;
  onUpdate?: () => void;
}

function ExpenseItem({ expense, onUpdate }: ExpenseItemProps) {
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
      <div className={`expense-card ${!expense.paid ? "unpaid" : ""}`}>
        <div className="expense-card-header">
          <div className="expense-card-name-wrapper">
            <ArrowDownRight size={18} className="expense-icon" />
            <span className="expense-card-name">{expense.name}</span>
          </div>
          {!isRecurring && (
            <button
              type="button"
              className="item-delete-btn"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={loading}
            >
              <Trash2 size={18} />
            </button>
          )}
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
          <span className="expense-card-label">Data para pagamento</span>
          <span className="expense-card-value">{formatDate(expense.due_date) || "Nenhuma data"}</span>
        </div>
        <div className="expense-card-info">
          <span className="expense-card-label">Carteira</span>
          <span className="expense-card-value">
            {expense.wallet_name || "Nenhuma carteira selecionada"}
          </span>
        </div>
        <div className="expense-card-paid">
          <label className="paid-checkbox">
            <input
              type="checkbox"
              checked={expense.paid}
              onChange={(e) => handlePaidChange(e.target.checked)}
              disabled={loading}
            />
            <CheckSquare size={18} />
            <span>Pago</span>
          </label>
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