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
  const recurring_transaction_id = initial?.recurring_transaction_id  || null

  const [name, setName] = useState(initial?.name || "");
  const [updateRec, setUpdateRec] = useState(false);
  const [amount, setAmount] = useState(initial?.amount || "");
  const [date, setDate] = useState(initial?.date ? toDateInputValue(initial.date) : new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState<string | null>(
  initial?.due_date
    ? toDateInputValue(initial.due_date)
    : null
);
  const [isRecurring, setIsRecurring] = useState(
  Boolean(initial?.recurring_transaction_id)
);
  const [walletId, setWalletId] = useState<number | "">(initial?.wallet_id || "");
  const [wallets, setWallets] = useState<{ id: number; name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const amountRegex = /^\d{1,10}([.,]\d{1,2})?$/;

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

    if (!amountRegex.test(amount)) {
      setError("O valor deve ter no máximo 2 casas decimais");
      return;
    }

    setLoading(true);
    try {
      const incomeData = {
        name: name.trim(),
        amount,
        date,
        due_date: dueDate,
        wallet_id: walletId || undefined,
        update_rec: updateRec,
        recurring_transaction_id: recurring_transaction_id
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
          type="text"
          //step="0.01"
          //min="0"
          inputMode="decimal"
          value={amount}
          onChange={(e) => {
    const value = e.target.value;

    if (/^\d*[,.]?\d*$/.test(value)) {
      setAmount(value);
    }
  }}
          placeholder="0,00"
        />
      </div>

      
         <div className="form-field">
        <label htmlFor="income-date">Data do recebimento</label>
        <input
          id="income-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      
     
{isRecurring && (
      <div className="form-field">
        <label htmlFor="income-due-date">Data de vencimento</label>
        <input
          id="income-due-date"
          type="date"
          value={dueDate ?? ""}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      )}

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
              onChange={(e) => {
  const checked = e.target.checked;

  setIsRecurring(checked);

  if (checked) {
    setDueDate(toDateInputValue(new Date().toISOString().split("T")[0]));
  } else {
    setDueDate(null);
  }
}}
            />
            Receita recorrente
          </label>
        </div>
      )}

            {(isEdit && isRecurring) && (
        <div className="form-field form-field-checkbox">
          <label htmlFor="expense-recurring">
            <input
              id="aa"
              type="checkbox"
              checked={updateRec}
              onChange={(e) => setUpdateRec(e.target.checked)}
            />
            Editar essa e as próximas receitas
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