import { useState, useEffect } from "react";

import type { Income, CreateIncomeInput, UpdateIncomeInput } from "../../../types";

import { createIncome, updateIncome } from "../../../api/incomes";
import { getWallets } from "../../../api/wallets";
import { createIncomeRequest, updateIncomeSchema } from "../../../types";
import { toDateInputValue, todayLocal } from "../../../utils/formatters";
import { toastApiError } from "../../../utils/toast";
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
  const [amount, setAmount] = useState(initial?.amount?.toString() || "");
  const [date, setDate] = useState(initial?.date ? toDateInputValue(initial.date) : "");
  const [dueDate, setDueDate] = useState<string | null>(
    initial?.dueDate
      ? toDateInputValue(initial.dueDate)
      : null
  );
  const [isRecurring, setIsRecurring] = useState(
    Boolean(initial?.recurringTransactionId)
  );
  const id = initial?.id || null;
  const [walletId, setWalletId] = useState<number | "">(initial?.walletId || "");
  const [wallets, setWallets] = useState<{ id: number; name: string; balance: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const data = await getWallets();
        setWallets(data);
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

    const amountValue = Number(amount.replace(",", "."));
    const formData = {
      id,
      name: name.trim(),
      amount: amountValue,
      date: date ? date : null,
      dueDate,
      walletId: walletId || undefined,
      updateRecurringTransaction: updateRec,
      recurringTransactionId: recurring_transaction_id,
      isRecurring,
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
        <label htmlFor="income-name">Nome</label>
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
          autoFocus
        />
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="income-value">Valor (R$)</label>
        <input
          id="income-value"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*[,.]?\d*$/.test(value)) {
              setAmount(value);
              clearFieldError("amount");
            }
          }}
          placeholder="0,00"
          aria-invalid={!!fieldErrors.amount}
        />
        {fieldErrors.amount && <span className="field-error">{fieldErrors.amount}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="income-date">Data do recebimento</label>
        <input
          id="income-date"
          type={date ? "date" : "text"}
          placeholder="Nenhuma data selecionada"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => {
            if (!e.target.value) e.target.type = "text";
          }}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            clearFieldError("date");
          }}
          aria-invalid={!!fieldErrors.date}
        />
        {fieldErrors.date && <span className="field-error">{fieldErrors.date}</span>}
      </div>

      {isRecurring && (
      <div className="form-field">
        <label htmlFor="income-due-date">Data de vencimento</label>
        <input
          id="income-due-date"
          type={dueDate ? "date" : "text"}
          placeholder="Nenhuma data selecionada"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => {
            if (!e.target.value) e.target.type = "text";
          }}
          value={dueDate ?? ""}
          onChange={(e) => {
            setDueDate(e.target.value);
            clearFieldError("dueDate");
          }}
          aria-invalid={!!fieldErrors.dueDate}
        />
        {fieldErrors.dueDate && <span className="field-error">{fieldErrors.dueDate}</span>}
      </div>
      )}

      <div className="form-field">
        <label htmlFor="income-wallet">Carteira (opcional)</label>
        <SelectField
          id="income-wallet"
          value={walletId}
          onChange={(e) => {
            const value = e.target.value === "" ? "" : Number(e.target.value);
            setWalletId(value);
            clearFieldError("walletId");
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
          <label htmlFor="income-recurring">
            <input
              id="income-recurring"
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