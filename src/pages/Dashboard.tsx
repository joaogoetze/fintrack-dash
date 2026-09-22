import { useEffect, useState, useCallback } from "react";

import type { Summary, DueTransaction } from "../types";

import { getSummary, getDueTransactions } from "../api/dashboard";
import DueTransactionItem from "../components/items/DueTransactionItem/DueTransactionItem";
import InfoCard from "../components/ui/InfoCard/InfoCard";
import { useMonthStore } from "../stores/monthStore";

function Dashboard() {
    const activeMonth = useMonthStore((state) => state.activeMonth);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [dueTransactions, setDueTransactions] = useState<DueTransaction[]>([]);

    const loadDueTransactions = useCallback(async () => {
        const data = await getDueTransactions(activeMonth);
        setDueTransactions(data);
    }, [activeMonth]);

    useEffect(() => {
        getSummary(activeMonth).then(setSummary);
        loadDueTransactions();
    }, [activeMonth, loadDueTransactions]);

    return (
        <div className="page-container">
            {summary ? (
                <div className="dashboard-cards">
                    <InfoCard
                        label="Receitas"
                        value={summary.totalIncome}
                    />
                    <InfoCard
                        label="Despesas"
                        value={summary.totalExpenses}
                    />
                    <InfoCard
                        label="Balanço"
                        value={summary.balance}
                    />
                </div>
            ) : (
                "Sem visão geral"
            )}

            <div className="dashboard-dues">
                <h2 className="dashboard-section-title">Vencimentos do mês</h2>
                {dueTransactions.length > 0 ? (
                    dueTransactions.map(transaction =>
                        <DueTransactionItem
                            key={`${transaction.type}-${transaction.id}`}
                            transaction={transaction}
                            onUpdate={loadDueTransactions}
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