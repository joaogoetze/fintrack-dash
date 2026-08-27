import type { Income } from "../../../types/Income";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { ArrowUpRight, CheckSquare } from "lucide-react";
import { updateIncomePaid } from "../../../api/incomes";
import { useState } from "react";
import "./IncomeItem.css";

interface IncomeItemProps {
  income: Income;
  onUpdate?: () => void;
}

function IncomeItem({ income, onUpdate }: IncomeItemProps) {
  const [loading, setLoading] = useState(false);

  const handlePaidChange = async (newPaid: boolean) => {
    setLoading(true);
    try {
      await updateIncomePaid(income.id, newPaid);
      onUpdate?.();
    } catch (err) {
      console.error("Erro ao atualizar status de pagamento:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`income-card ${!income.paid ? "unpaid" : ""}`}>
      <div className="income-card-header">
        <div className="income-card-name-wrapper">
          <ArrowUpRight size={18} className="income-icon" />
          <span className="income-card-name">{income.name}</span>
        </div>
      </div>
      <div className="income-card-info">
        <span className="income-card-label">Valor</span>
        <span className="income-card-value">{formatCurrency(income.value)}</span>
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
  );
}

export default IncomeItem;