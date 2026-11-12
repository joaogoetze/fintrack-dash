import { useEffect, useState } from "react";

import type { CreateRecurringTransactionInput, RecurringTransaction } from "../../../types";

import { getCategories } from "../../../api/categories";
import { createRecurringTransaction, updateRecurringTransaction } from "../../../api/recurringTransactions";
import {
  createRecurringTransactionSchema,
  updateRecurringTransactionSchema,
} from "../../../types";
import { toDateInputValue, todayLocal } from "../../../utils/formatters";
import { toastApiError } from "../../../utils/toast";
import CurrencyInput from "../../ui/CurrencyInput/CurrencyInput";
import DateInput from "../../ui/DateInput/DateInput";
import SelectField from "../../ui/SelectField/SelectField";

interface RecurringTransactionFormProps {
  initial?: RecurringTransaction;
  onClose: () => void;
  onSaved: () => void;
}

function RecurringTransactionForm({ initial, onClose, onSaved }: RecurringTransactionFormProps) {
  const isEdit = Boolean(initial);

  const [type, setType] = useState<"income" | "expense">(initial?.type || "expense");
  const [name, setName] = useState(initial?.name || "");
  const [amount, setAmount] = useState(initial?.amount ?? 0);
  const [startDate, setStartDate] = useState(
    initial?.startDate ? toDateInputValue(initial.startDate) : todayLocal()
  );
  const [dueDate, setDueDate] = useState(
    initial?.dueDate ? toDateInputValue(initial.dueDate) : todayLocal()
  );
  const [categoryId, setCategoryId] = useState<number | "">(initial?.categoryId || "");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { categories } = await getCategories();
        setCategories(categories);
      } catch (err) {
        toastApiError(err, "Erro ao carregar categorias");
      }
    };
    loadCategories();
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

    const formData = {
      type,
      name: name.trim(),
      amount,
      startDate: startDate || null,
      dueDate: dueDate || null,
      categoryId: type === "expense" && categoryId !== "" ? categoryId : null,
    };

    const schema = isEdit ? updateRecurringTransactionSchema : createRecurringTransactionSchema;
    const payload = isEdit
      ? {
          name: formData.name,
          amount: formData.amount,
          startDate: formData.startDate,
          dueDate: formData.dueDate,
          categoryId: formData.categoryId,
        }
      : formData;

    const result = schema.safeParse(payload);

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
        await updateRecurringTransaction(initial.id, result.data);
      } else {
        await createRecurringTransaction(result.data as CreateRecurringTransactionInput);
      }
      onSaved();
      onClose();
    } catch (err) {
      toastApiError(err, "Erro ao salvar recorrente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {!isEdit && (
        <div className="form-field">
          <label htmlFor="recurring-type" className="required">Tipo</label>
          <SelectField
            id="recurring-type"
            value={type}
            onChange={(e) => {
              const next = e.target.value as "income" | "expense";
              setType(next);
              if (next === "income") setCategoryId("");
              clearFieldError("type");
            }}
            aria-required
          >
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </SelectField>
          {fieldErrors.type && <span className="field-error">{fieldErrors.type}</span>}
        </div>
      )}

      <div className="form-field">
        <label htmlFor="recurring-name" className="required">Nome</label>
        <input
          id="recurring-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearFieldError("name");
          }}
          placeholder={type === "income" ? "Ex: Salário" : "Ex: Aluguel"}
          aria-invalid={!!fieldErrors.name}
          aria-required="true"
          autoFocus
        />
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="recurring-amount" className="required">Valor</label>
        <CurrencyInput
          id="recurring-amount"
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
        <label htmlFor="recurring-start" className="required">Data de início</label>
        <DateInput
          id="recurring-start"
          value={startDate}
          onChange={(value) => {
            setStartDate(value);
            clearFieldError("startDate");
          }}
          aria-invalid={!!fieldErrors.startDate}
        />
        {fieldErrors.startDate && <span className="field-error">{fieldErrors.startDate}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="recurring-due" className="required">Data de vencimento</label>
        <DateInput
          id="recurring-due"
          value={dueDate}
          onChange={(value) => {
            setDueDate(value);
            clearFieldError("dueDate");
          }}
          aria-invalid={!!fieldErrors.dueDate}
        />
        {fieldErrors.dueDate && <span className="field-error">{fieldErrors.dueDate}</span>}
      </div>

      {type === "expense" && (
        <div className="form-field">
          <label htmlFor="recurring-category">Categoria</label>
          <SelectField
            id="recurring-category"
            value={categoryId}
            onChange={(e) => {
              const value = e.target.value === "" ? "" : Number(e.target.value);
              setCategoryId(value);
              clearFieldError("categoryId");
            }}
          >
            <option value="">Selecione uma categoria (opcional)</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </SelectField>
          {fieldErrors.categoryId && <span className="field-error">{fieldErrors.categoryId}</span>}
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

export default RecurringTransactionForm;
