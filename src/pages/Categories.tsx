import { useEffect, useState, useCallback } from "react";

import type { Category } from "../types";

import { getCategories } from "../api/categories";
import CategoryForm from "../components/forms/CategoryForm/CategoryForm";
import CategoryItem from "../components/items/CategoryItem/CategoryItem";
import DynamicModal from "../components/ui/DynamicModal/DynamicModal";
import PrimaryButton from "../components/ui/PrimaryButton/PrimaryButton";
import { toastApiError } from "../utils/toast";
import TotalCard from "../components/ui/TotalCard/TotalCard";
import { useAuthStore } from "../stores/authStore";

function Categories() {
    const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
    const [categories, setCategories] = useState<Category[]>([]);
    const [total, setTotal] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

    const loadCategories = useCallback(async () => {
        try {
            const { categories, total } = await getCategories();
            setCategories(categories);
            setTotal(total);
        } catch (err) {
            toastApiError(err, "Erro ao carregar categorias");
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories, activeWorkspaceId]);

    return (
        <div className="page-container">
            <div className="page-header with-total">
                <TotalCard label="Total de Categorias" value={total} isCurrency={false} />
                <PrimaryButton 
                    buttonText="+ Categoria" 
                    onClick={() => { setEditingCategory(undefined); setIsModalOpen(true); }} 
                />
            </div>
            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? "Editar Categoria" : "Adicionar Categoria"}
            >
                <CategoryForm
                    initial={editingCategory}
                    onClose={() => setIsModalOpen(false)}
                    onSaved={loadCategories}
                />
            </DynamicModal>

            {categories.length > 0 ? (
                categories.map(category =>
                    <CategoryItem
                        key={category.id}
                        category={category}
                        onUpdate={loadCategories}
                        onEdit={(c) => { setEditingCategory(c); setIsModalOpen(true); }}
                    />
                )
            ) : (
                <div className="empty-state">Nenhuma categoria cadastrada</div>
            )}
        </div>
    );
}

export default Categories;
