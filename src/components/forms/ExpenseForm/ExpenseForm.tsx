import { useState, useEffect } from "react";

import type { Expense, CreateExpenseInput, UpdateExpenseInput } from "../../../types";

import { createExpense, updateExpense } from "../../../api/expenses";
import { getWallets } from "../../../api/wallets";
import { createExpenseRequest, updateExpenseSchema } from "../../../types";
import { toDateInputValue, todayLocal } from "../../../utils/formatters";
import { toastApiError } from "../../../utils/toast";
import CurrencyInput from "../../ui/CurrencyInput/CurrencyInput";
import DateInput from "../../ui/DateInput/DateInput";
import SelectField from "../../ui/SelectField/SelectField";

import "./ExpenseForm.css";

interface ExpenseFormProps {
  initial?: Expense;
  onClose: () => void;
  onSaved: () => void;
}

function ExpenseForm({ initial, onClose, onSaved }: ExpenseFormProps) {
  const isEdit = Boolean(initial);
  const recurring_transaction_id = initial?.recurringTransactionId ?? null

  const [name, setName] = useState(initial?.name || "");
  const [amount, setAmount] = useState(initial?.amount ?? 0);
  const [date, setDate] = useState(initial?.date ? toDateInputValue(initial.date) : "");
  const [paid, setPaid] = useState(initial?.paid ?? false);
  const [isRecurring, setIsRecurring] = useState(
    Boolean(initial?.recurringTransactionId)
  );
  const [updateRec, setUpdateRec] = useState(false);
  const [walletId, setWalletId] = useState<number | "">(initial?.walletId || "");
  const [wallets, setWallets] = useState<{ id: number; name: string; balance: number }[]>([]);
  const [dueDate, setDueDate] = useState<string | null>(
    initial?.dueDate
      ? toDateInputValue(initial.dueDate)
      : null
  );

  const isRecurringCreation = !isEdit && isRecurring;
  const id = initial?.id || null;
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
      setFieldErrors({ walletId: "Carteira é obrigatória para despesas pagas" });
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

    const schema = isEdit ? updateExpenseSchema : createExpenseRequest;
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
        await updateExpense(initial.id, result.data as UpdateExpenseInput);
      } else {
        await createExpense(result.data as CreateExpenseInput);
      }

      onSaved();
      onClose();
    } catch (err) {
      toastApiError(err, "Erro ao salvar despesa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="expense-name" className="required">Nome</label>
        <input
          id="expense-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearFieldError("name");
          }}
          placeholder="Ex: Aluguel"
          aria-invalid={!!fieldErrors.name}
          aria-required="true"
          autoFocus
        />
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="expense-value" className="required">Valor</label>
        <CurrencyInput
          id="expense-value"
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
        <label htmlFor="expense-date">
          {isRecurringCreation ? "Data de início" : "Data do pagamento"}
        </label>
        <DateInput
          id="expense-date"
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
        <label htmlFor="expense-due-date">Data de vencimento</label>
        <DateInput
          id="expense-due-date"
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
          htmlFor="expense-wallet"
          className={!isRecurringCreation && (date || paid) ? "required" : undefined}
        >
          Carteira
        </label>
        <SelectField
          id="expense-wallet"
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
          <label htmlFor="expense-paid">
            <input
              id="expense-paid"
              type="checkbox"
              checked={Boolean(date) || paid}
              onChange={(e) => {
                const checked = e.target.checked;
                setPaid(checked);
                if (!checked) setDate("");
                clearFieldError("walletId");
              }}
            />
            Pago
          </label>
        </div>
      )}

      {!isEdit && (
        <div className="form-field form-field-checkbox">
          <label htmlFor="expense-recurring">
            <input
              id="expense-recurring"
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
            Despesa recorrente
          </label>
        </div>
      )}

      {(isEdit && isRecurring) && (
        <div className="form-field form-field-checkbox">
          <label htmlFor="expense-recurring-edit">
            <input
              id="expense-recurring-edit"
              type="checkbox"
              checked={updateRec}
              onChange={(e) => setUpdateRec(e.target.checked)}
            />
            Editar essa e as próximas despesas
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

export default ExpenseForm;