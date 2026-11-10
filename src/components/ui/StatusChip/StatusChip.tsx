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
  "due-today": "paid-toggle--today",
  "due-soon": "paid-toggle--pending",
  "due-later": "paid-toggle--later",
  "past-due": "paid-toggle--past"
};

function StatusChip({ status, paid, type, onClick, disabled }: StatusChipProps) {
  console.log("status", status);
  const label = status === "due-paid"
    ? type === "income" ? "Recebido" : "Pago"
    : status === "due-today"
    ? "Vence hoje"
    : status === "due-soon"
    ? "Em breve"
    : status === "past-due"
    ? "Vencido"
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
