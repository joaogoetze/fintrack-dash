import type { Expense } from "../../../types/Expense";
import { formatDate, toDateInputValue, formatCurrency } from "../../../utils/formatters";
import { ArrowDownRight, CheckSquare } from "lucide-react";
import { updateExpensePaid } from "../../../api/expenses";
import { useState } from "react";
import SelectWalletModal from "../../ui/SelectWalletModal/SelectWalletModal";
import "./DueExpenseItem.css";

interface DueExpenseItemProps {
  expense: Expense;
  onUpdate?: () => void;
}

type DueStatus = "due-paid" | "due-today" | "due-soon" | "due-later";

function getDueStatus(expense: Expense): DueStatus {
  if (expense.paid) return "due-paid";

  const dueStr = toDateInputValue(expense.due_date);
  if (!dueStr) return "due-later";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueStr + "T00:00:00");

  if (due <= today) return "due-today";

  const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 3) return "due-soon";

  return "due-later";
}

function DueExpenseItem({ expense, onUpdate }: DueExpenseItemProps) {
  const [loading, setLoading] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

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

  const status = getDueStatus(expense);

  return (
    <>
      <div className={`due-card ${status}`}>
        <div className="due-card-header">
          <div className="due-card-name-wrapper">
            <ArrowDownRight size={18} className="due-icon" />
            <span className="due-card-name">{expense.name}</span>
          </div>
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
        <div className="due-card-info">
          <span className="due-card-label">Valor</span>
          <span className="due-card-value">{formatCurrency(Number(expense.amount))}</span>
        </div>
        <div className="due-card-info">
          <span className="due-card-label">Data de vencimento</span>
          <span className="due-card-value due-date-value">
            {formatDate(expense.due_date) || "Nenhuma data"}
          </span>
        </div>
      </div>

      <SelectWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConfirm={handleWalletConfirm}
      />
    </>
  );
}

export default DueExpenseItem;