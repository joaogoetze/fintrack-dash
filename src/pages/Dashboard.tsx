import { useEffect, useState, useCallback } from "react";
import { getSumary, getDueExpenses } from "../api/dashboard";
import type { Summary } from "../types/Summary";
import type { Expense } from "../types/Expense";
import InfoCard from "../components/ui/InfoCard/InfoCard";
import DueExpenseItem from "../components/items/DueExpenseItem/DueExpenseItem";
import { useMonthStore } from "../stores/monthStore";

function Dashboard() {
    const activeMonth = useMonthStore((state) => state.activeMonth);
    const [sumary, setSumary] = useState<Summary | null>(null);
    const [dueExpenses, setDueExpenses] = useState<Expense[]>([]);

    const loadDueExpenses = useCallback(async () => {
        const data = await getDueExpenses(activeMonth);
        setDueExpenses(data);
    }, [activeMonth]);

    useEffect(() => {
        getSumary(activeMonth).then(setSumary);
        loadDueExpenses();
    }, [activeMonth, loadDueExpenses]);

    return (
        <div className="page-container">
            {sumary ? (
                <div className="dashboard-cards">
                    <InfoCard
                        label="Despesas"
                        value={sumary.total_expenses}
                    />
                    <InfoCard
                        label="Receitas"
                        value={sumary.total_income}
                    />
                    <InfoCard
                        label="Balanço"
                        value={sumary.balance}
                    />
                </div>
            ) : (
                "Sem visão geral"
            )}

            <div className="dashboard-dues">
                <h2 className="dashboard-section-title">Vencimentos do mês</h2>
                {dueExpenses.length > 0 ? (
                    dueExpenses.map(expense =>
                        <DueExpenseItem
                            key={expense.id}
                            expense={expense}
                            onUpdate={loadDueExpenses}
                        />
                    )
                ) : (
                    <div className="empty-state">Nenhum vencimento neste mês</div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;