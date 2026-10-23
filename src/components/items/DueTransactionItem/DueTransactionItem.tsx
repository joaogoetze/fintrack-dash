import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";

import type { DueTransaction } from "../../../types";

import { updateExpensePaid } from "../../../api/expenses";
import { updateIncomePaid } from "../../../api/incomes";
import { getDueStatus } from "../../../utils/dueStatus";
import { formatDate, formatCurrency } from "../../../utils/formatters";
import { toastApiError } from "../../../utils/toast";
import PaymentModal from "../../ui/PaymentModal/PaymentModal";
import StatusChip from "../../ui/StatusChip/StatusChip";

import "./DueTransactionItem.css";

interface DueTransactionItemProps {
  transaction: DueTransaction;
  onUpdate?: () => void;
}

function DueTransactionItem({ transaction, onUpdate }: DueTransactionItemProps) {
  const [loading, setLoading] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const updatePaid = (newPaid: boolean, walletId?: number, date?: string | null) =>
    transaction.type === "expense"
      ? updateExpensePaid(transaction.id, newPaid, walletId, Number(transaction.amount), date)
      : updateIncomePaid(transaction.id, newPaid, walletId, Number(transaction.amount), date);

  const handlePaidChange = async (newPaid: boolean) => {
    if (newPaid && !transaction.walletId) {
      setIsWalletModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      await updatePaid(
        newPaid,
        transaction.walletId ?? undefined,
        newPaid ? transaction.date : undefined
      );
      onUpdate?.();
    } catch (err) {
      toastApiError(err, "Erro ao atualizar pagamento");
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConfirm = async (walletId: number, date?: string | null) => {
    setLoading(true);
    try {
      await updatePaid(true, walletId, date);
      onUpdate?.();
    } catch (err) {
      toastApiError(err, "Erro ao marcar como pago");
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
          <StatusChip
            status={status}
            paid={transaction.paid}
            type={transaction.type}
            onClick={() => handlePaidChange(!transaction.paid)}
            disabled={loading}
          />
        </div>
        <div className="due-card-info">
          <span className="due-card-label">Valor</span>
          <span className="due-card-value">{formatCurrency(transaction.amount)}</span>
        </div>
        <div className="due-card-info">
          <span className="due-card-label">Data de vencimento</span>
          <span className="due-card-value">
            {formatDate(transaction.dueDate) || "Nenhuma data"}
          </span>
        </div>
      </div>

      <PaymentModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConfirm={handleWalletConfirm}
        initialWalletId={transaction.walletId}
        initialDate={transaction.date}
      />
    </>
  );
}

export default DueTransactionItem;
