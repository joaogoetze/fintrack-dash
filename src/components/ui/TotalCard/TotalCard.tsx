import "./TotalCard.css";

export default function TotalCard({ label, value }: { label: string; value: number }) {
  const formatarMoeda = (valor: number): string =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  return (
    <div className="total-card">
      <span className="total-card-label">{label}</span>
      <span className="total-card-value">{formatarMoeda(value)}</span>
    </div>
  );
}
