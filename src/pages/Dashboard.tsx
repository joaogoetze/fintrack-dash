import { useEffect, useState, useCallback } from "react";

import type { Summary, DueTransaction } from "../types";

import { getSummary, getDueTransactions } from "../api/dashboard";
import DueTransactionItem from "../components/items/DueTransactionItem/DueTransactionItem";
import InfoCard from "../components/ui/InfoCard/InfoCard";
import { useAuthStore } from "../stores/authStore";
import { useMonthStore } from "../stores/monthStore";
import { formatCurrency } from "../utils/formatters";
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
                        label="Receitas previstas"
                        value={summary.totalIncome}
                        paidValue={summary.paidIncome}
                        paidLabel="Recebido"
                        unpaidValue={summary.unpaidIncome}
                        unpaidLabel="A receber"
                        type="income"
                    />
                    <InfoCard
                        label="Despesas previstas"
                        value={summary.totalExpenses + (summary.categoryEstimateRemaining || 0)}
                        paidValue={summary.paidExpenses}
                        paidLabel="Pago"
                        unpaidValue={summary.unpaidExpenses}
                        unpaidLabel="A pagar"
                        estimateValue={summary.categoryEstimates.length > 0 ? summary.categoryEstimateRemaining : undefined}
                        estimateLabel="Estimado restante"
                        type="expense"
                    />
                    <InfoCard
                        label="Saldo previsto"
                        value={summary.projectedBalance}
                        secondaryLabel="Saldo confirmado"
                        secondaryValue={summary.balance}
                        type="balance"
                    />
                </div>
            ) : (
                "Sem visão geral"
            )}

            {summary && summary.categoryEstimates.length > 0 && (
                <div className="dashboard-reserves">
                    <h2 className="dashboard-section-title">Reservas do mês</h2>
                    {summary.categoryEstimates.map((item) => {
                        const overspent = item.spent > item.cap && item.cap > 0;
                        const progressPercent = item.cap > 0
                            ? Math.min(100, Math.round((item.spent / item.cap) * 100))
                            : 0;
                        return (
                            <div key={item.categoryId} className="reserve-card">
                                <div className="reserve-card-header">
                                    <span className="reserve-card-name">{item.name}</span>
                                    <span className={overspent ? "reserve-card-over" : "reserve-card-remaining"}>
                                        {formatCurrency(item.remaining)} restante
                                    </span>
                                </div>
                                <div className="category-estimate-bar">
                                    <div
                                        className={`category-estimate-fill ${overspent ? "over" : ""}`}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                                <div className="reserve-card-meta">
                                    {formatCurrency(item.spent)} de {formatCurrency(item.cap)}
                                    {item.marginPercent > 0 ? ` (margem ${item.marginPercent}%)` : ""}
                                </div>
                            </div>
                        );
                    })}
                </div>
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