import { useState, useEffect } from "react";
import { z } from "zod";

import type { Expense, CreateExpenseInput, UpdateExpenseInput } from "../../../types";

import { createExpense, updateExpense } from "../../../api/expenses";
import { getWallets } from "../../../api/wallets";
import { createExpenseRequest, updateExpenseSchema } from "../../../types";
import { toDateInputValue, todayLocal } from "../../../utils/formatters";
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
  const [amount, setAmount] = useState(initial?.amount?.toString() || "");
  const [date, setDate] = useState(initial?.date ? toDateInputValue(initial.date) : todayLocal());
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

  const paid = initial?.paid || true;
  const id = initial?.id || null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  const validateField = (field: string, value: unknown) => {
    const schema = isEdit ? updateExpenseSchema : createExpenseRequest;
    const shape = schema.shape as Record<string, z.ZodTypeAny>;
    const result = shape[field]?.safeParse(value);
    if (result && !result.success) {
      const firstIssue = result.error.issues?.[0];
      setFieldErrors(prev => ({ ...prev, [field]: firstIssue?.message || "Erro" }));
    } else {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const amountValue = Number(amount.replace(",", "."));
    const formData = {
      id,
      name: name.trim(),
      amount: amountValue,
      date,
      dueDate,
      walletId: walletId || undefined,
      updateRecurringTransaction: updateRec,
      recurringTransactionId: recurring_transaction_id,
      isRecurring,
      paid
    };

    const schema = isEdit ? updateExpenseSchema : createExpenseRequest;
    const result = schema.safeParse(formData);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      
      const firstError = Object.values(errors)[0]?.[0] || "Erro de validação";
      setError(firstError);
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
          onChange={(e) => {
            setName(e.target.value);
            validateField("name", e.target.value.trim());
          }}
          placeholder="Ex: Aluguel"
          aria-invalid={!!fieldErrors.name}
        />
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="expense-value">Valor (R$)</label>
        <input
          id="expense-value"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*[,.]?\d*$/.test(value)) {
              setAmount(value);
              validateField("amount", Number(value.replace(",", ".")));
            }
          }}
          placeholder="0,00"
          aria-invalid={!!fieldErrors.amount}
        />
        {fieldErrors.amount && <span className="field-error">{fieldErrors.amount}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="expense-date">Data do pagamento</label>
        <input
          id="expense-date"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            validateField("date", e.target.value);
          }}
          aria-invalid={!!fieldErrors.date}
        />
        {fieldErrors.date && <span className="field-error">{fieldErrors.date}</span>}
      </div>

      {isRecurring && (
      <div className="form-field">
        <label htmlFor="expense-due-date">Data de vencimento</label>
        <input
          id="expense-due-date"
          type="date"
          value={dueDate ?? ""}
          onChange={(e) => {
            setDueDate(e.target.value);
            validateField("dueDate", e.target.value || null);
          }}
          aria-invalid={!!fieldErrors.dueDate}
        />
        {fieldErrors.dueDate && <span className="field-error">{fieldErrors.dueDate}</span>}
      </div>
      )}

      <div className="form-field">
        <label htmlFor="expense-wallet">Carteira (opcional)</label>
        <SelectField
          id="expense-wallet"
          value={walletId}
          onChange={(e) => {
            const value = e.target.value === "" ? "" : Number(e.target.value);
            setWalletId(value);
            validateField("walletId", value || null);
          }}
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
                  setDueDate(toDateInputValue(todayLocal()));
                } else {
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