import "./TotalCard.css";

interface TotalCardProps {
  label: string;
  value: number;
  paidValue?: number;
  paidLabel?: string;
  unpaidValue?: number;
  unpaidLabel?: string;
}

export default function TotalCard({
  label,
  value,
  paidValue,
  paidLabel = "Já Pago",
  unpaidValue,
  unpaidLabel = "A Pagar",
}: TotalCardProps) {
  const formatarMoeda = (valor: number): string =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  const hasBreakdown = paidValue !== undefined && unpaidValue !== undefined;
  const progressPercent =
    hasBreakdown && value > 0
      ? Math.min(100, Math.max(0, Math.round(((paidValue || 0) / value) * 100)))
      : 0;

  if (!hasBreakdown) {
    return (
      <div className="total-card">
        <span className="total-card-label">{label}</span>
        <span className="total-card-value">{formatarMoeda(value)}</span>
      </div>
    );
  }

  return (
    <div className="total-card total-card-detailed">
      <div className="total-card-section total-card-primary">
        <span className="total-card-label">{label}</span>
        <span className="total-card-value">{formatarMoeda(value)}</span>
      </div>

      <div className="total-card-divider" />

      <div className="total-card-section">
        <div className="total-card-subitem">
          <span className="total-dot total-dot-paid" />
          <span className="total-card-label">{paidLabel}</span>
        </div>
        <span className="total-card-subvalue text-paid">{formatarMoeda(paidValue || 0)}</span>
      </div>

      <div className="total-card-divider" />

      <div className="total-card-section">
        <div className="total-card-subitem">
          <span className="total-dot total-dot-unpaid" />
          <span className="total-card-label">{unpaidLabel}</span>
        </div>
        <span className="total-card-subvalue text-unpaid">{formatarMoeda(unpaidValue || 0)}</span>
      </div>

      {value > 0 && (
        <div className="total-card-progress" title={`${progressPercent}% concluído`}>
          <div
            className="total-card-progress-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
