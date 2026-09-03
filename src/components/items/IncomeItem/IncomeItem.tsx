import type { Income } from "../../../types/Income";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { ArrowUpRight, Trash2, Pencil } from "lucide-react";
import { updateIncomePaid, deleteIncome } from "../../../api/incomes";
import { useState } from "react";
import SelectWalletModal from "../../ui/SelectWalletModal/SelectWalletModal";
import ConfirmDialog from "../../ui/ConfirmDialog/ConfirmDialog";
import "./IncomeItem.css";

interface IncomeItemProps {
  income: Income;
  onUpdate?: () => void;
  onEdit?: (income: Income) => void;
}

function IncomeItem({ income, onUpdate, onEdit }: IncomeItemProps) {
  const [loading, setLoading] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handlePaidChange = async (newPaid: boolean) => {
    if (newPaid && !income.wallet_id) {
      setIsWalletModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      await updateIncomePaid(
        income.id,
        newPaid,
        income.wallet_id,
        Number(income.amount)
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
      await updateIncomePaid(income.id, true, walletId, Number(income.amount));
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
      await deleteIncome(income.id);
      setIsDeleteModalOpen(false);
      onUpdate?.();
    } catch (err) {
      console.error("Erro ao excluir receita:", err);
    } finally {
      setLoading(false);
    }
  };

  const isRecurring = Boolean(income.recurring_transaction_id);
  const deleteMessage = income.paid
    ? `O valor de ${formatCurrency(income.amount)} será subtraído da carteira. Deseja excluir esta receita?`
    : "Deseja excluir esta receita?";

  return (
    <>
      <div className={`income-item-row ${!income.paid ? "unpaid" : ""}`}>
        <div className="item-cell item-name-cell">
          <ArrowUpRight size={18} className="income-icon" />
          <span className="item-name">{income.name}</span>
        </div>
        <div className="item-cell item-value-cell">
          <span className="item-label-mobile">Valor:</span>
          <span className="item-value">{formatCurrency(income.amount)}</span>
        </div>
        <div className="item-cell item-date-cell">
          <span className="item-label-mobile">Data:</span>
          <span className="item-date">{formatDate(income.date)}</span>
        </div>
        <div className="item-cell item-date-cell">
          <span className="item-label-mobile">Vencimento:</span>
          <span className="item-date">{formatDate(income.due_date) || "-"}</span>
        </div>
        <div className="item-cell item-wallet-cell">
          <span className="item-label-mobile">Carteira:</span>
          <span className="item-wallet">{income.wallet_name || "-"}</span>
        </div>
        <div className="item-cell item-actions-cell">
          <label className="paid-checkbox" title="Marcar como pago">
            <input
              type="checkbox"
              checked={income.paid}
              onChange={(e) => handlePaidChange(e.target.checked)}
              disabled={loading}
            />
            <span className="paid-label-text">Pago</span>
          </label>
          <button
            type="button"
            className="item-action-btn edit-btn"
            onClick={() => onEdit?.(income)}
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
        title="Excluir receita"
        message={deleteMessage}
        confirmText="Excluir"
        onConfirm={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}

export default IncomeItem;