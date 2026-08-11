import { useEffect, useState } from "react";
import { getSumary } from "../api/dashboard";
import type { Summary } from "../types/Summary";
import InfoCard from "../components/ui/InfoCard/InfoCard";
import { useMonthStore } from "../stores/monthStore";

function Dashboard() {
    const activeMonth = useMonthStore((state) => state.activeMonth);
    const [sumary, setSumary] = useState<Summary | null>(null);

    useEffect(() => {
        getSumary(activeMonth).then(setSumary);

    }, [activeMonth]);

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
        </div>
    );
}

export default Dashboard;