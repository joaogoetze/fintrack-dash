import { useState } from "react";

import type { Category } from "../../../types";

import { createCategory, updateCategory } from "../../../api/categories";
import { createCategorySchema, updateCategorySchema } from "../../../types";
import { toastApiError } from "../../../utils/toast";
import CurrencyInput from "../../ui/CurrencyInput/CurrencyInput";

import "./CategoryForm.css";

interface CategoryFormProps {
  initial?: Category;
  onClose: () => void;
  onSaved: () => void;
}

function CategoryForm({ initial, onClose, onSaved }: CategoryFormProps) {
  const isEdit = Boolean(initial);

  const [name, setName] = useState(initial?.name || "");
  const [estimatedAmount, setEstimatedAmount] = useState(initial?.estimatedAmount ?? 0);
  const [marginPercent, setMarginPercent] = useState(
    initial?.marginPercent != null ? String(initial.marginPercent) : "0"
  );
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

    const parsedMargin = marginPercent.trim() === "" ? 0 : Number(marginPercent.replace(",", "."));
    const formData = {
      name: name.trim(),
      estimatedAmount: estimatedAmount > 0 ? estimatedAmount : null,
      marginPercent: estimatedAmount > 0 ? parsedMargin : 0,
    };

    const schema = isEdit ? updateCategorySchema : createCategorySchema;
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
        await updateCategory(initial.id, result.data);
      } else {
        await createCategory(result.data);
      }

      onSaved();
      onClose();
    } catch (err) {
      toastApiError(err, "Erro ao salvar categoria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="category-name" className="required">Nome</label>
        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearFieldError("name");
          }}
          placeholder="Ex: Alimentação, Transporte, Moradia..."
          aria-invalid={!!fieldErrors.name}
          aria-required="true"
          autoFocus
        />
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="category-estimated">Estimativa mensal</label>
        <CurrencyInput
          id="category-estimated"
          value={estimatedAmount}
          onChange={(value) => {
            setEstimatedAmount(value);
            clearFieldError("estimatedAmount");
          }}
          aria-invalid={!!fieldErrors.estimatedAmount}
        />
        <span className="field-hint">
          Reserva do mês para previsibilidade. Não é uma despesa e não altera carteiras.
        </span>
        {fieldErrors.estimatedAmount && (
          <span className="field-error">{fieldErrors.estimatedAmount}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="category-margin">Margem (%)</label>
        <input
          id="category-margin"
          type="number"
          min={0}
          max={100}
          step={0.01}
          value={marginPercent}
          onChange={(e) => {
            setMarginPercent(e.target.value);
            clearFieldError("marginPercent");
          }}
          aria-invalid={!!fieldErrors.marginPercent}
        />
        {fieldErrors.marginPercent && (
          <span className="field-error">{fieldErrors.marginPercent}</span>
        )}
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

export default CategoryForm;
