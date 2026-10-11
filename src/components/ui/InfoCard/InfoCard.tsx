import "./InfoCard.css";

interface InfoCardProps {
  label: string;
  value: number;
  paidValue?: number;
  paidLabel?: string;
  unpaidValue?: number;
  unpaidLabel?: string;
  secondaryLabel?: string;
  secondaryValue?: number;
  type?: "income" | "expense" | "balance";
}

export default function InfoCard({
  label,
  value,
  paidValue,
  paidLabel,
  unpaidValue,
  unpaidLabel,
  secondaryLabel,
  secondaryValue,
  type = "balance",
}: InfoCardProps) {
  const formatCurrency = (val: number): string =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  const hasBreakdown = paidValue !== undefined && unpaidValue !== undefined;
  const progressPercent =
    hasBreakdown && value > 0
      ? Math.min(100, Math.max(0, Math.round(((paidValue || 0) / value) * 100)))
      : 0;

  return (
    <div className={`info-card info-card-${type}`}>
      <div className="info-card-header">
        <span className="info-card-label">{label}</span>
        {hasBreakdown && value > 0 && (
          <span className="info-card-percentage">{progressPercent}%</span>
        )}
      </div>

      <div className="info-card-value">{formatCurrency(value)}</div>

      {hasBreakdown && (
        <div className="info-card-breakdown">
          <div className="info-card-progress-bar">
            <div
              className={`info-card-progress-fill fill-${type}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="info-card-details">
            <div className="info-card-subitem">
              <span className="subitem-indicator indicator-paid" />
              <span className="subitem-label">{paidLabel || "Efetivado"}:</span>
              <span className="subitem-value">{formatCurrency(paidValue || 0)}</span>
            </div>
            <div className="info-card-subitem">
              <span className="subitem-indicator indicator-unpaid" />
              <span className="subitem-label">{unpaidLabel || "Pendente"}:</span>
              <span className="subitem-value">{formatCurrency(unpaidValue || 0)}</span>
            </div>
          </div>
        </div>
      )}

      {secondaryValue !== undefined && secondaryLabel && (
        <div className="info-card-secondary-footer">
          <span className="secondary-label">{secondaryLabel}:</span>
          <span
            className={`secondary-value ${
              secondaryValue < 0 ? "negative" : secondaryValue > 0 ? "positive" : ""
            }`}
          >
            {formatCurrency(secondaryValue)}
          </span>
        </div>
      )}
    </div>
  );
}