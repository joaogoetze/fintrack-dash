import { useState } from "react";
import "./WalletForm.css";
import { createWallet, updateWallet } from "../../../api/wallets";
import type { Wallet } from "../../../types/Wallet";

interface WalletFormProps {
  initial?: Wallet;
  onClose: () => void;
  onSaved: () => void;
}

function WalletForm({ initial, onClose, onSaved }: WalletFormProps) {
  const isEdit = Boolean(initial);

  const [name, setName] = useState(initial?.name || "");
  const [value, setValue] = useState(initial?.balance || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {

      const balance = Number(value.replace(",", "."));

      if (isEdit && initial) {
        await updateWallet(initial.id, { name, balance });
      } else {
        await createWallet({ name, balance });
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

      <div className="form-field">
        <label htmlFor="wallet-value">Valor (R$)</label>
        <input
          id="wallet-value"
          type="text"
          //step="0.01"
          //min="0"
          inputMode="decimal"
          value={value}
          onChange={(e) => {
    const value = e.target.value;

    if (/^-?\d*[,.]?\d{0,2}$/.test(value)) {
      setValue(value);
    }
  }}
          placeholder="0,00"
        />
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

export default WalletForm;