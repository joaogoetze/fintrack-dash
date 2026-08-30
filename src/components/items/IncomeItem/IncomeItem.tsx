import type { Income } from "../../../types/Income";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { ArrowUpRight, CheckSquare, Trash2 } from "lucide-react";
import { updateIncomePaid, deleteIncome } from "../../../api/incomes";
import { useState } from "react";
import SelectWalletModal from "../../ui/SelectWalletModal/SelectWalletModal";
import ConfirmDialog from "../../ui/ConfirmDialog/ConfirmDialog";
import "./IncomeItem.css";

interface IncomeItemProps {
  income: Income;
  onUpdate?: () => void;
}

function IncomeItem({ income, onUpdate }: IncomeItemProps) {
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
      <div className={`income-card ${!income.paid ? "unpaid" : ""}`}>
        <div className="income-card-header">
          <div className="income-card-name-wrapper">
            <ArrowUpRight size={18} className="income-icon" />
            <span className="income-card-name">{income.name}</span>
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
        <div className="income-card-info">
          <span className="income-card-label">Valor</span>
          <span className="income-card-value">{formatCurrency(income.amount)}</span>
        </div>
        <div className="income-card-info">
          <span className="income-card-label">Data</span>
          <span className="income-card-value">{formatDate(income.date)}</span>
        </div>
        <div className="income-card-info">
          <span className="income-card-label">Data de vencimento</span>
          <span className="income-card-value">{formatDate(income.due_date) || "Nenhuma data"}</span>
        </div>
        <div className="income-card-info">
          <span className="income-card-label">Carteira</span>
          <span className="income-card-value">
            {income.wallet_name || "Nenhuma carteira selecionada"}
          </span>
        </div>
        <div className="income-card-paid">
          <label className="paid-checkbox">
            <input
              type="checkbox"
              checked={income.paid}
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