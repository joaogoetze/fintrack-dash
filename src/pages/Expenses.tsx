import { useEffect, useState, useCallback } from "react";
import { getExpenses } from "../api/expenses";
import PrimaryButton from "../components/ui/PrimaryButton/PrimaryButton";
import DynamicModal from "../components/ui/DynamicModal/DynamicModal";
import ExpenseForm from "../components/forms/ExpenseForm/ExpenseForm";
import type { Expense } from "../types/Expense";
import ExpenseItem from "../components/items/ExpenseItem/ExpenseItem";
import { useMonthStore } from "../stores/monthStore";

function Expenses() {
  const activeMonth = useMonthStore((state) => state.activeMonth);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadExpenses = useCallback(async () => {
    const data = await getExpenses(activeMonth);
    setExpenses(data);
  }, []);

  useEffect(() => {
    getExpenses(activeMonth).then(setExpenses);
  }, [activeMonth]);

  return (
    <div className="page-container">
      <div className="page-header">
        <PrimaryButton buttonText="+ Despesa" onClick={() => setIsModalOpen(true)} />
      </div>
      <DynamicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adicionar Despesa"
      >
        <ExpenseForm
          onClose={() => setIsModalOpen(false)}
          onSaved={loadExpenses}
        />
      </DynamicModal>

      {expenses.length > 0 ? (
        expenses.map(expense =>
          <ExpenseItem key={expense.id} expense={expense} onUpdate={loadExpenses} />
        )
      ) : (
        <div className="empty-state">Nenhuma despesa</div>
      )}

    </div>
  );
}

export default Expenses;
