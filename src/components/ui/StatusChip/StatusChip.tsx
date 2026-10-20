import { CheckCircle2, Clock } from "lucide-react";

import type { DueStatus } from "../../../utils/dueStatus";

import "./StatusChip.css";

interface StatusChipProps {
  status: DueStatus;
  paid: boolean;
  type: "income" | "expense";
  onClick: () => void;
  disabled?: boolean;
}

const statusModifiers: Record<DueStatus, string> = {
  "due-paid": "paid-toggle--paid",
  "due-today": "paid-toggle--overdue",
  "due-soon": "paid-toggle--pending",
  "due-later": "paid-toggle--later",
};

function StatusChip({ status, paid, type, onClick, disabled }: StatusChipProps) {
  const label = status === "due-paid"
    ? type === "income" ? "Recebido" : "Pago"
    : status === "due-today"
    ? "Vencido"
    : status === "due-soon"
    ? "Em breve"
    : "Pendente";

  const title = paid
    ? "Marcar como pendente"
    : type === "income" ? "Marcar como recebido" : "Marcar como pago";

  return (
    <button
      type="button"
      className={`paid-toggle ${statusModifiers[status]}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {status === "due-paid" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
      <span>{label}</span>
    </button>
  );
}

export default StatusChip;
