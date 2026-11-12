import { Tag, Trash2, Pencil } from "lucide-react";
import { useState } from "react";

import type { Category, CategoryEstimate } from "../../../types";

import { deleteCategory } from "../../../api/categories";
import { formatCurrency } from "../../../utils/formatters";
import { toastApiError } from "../../../utils/toast";
import ConfirmDialog from "../../ui/ConfirmDialog/ConfirmDialog";

import "./CategoryItem.css";

interface CategoryItemProps {
  category: Category;
  estimate?: CategoryEstimate;
  onUpdate?: () => void;
  onEdit?: (category: Category) => void;
}

function CategoryItem({ category, estimate, onUpdate, onEdit }: CategoryItemProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteCategory(category.id);
      setIsDeleteModalOpen(false);
      onUpdate?.();
    } catch (err) {
      toastApiError(err, "Erro ao excluir categoria");
    }
  };

  const hasEstimate = Boolean(category.estimatedAmount && category.estimatedAmount > 0);
  const cap = estimate?.cap
    ?? (hasEstimate
      ? Number(category.estimatedAmount) * (1 + Number(category.marginPercent || 0) / 100)
      : 0);
  const spent = estimate?.spent ?? 0;
  const remaining = estimate?.remaining ?? Math.max(0, cap - spent);
  const overspent = spent > cap && cap > 0;
  const progressPercent = cap > 0
    ? Math.min(100, Math.round((spent / cap) * 100))
    : 0;

  return (
    <>
      <div className="category-card">
        <div className="category-card-main">
          <div className="category-card-name-wrapper">
            <div className="category-icon">
              <Tag size={20} />
            </div>
            <span className="category-card-name">{category.name}</span>
          </div>
          {hasEstimate && (
            <div className="category-estimate">
              <div className="category-estimate-meta">
                <span>Teto {formatCurrency(cap)}</span>
                <span className={overspent ? "category-estimate-over" : ""}>
                  {formatCurrency(spent)} de {formatCurrency(cap)}
                </span>
                <span>Restante {formatCurrency(remaining)}</span>
              </div>
              <div className="category-estimate-bar">
                <div
                  className={`category-estimate-fill ${overspent ? "over" : ""}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="item-actions">
          <button
            type="button"
            className="item-edit-btn"
            onClick={() => onEdit?.(category)}
            title="Editar"
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            className="item-delete-btn"
            onClick={() => setIsDeleteModalOpen(true)}
            title="Excluir"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Excluir categoria"
        message={`Deseja excluir a categoria "${category.name}"?`}
        confirmText="Excluir"
        onConfirm={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}

export default CategoryItem;
