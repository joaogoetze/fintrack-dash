import { Tag, Trash2, Pencil } from "lucide-react";
import { useState } from "react";

import type { Category } from "../../../types";

import { deleteCategory } from "../../../api/categories";
import { toastApiError } from "../../../utils/toast";
import ConfirmDialog from "../../ui/ConfirmDialog/ConfirmDialog";

import "./CategoryItem.css";

interface CategoryItemProps {
  category: Category;
  onUpdate?: () => void;
  onEdit?: (category: Category) => void;
}

function CategoryItem({ category, onUpdate, onEdit }: CategoryItemProps) {
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

  return (
    <>
      <div className="category-card">
        <div className="category-card-name-wrapper">
          <div className="category-icon">
            <Tag size={20} />
          </div>
          <span className="category-card-name">{category.name}</span>
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
