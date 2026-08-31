import { useCallback, useEffect, useState } from "react";
import PrimaryButton from "../components/ui/PrimaryButton/PrimaryButton";
import type { Income } from "../types/Income";
import { getIncomes } from "../api/incomes";
import DynamicModal from "../components/ui/DynamicModal/DynamicModal";
import IncomeForm from "../components/forms/IncomeForm/IncomeForm";
import IncomeItem from "../components/items/IncomeItem/IncomeItem";
import { useMonthStore } from "../stores/monthStore";

function Incomes() {
    const activeMonth = useMonthStore((state) => state.activeMonth);
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIncome, setEditingIncome] = useState<Income | undefined>(undefined);

    const loadIncomes = useCallback(async () => {
        const data = await getIncomes(activeMonth);
        setIncomes(data);
    }, [activeMonth]);

    useEffect(() => {
        getIncomes(activeMonth).then(setIncomes);
    }, [activeMonth]);

    return (
        <div className="page-container">
            <div className="page-header">
                <PrimaryButton buttonText="+ Receita" onClick={() => { setEditingIncome(undefined); setIsModalOpen(true); }} />
            </div>
            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingIncome ? "Editar Receita" : "Adicionar Receita"}
            >
                <IncomeForm
                    initial={editingIncome}
                    onClose={() => setIsModalOpen(false)}
                    onSaved={loadIncomes}
                />
            </DynamicModal>

            {incomes.length > 0 ? (
                incomes.map(income =>
                    <IncomeItem
                        key={income.id}
                        income={income}
                        onUpdate={loadIncomes}
                        onEdit={(i) => { setEditingIncome(i); setIsModalOpen(true); }}
                    />
                )
            ) : (
                <div className="empty-state">Nenhuma receita</div>
            )}

        </div>
    );
}

export default Incomes;