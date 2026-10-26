import { useState, useEffect } from "react";

import type { Income, CreateIncomeInput, UpdateIncomeInput } from "../../../types";

import { createIncome, updateIncome } from "../../../api/incomes";
import { getWallets } from "../../../api/wallets";
import { createIncomeRequest, updateIncomeSchema } from "../../../types";
import { toDateInputValue, todayLocal } from "../../../utils/formatters";
import { toastApiError } from "../../../utils/toast";
import CurrencyInput from "../../ui/CurrencyInput/CurrencyInput";
import DateInput from "../../ui/DateInput/DateInput";
import SelectField from "../../ui/SelectField/SelectField";

import "./IncomeForm.css";

interface IncomeFormProps {
  initial?: Income;
  onClose: () => void;
  onSaved: () => void;
}

function IncomeForm({ initial, onClose, onSaved }: IncomeFormProps) {
  const isEdit = Boolean(initial);
  const recurring_transaction_id = initial?.recurringTransactionId ?? null

  const [name, setName] = useState(initial?.name || "");
  const [updateRec, setUpdateRec] = useState(false);
  const [amount, setAmount] = useState(initial?.amount ?? 0);
  const [date, setDate] = useState(initial?.date ? toDateInputValue(initial.date) : "");
  const [paid, setPaid] = useState(initial?.paid ?? false);
  const [dueDate, setDueDate] = useState<string | null>(
    initial?.dueDate
      ? toDateInputValue(initial.dueDate)
      : null
  );
  const [isRecurring, setIsRecurring] = useState(
    Boolean(initial?.recurringTransactionId)
  );
  const isRecurringCreation = !isEdit && isRecurring;
  const id = initial?.id || null;
  const [walletId, setWalletId] = useState<number | "">(initial?.walletId || "");
  const [wallets, setWallets] = useState<{ id: number; name: string; balance: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const { wallets } = await getWallets();
        setWallets(wallets);
      } catch (err) {
        toastApiError(err, "Erro ao carregar carteiras");
      }
    };
    loadWallets();
  }, []);

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

    if (!isRecurringCreation && (date || paid) && !walletId) {
      setFieldErrors({ walletId: "Carteira é obrigatória para receitas marcadas como recebidas" });
      return;
    }

    const formData = {
      id,
      name: name.trim(),
      amount,
      date: date ? date : null,
      dueDate,
      walletId: walletId === "" ? null : walletId,
      updateRecurringTransaction: updateRec,
      recurringTransactionId: recurring_transaction_id,
      isRecurring,
      paid: isRecurringCreation ? false : Boolean(date) || paid
    };

    const schema = isEdit ? updateIncomeSchema : createIncomeRequest;
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
        await updateIncome(initial.id, result.data as UpdateIncomeInput);
      } else {
        await createIncome(result.data as CreateIncomeInput);
      }

      onSaved();
      onClose();
    } catch (err) {
      toastApiError(err, "Erro ao salvar receita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="income-name" className="required">Nome</label>
        <input
          id="income-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearFieldError("name");
          }}
          placeholder="Ex: Salário"
          aria-invalid={!!fieldErrors.name}
          aria-required="true"
          autoFocus
        />
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="income-value" className="required">Valor</label>
        <CurrencyInput
          id="income-value"
          value={amount}
          onChange={(value) => {
            setAmount(value);
            clearFieldError("amount");
          }}
          aria-invalid={!!fieldErrors.amount}
          aria-required
        />
        {fieldErrors.amount && <span className="field-error">{fieldErrors.amount}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="income-date">
          {isRecurringCreation ? "Data de início" : "Data do recebimento"}
        </label>
        <DateInput
          id="income-date"
          value={date}
          onChange={(value) => {
            setDate(value);
            setPaid(Boolean(value));
            clearFieldError("date");
            clearFieldError("walletId");
          }}
          aria-invalid={!!fieldErrors.date}
        />
        {fieldErrors.date && <span className="field-error">{fieldErrors.date}</span>}
      </div>

      {isRecurring && (
      <div className="form-field">
        <label htmlFor="income-due-date">Data de vencimento</label>
        <DateInput
          id="income-due-date"
          value={dueDate ?? ""}
          onChange={(value) => {
            setDueDate(value || null);
            clearFieldError("dueDate");
          }}
          aria-invalid={!!fieldErrors.dueDate}
        />
        {fieldErrors.dueDate && <span className="field-error">{fieldErrors.dueDate}</span>}
      </div>
      )}

      <div className="form-field">
        <label
          htmlFor="income-wallet"
          className={!isRecurringCreation && (date || paid) ? "required" : undefined}
        >
          Carteira
        </label>
        <SelectField
          id="income-wallet"
          value={walletId}
          onChange={(e) => {
            const value = e.target.value === "" ? "" : Number(e.target.value);
            setWalletId(value);
            clearFieldError("walletId");
          }}
          aria-required={!isRecurringCreation && (date || paid)}
        >
          <option value="">Selecione uma carteira</option>
          {wallets.map(wallet => (
            <option key={wallet.id} value={wallet.id}>
              {wallet.name}
            </option>
          ))}
        </SelectField>
        {fieldErrors.walletId && <span className="field-error">{fieldErrors.walletId}</span>}
      </div>

      {!isRecurringCreation && (
        <div className="form-field form-field-checkbox">
          <label htmlFor="income-paid">
            <input
              id="income-paid"
              type="checkbox"
              checked={Boolean(date) || paid}
              onChange={(e) => {
                const checked = e.target.checked;
                setPaid(checked);
                if (!checked) setDate("");
                clearFieldError("walletId");
              }}
            />
            Recebido
          </label>
        </div>
      )}

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
                  setPaid(false);
                  setDueDate(toDateInputValue(todayLocal()));
                } else {
                  setPaid(Boolean(date));
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
          <label htmlFor="income-recurring-edit">
            <input
              id="income-recurring-edit"
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