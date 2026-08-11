import "./InfoCard.css";

export default function InfoCard({ label, value }: { label: string; value: number }) {
  const formatarMoeda = (valor: number): string =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  return (
    <div className="info-card">
      <div className="info-card-label">{label}</div>
      <div className="info-card-value">{formatarMoeda(value)}</div>
    </div>
  );
}