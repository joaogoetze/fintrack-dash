import { useState } from "react";

import type { Wallet } from "../../../types";

import { createWallet, updateWallet } from "../../../api/wallets";
import { createWalletSchema, updateWalletSchema } from "../../../types";
import { toastApiError } from "../../../utils/toast";

import "./WalletForm.css";

interface WalletFormProps {
  initial?: Wallet;
  onClose: () => void;
  onSaved: () => void;
}

function WalletForm({ initial, onClose, onSaved }: WalletFormProps) {
  const isEdit = Boolean(initial);

  const [name, setName] = useState(initial?.name || "");
  const [value, setValue] = useState(initial?.balance?.toString() || "");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearFieldError = (field: string) => {
    setFieldErrors(prev => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const balance = Number(value.replace(",", "."));
    const formData = { name: name.trim(), balance };

    const schema = isEdit ? updateWalletSchema : createWalletSchema;
    const result = schema.safeParse(formData);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const fieldErrorsMap: Record<string, string> = {};
      Object.entries(errors).forEach(([key, val]) => {
        if (val?.[0]) fieldErrorsMap[key] = val[0];
      });
      setFieldErrors(fieldErrorsMap);
      return;
    }

    setLoading(true);

    try {
      if (isEdit && initial) {
        await updateWallet(initial.id, result.data);
      } else {
        await createWallet(result.data);
      }

      onSaved();
      onClose();
    } catch (err) {
      toastApiError(err, "Erro ao salvar carteira");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="wallet-name">Nome</label>
        <input
          id="wallet-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearFieldError("name");
          }}
          placeholder="Ex: Banco"
          aria-invalid={!!fieldErrors.name}
          autoFocus
        />
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="wallet-value">Valor (R$)</label>
        <input
          id="wallet-value"
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => {
    const nextValue = e.target.value;

    if (/^-?\d*[,.]?\d{0,2}$/.test(nextValue)) {
      setValue(nextValue);
      clearFieldError("balance");
    }
  }}
          placeholder="0,00"
          aria-invalid={!!fieldErrors.balance}
        />
        {fieldErrors.balance && <span className="field-error">{fieldErrors.balance}</span>}
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
