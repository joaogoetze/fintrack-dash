import type { Income } from "../../../types/Income";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { ArrowUpRight } from "lucide-react";
import "./IncomeItem.css";

function IncomeItem({ income }: { income: Income }) {
  return (
    <div className="income-card">
      <div className="income-card-header">
        <div className="income-card-name-wrapper">
          <ArrowUpRight size={18} className="income-icon" />
          <span className="income-card-name">{income.name}</span>
        </div>
        {income.is_recurrent && <span className="income-card-tag">Recorrente</span>}
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
        <span className="income-card-label">Carteira</span>
        <span className="income-card-value">
          {income.wallet_name || "Nenhuma carteira selecionada"}
        </span>
      </div>
    </div>
  );
}

export default IncomeItem;