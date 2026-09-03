import { useEffect, useState, useCallback } from "react";
import { getExpenses } from "../api/expenses";
import PrimaryButton from "../components/ui/PrimaryButton/PrimaryButton";
import TotalCard from "../components/ui/TotalCard/TotalCard";
import DynamicModal from "../components/ui/DynamicModal/DynamicModal";
import ExpenseForm from "../components/forms/ExpenseForm/ExpenseForm";
import type { Expense } from "../types/Expense";
import ExpenseItem from "../components/items/ExpenseItem/ExpenseItem";
import { useMonthStore } from "../stores/monthStore";

function Expenses() {
  const activeMonth = useMonthStore((state) => state.activeMonth);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  const loadExpenses = useCallback(async () => {
    const data = await getExpenses(activeMonth);
    setExpenses(data.expenses);
    setTotal(data.total);
  }, [activeMonth]);

  useEffect(() => {
    getExpenses(activeMonth).then((data) => {
      setExpenses(data.expenses);
      setTotal(data.total);
    });
  }, [activeMonth]);

  return (
    <div className="page-container">
      <div className="page-header with-total">
        <TotalCard label="Total" value={total} />
        <PrimaryButton buttonText="+ Despesa" onClick={() => { setEditingExpense(undefined); setIsModalOpen(true); }} />
      </div>
      <DynamicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? "Editar Despesa" : "Adicionar Despesa"}
      >
        <ExpenseForm
          initial={editingExpense}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadExpenses}
        />
      </DynamicModal>


      {expenses.length > 0 ? (
        <div className="items-list-container">
          <div className="items-list-header">
            <div className="header-cell header-name-cell">Nome</div>
            <div className="header-cell">Valor</div>
            <div className="header-cell">Data</div>
            <div className="header-cell">Vencimento</div>
            <div className="header-cell">Carteira</div>
            <div className="header-cell header-actions-cell">Ações</div>
          </div>
          {expenses.map(expense =>
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onUpdate={loadExpenses}
              onEdit={(e) => { setEditingExpense(e); setIsModalOpen(true); }}
            />
          )}
        </div>
      ) : (
        <div className="empty-state">Nenhuma despesa</div>
      )}

    </div>
  );
}

export default Expenses;
