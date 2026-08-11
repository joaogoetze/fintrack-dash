import { useState, useEffect } from "react";
import "./ExpenseForm.css";
import { createExpense } from "../../../api/expenses";
import { getWallets, updateWallet } from "../../../api/wallets";
import SelectField from "../../ui/SelectField/SelectField";

interface ExpenseFormProps {
  onClose: () => void;
  onSaved: () => void;
}

function ExpenseForm({ onClose, onSaved }: ExpenseFormProps) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [walletId, setWalletId] = useState<number | "">("");
  const [wallets, setWallets] = useState<{ id: number; name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const amountRegex = /^\d{1,10}(\.\d{1,2})?$/;

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

    if (!amountRegex.test(value)) {
      setError("O valor deve ter no máximo 2 casas decimais");
      return;
    }

    if (!name.trim()) {
      setError("Nome é obrigatório");
      return;
    }

    setLoading(true);
    try {
      const expenseData = {
        name: name.trim(),
        value,
        date,
        is_recurring: isRecurring,
        wallet_id: walletId || undefined,
      };

      await createExpense(expenseData);

      // Atualizar saldo da wallet se selecionada
      if (walletId) {
        const wallet = wallets.find(w => w.id === walletId);
        if (wallet) {
          // Despesa subtrai do saldo

          await updateWallet(walletId, { value: Number(value), operation: "expense" });
        }
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
        <label htmlFor="expense-name">Nome</label>
        <input
          id="expense-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Aluguel"
        />
      </div>

      <div className="form-field">
        <label htmlFor="expense-value">Valor (R$)</label>
        <input
          id="expense-value"
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0,00"
        />
      </div>

      <div className="form-field">
        <label htmlFor="expense-date">Data</label>
        <input
          id="expense-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="expense-wallet">Carteira (opcional)</label>
        <SelectField
          id="expense-wallet"
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

      <div className="form-field form-field-checkbox">
        <label htmlFor="expense-recurring">
          <input
            id="expense-recurring"
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          Despesa recorrente
        </label>
      </div>

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

export default ExpenseForm;