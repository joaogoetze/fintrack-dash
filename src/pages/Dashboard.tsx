import { useEffect, useState, useCallback } from "react";

import type { Summary, DueTransaction } from "../types";

import { getSummary, getDueTransactions } from "../api/dashboard";
import DueTransactionItem from "../components/items/DueTransactionItem/DueTransactionItem";
import InfoCard from "../components/ui/InfoCard/InfoCard";
import { useMonthStore } from "../stores/monthStore";
import { useAuthStore } from "../stores/authStore";
import { toastApiError } from "../utils/toast";

function Dashboard() {
    const activeMonth = useMonthStore((state) => state.activeMonth);
    const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [dueTransactions, setDueTransactions] = useState<DueTransaction[]>([]);

    const loadDueTransactions = useCallback(async () => {
        try {
            const data = await getDueTransactions(activeMonth);
            const dataSummary = await getSummary(activeMonth);
            setDueTransactions(data);
            setSummary(dataSummary)
        } catch (err) {
            toastApiError(err, "Erro ao carregar vencimentos");
        }
    }, [activeMonth]);

    useEffect(() => {
        const loadSummary = async () => {
            try {
                const data = await getSummary(activeMonth);
                setSummary(data);
            } catch (err) {
                toastApiError(err, "Erro ao carregar resumo");
            }
        };
        loadSummary();
        loadDueTransactions();
    }, [activeMonth, activeWorkspaceId, loadDueTransactions]);


    return (
        <div className="page-container">
            {summary ? (
                <div className="dashboard-cards">
                    <InfoCard
                        label="Receitas"
                        value={summary.totalIncome}
                        paidValue={summary.paidIncome}
                        paidLabel="Recebido"
                        unpaidValue={summary.unpaidIncome}
                        unpaidLabel="A receber"
                        type="income"
                    />
                    <InfoCard
                        label="Despesas"
                        value={summary.totalExpenses}
                        paidValue={summary.paidExpenses}
                        paidLabel="Já pago"
                        unpaidValue={summary.unpaidExpenses}
                        unpaidLabel="A pagar"
                        type="expense"
                    />
                    <InfoCard
                        label="Saldo Realizado"
                        value={summary.balance}
                        secondaryLabel="Previsão no mês"
                        secondaryValue={summary.projectedBalance}
                        type="balance"
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