import { useState, useEffect } from "react";
import "./IncomeForm.css";
import { createIncome, updateIncome } from "../../../api/incomes";
import { getWallets } from "../../../api/wallets";
import SelectField from "../../ui/SelectField/SelectField";
import { toDateInputValue } from "../../../utils/formatters";
import type { Income } from "../../../types/Income";

interface IncomeFormProps {
  initial?: Income;
  onClose: () => void;
  onSaved: () => void;
}

function IncomeForm({ initial, onClose, onSaved }: IncomeFormProps) {
  const isEdit = Boolean(initial);

  const [name, setName] = useState(initial?.name || "");
  const [value, setValue] = useState(initial?.amount ? String(initial.amount) : "");
  const [date, setDate] = useState(initial?.date ? toDateInputValue(initial.date) : new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(initial?.due_date ? toDateInputValue(initial.due_date) : new Date().toISOString().split("T")[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [walletId, setWalletId] = useState<number | "">(initial?.wallet_id || "");
  const [wallets, setWallets] = useState<{ id: number; name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const data = await getWallets();
        setWallets(data);
      } catch (err) {
        console.error("Erro ao carregar wallets:", err);
      }
    };
    loadWallets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nome é obrigatório");
      return;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      setError("Valor deve ser um número positivo");
      return;
    }

    setLoading(true);
    try {
      const incomeData = {
        name: name.trim(),
        value: numericValue,
        date,
        due_date: dueDate,
        wallet_id: walletId || undefined,
      };

      if (isEdit && initial) {
        await updateIncome(initial.id, incomeData);
      } else {
        await createIncome({ ...incomeData, is_recurring: isRecurring });
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <div className="form-field">
        <label htmlFor="income-name">Nome</label>
        <input
          id="income-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Salário"
        />
      </div>

      <div className="form-field">
        <label htmlFor="income-value">Valor (R$)</label>
        <input
          id="income-value"
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0,00"
        />
      </div>

      <div className="form-field">
        <label htmlFor="income-date">Data</label>
        <input
          id="income-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="income-due-date">Data de vencimento</label>
        <input
          id="income-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="income-wallet">Carteira (opcional)</label>
        <SelectField
          id="income-wallet"
          value={walletId}
          onChange={(e) => setWalletId(e.target.value === "" ? "" : Number(e.target.value))}
        >
          <option value="">Selecione uma carteira</option>
          {wallets.map(wallet => (
            <option key={wallet.id} value={wallet.id}>
              {wallet.name}
            </option>
          ))}
        </SelectField>
      </div>

      {!isEdit && (
        <div className="form-field form-field-checkbox">
          <label htmlFor="income-recurring">
            <input
              id="income-recurring"
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            Receita recorrente
          </label>
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" className="btn-save" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}

export default IncomeForm;