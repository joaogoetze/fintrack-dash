import { useState } from "react";
import "./WalletForm.css";
import { createWallet } from "../../../api/wallets";

interface WalletFormProps {
  onClose: () => void;
  onSaved: () => void;
}

function WalletForm({ onClose, onSaved }: WalletFormProps) {
  const [name, setName] = useState("");
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    await createWallet({ name, value });

    onSaved();
    onClose();
    setLoading(false);
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
          placeholder="Ex: Banco"
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
          onChange={(e) => setValue(Number(e.target.value))}
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
