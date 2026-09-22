import { ArrowDownRight, ArrowUpRight, CheckSquare } from "lucide-react";
import { useState } from "react";

import type { DueTransaction } from "../../../types";

import { updateExpensePaid } from "../../../api/expenses";
import { updateIncomePaid } from "../../../api/incomes";
import { formatDate, toDateInputValue, formatCurrency } from "../../../utils/formatters";
import SelectWalletModal from "../../ui/SelectWalletModal/SelectWalletModal";

import "./DueTransactionItem.css";

interface DueTransactionItemProps {
  transaction: DueTransaction;
  onUpdate?: () => void;
}

type DueStatus = "due-paid" | "due-today" | "due-soon" | "due-later";

function getDueStatus(transaction: Pick<DueTransaction, "paid" | "dueDate">): DueStatus {
  if (transaction.paid) return "due-paid";

  const dueStr = toDateInputValue(transaction.dueDate);
  if (!dueStr) return "due-later";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueStr + "T00:00:00");

  if (due <= today) return "due-today";

  const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 3) return "due-soon";

  return "due-later";
}

function DueTransactionItem({ transaction, onUpdate }: DueTransactionItemProps) {
  const [loading, setLoading] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const updatePaid = (newPaid: boolean, walletId?: number) =>
    transaction.type === "expense"
      ? updateExpensePaid(transaction.id, newPaid, walletId, Number(transaction.amount))
      : updateIncomePaid(transaction.id, newPaid, walletId, Number(transaction.amount));

  const handlePaidChange = async (newPaid: boolean) => {
    if (newPaid && !transaction.walletId) {
      setIsWalletModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      await updatePaid(newPaid, transaction.walletId ?? undefined);
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
      await updatePaid(true, walletId);
      onUpdate?.();
    } catch (err) {
      console.error("Erro ao marcar como pago:", err);
    } finally {
      setLoading(false);
    }
  };

  const status = getDueStatus(transaction);
  const Icon = transaction.type === "expense" ? ArrowDownRight : ArrowUpRight;

  return (
    <>
      <div className={`due-card ${status} due-${transaction.type}`}>
        <div className="due-card-header">
          <div className="due-card-name-wrapper">
            <Icon size={18} className="due-icon" />
            <span className="due-card-name">{transaction.name}</span>
          </div>
          <label className="paid-checkbox">
            <input
              type="checkbox"
              checked={transaction.paid}
              onChange={(e) => handlePaidChange(e.target.checked)}
              disabled={loading}
            />
            <CheckSquare size={18} />
            <span>Pago</span>
          </label>
        </div>
        <div className="due-card-info">
          <span className="due-card-label">Valor</span>
          <span className="due-card-value">{formatCurrency(transaction.amount)}</span>
        </div>
        <div className="due-card-info">
          <span className="due-card-label">Data de vencimento</span>
          <span className="due-card-value due-date-value">
            {formatDate(transaction.dueDate) || "Nenhuma data"}
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

export default DueTransactionItem;
