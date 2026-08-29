import type { Income } from "../../../types/Income";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { ArrowUpRight, CheckSquare } from "lucide-react";
import { updateIncomePaid } from "../../../api/incomes";
import { useState } from "react";
import SelectWalletModal from "../../ui/SelectWalletModal/SelectWalletModal";
import "./IncomeItem.css";

interface IncomeItemProps {
  income: Income;
  onUpdate?: () => void;
}

function IncomeItem({ income, onUpdate }: IncomeItemProps) {
  const [loading, setLoading] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

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

  return (
    <>
      <div className={`income-card ${!income.paid ? "unpaid" : ""}`}>
        <div className="income-card-header">
          <div className="income-card-name-wrapper">
            <ArrowUpRight size={18} className="income-icon" />
            <span className="income-card-name">{income.name}</span>
          </div>
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
    </>
  );
}

export default IncomeItem;
