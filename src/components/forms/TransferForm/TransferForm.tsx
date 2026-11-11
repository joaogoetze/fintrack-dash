import React, { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

import type { Wallet } from "../../../types";
import { createTransfer } from "../../../api/transfers";
import { createTransferSchema } from "../../../types";
import { formatCurrency, todayLocal } from "../../../utils/formatters";
import { toastApiError } from "../../../utils/toast";
import CurrencyInput from "../../ui/CurrencyInput/CurrencyInput";
import DateInput from "../../ui/DateInput/DateInput";
import SelectField from "../../ui/SelectField/SelectField";

import "./TransferForm.css";

interface TransferFormProps {
  wallets: Wallet[];
  onClose: () => void;
  onSaved: () => void;
}

export const TransferForm: React.FC<TransferFormProps> = ({
  wallets,
  onClose,
  onSaved,
}) => {
  const [sourceWalletId, setSourceWalletId] = useState<number>(wallets[0]?.id || 0);
  const [destinationWalletId, setDestinationWalletId] = useState<number>(
    wallets[1]?.id || wallets[0]?.id || 0
  );
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(todayLocal());
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSwapWallets = () => {
    const temp = sourceWalletId;
    setSourceWalletId(destinationWalletId);
    setDestinationWalletId(temp);
    clearFieldError("destinationWalletId");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const formData = {
      sourceWalletId,
      destinationWalletId,
      amount,
      date,
      description: description.trim() || null,
    };

    const result = createTransferSchema.safeParse(formData);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const fieldErrorsMap: Record<string, string> = {};
      Object.entries(errors).forEach(([key, val]) => {
        if (val?.[0]) fieldErrorsMap[key] = val[0];
      });
      setFieldErrors(fieldErrorsMap);
      return;
    }

    // Validação de saldo suficiente na carteira de origem
    const sourceWallet = wallets.find((w) => w.id === sourceWalletId);
    if (sourceWallet && amount > sourceWallet.balance) {
      setFieldErrors({ amount: `Saldo insuficiente. Disponível: ${formatCurrency(sourceWallet.balance)}` });
      return;
    }

    setLoading(true);

    try {
      await createTransfer(result.data);
      const sourceWallet = wallets.find((w) => w.id === sourceWalletId);
      const destWallet = wallets.find((w) => w.id === destinationWalletId);
      toast.success(
        `Transferência de ${formatCurrency(amount)} de "${sourceWallet?.name}" para "${destWallet?.name}" realizada!`
      );
      onSaved();
      onClose();
    } catch (err) {
      toastApiError(err, "Erro ao realizar transferência");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="transfer-wallets-row">
        <div className="transfer-wallet-col">
          <label htmlFor="source-wallet" className="required">
            De (Origem)
          </label>
          <SelectField
            id="source-wallet"
            value={sourceWalletId}
            onChange={(e) => {
              setSourceWalletId(Number(e.target.value));
              clearFieldError("sourceWalletId");
              clearFieldError("destinationWalletId");
            }}
          >
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({formatCurrency(w.balance)})
              </option>
            ))}
          </SelectField>
          {fieldErrors.sourceWalletId && (
            <span className="field-error">{fieldErrors.sourceWalletId}</span>
          )}
        </div>

        <button
          type="button"
          className="transfer-swap-btn"
          onClick={handleSwapWallets}
          title="Inverter carteiras"
        >
          <ArrowLeftRight size={16} />
        </button>

        <div className="transfer-wallet-col">
          <label htmlFor="destination-wallet" className="required">
            Para (Destino)
          </label>
          <SelectField
            id="destination-wallet"
            value={destinationWalletId}
            onChange={(e) => {
              setDestinationWalletId(Number(e.target.value));
              clearFieldError("destinationWalletId");
            }}
          >
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({formatCurrency(w.balance)})
              </option>
            ))}
          </SelectField>
        </div>
      </div>
      {fieldErrors.destinationWalletId && (
        <span className="field-error">{fieldErrors.destinationWalletId}</span>
      )}

      <div className="form-field">
        <label htmlFor="transfer-amount" className="required">
          Valor
        </label>
        <CurrencyInput
          id="transfer-amount"
          value={amount}
          onChange={(nextValue) => {
            setAmount(nextValue);
            clearFieldError("amount");
          }}
          aria-invalid={!!fieldErrors.amount}
          aria-required={true}
        />
        {fieldErrors.amount && (
          <span className="field-error">{fieldErrors.amount}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="transfer-date" className="required">
          Data
        </label>
        <DateInput
          id="transfer-date"
          value={date}
          onChange={(nextDate) => {
            setDate(nextDate);
            clearFieldError("date");
          }}
          aria-invalid={!!fieldErrors.date}
        />
        {fieldErrors.date && (
          <span className="field-error">{fieldErrors.date}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="transfer-description">Descrição (opcional)</label>
        <input
          id="transfer-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Guardar na caixinha, Reserva de emergência"
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-save"
          disabled={loading || amount <= 0}
        >
          {loading ? "Transferindo..." : "Transferir"}
        </button>
      </div>
    </form>
  );
};

export default TransferForm;

