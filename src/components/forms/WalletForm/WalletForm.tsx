import { useState } from "react";
import "./WalletForm.css";
import { createWallet, updateWalletName } from "../../../api/wallets";
import type { Wallet } from "../../../types/Wallet";

interface WalletFormProps {
  initial?: Wallet;
  onClose: () => void;
  onSaved: () => void;
}

function WalletForm({ initial, onClose, onSaved }: WalletFormProps) {
  const isEdit = Boolean(initial);

  const [name, setName] = useState(initial?.name || "");
  const [value, setValue] = useState(initial ? initial.balance : 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (isEdit && initial) {
        await updateWalletName(initial.id, name);
      } else {
        await createWallet({ name, value });
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
        <label htmlFor="wallet-name">Nome</label>
        <input
          id="wallet-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Banco"
        />
      </div>

      {!isEdit && (
        <div className="form-field">
          <label htmlFor="wallet-value">Valor (R$)</label>
          <input
            id="wallet-value"
            type="number"
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            placeholder="0,00"
          />
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

export default WalletForm;