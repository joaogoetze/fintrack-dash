import { useCallback, useEffect, useState } from "react";

import type { Income, Wallet } from "../types";

import { getIncomes } from "../api/incomes";
import { getWallets } from "../api/wallets";
import IncomeForm from "../components/forms/IncomeForm/IncomeForm";
import IncomeItem from "../components/items/IncomeItem/IncomeItem";
import DynamicModal from "../components/ui/DynamicModal/DynamicModal";
import PrimaryButton from "../components/ui/PrimaryButton/PrimaryButton";
import TotalCard from "../components/ui/TotalCard/TotalCard";
import WalletFilter from "../components/ui/WalletFilter/WalletFilter";
import { useAuthStore } from "../stores/authStore";
import { useMonthStore } from "../stores/monthStore";
import { toastApiError } from "../utils/toast";

function Incomes() {
    const activeMonth = useMonthStore((state) => state.activeMonth);
    const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);
    const [totalUnpaid, setTotalUnpaid] = useState(0);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWalletId, setSelectedWalletId] = useState<number | "">("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIncome, setEditingIncome] = useState<Income | undefined>(undefined);

    const loadIncomes = useCallback(async () => {
        try {
            const { incomes, total, totalPaid, totalUnpaid } = await getIncomes(activeMonth);
            setIncomes(incomes);
            setTotal(total);
            setTotalPaid(totalPaid ?? 0);
            setTotalUnpaid(totalUnpaid ?? 0);
        } catch (err) {
            toastApiError(err, "Erro ao carregar receitas");
        }

        try {
            const { wallets } = await getWallets();
            setWallets(wallets);
        } catch (err) {
            toastApiError(err, "Erro ao carregar carteiras");
        }
    }, [activeMonth]);

    useEffect(() => {
        loadIncomes();
    }, [loadIncomes, activeWorkspaceId]);

    const effectiveWalletId =
        selectedWalletId === "" || wallets.some((wallet) => wallet.id === selectedWalletId)
            ? selectedWalletId
            : "";

    const filteredIncomes =
        effectiveWalletId === ""
            ? incomes
            : incomes.filter((income) => income.walletId === effectiveWalletId);

    return (
        <div className="page-container">
      <div className="page-header with-total">
        <TotalCard
          label="Total Previsto"
          value={total}
          paidValue={totalPaid}
          paidLabel="Recebido"
          unpaidValue={totalUnpaid}
          unpaidLabel="A Receber"
        />
        <div className="page-header-actions">
          <WalletFilter
            wallets={wallets}
            value={effectiveWalletId}
            onChange={setSelectedWalletId}
          />
          <PrimaryButton buttonText="+ Receita" onClick={() => { setEditingIncome(undefined); setIsModalOpen(true); }} />
        </div>
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


      {filteredIncomes.length > 0 ? (
        <div className="items-list-container">
          <div className="items-list-header">
            <div className="header-cell header-name-cell">Nome</div>
            <div className="header-cell">Valor</div>
            <div className="header-cell">Data</div>
            <div className="header-cell">Vencimento</div>
            <div className="header-cell">Carteira</div>
            <div className="header-cell header-status-cell">Status</div>
            <div className="header-cell header-actions-cell">Ações</div>
          </div>
          {filteredIncomes.map(income =>
            <IncomeItem
              key={income.id}
              income={income}
              onUpdate={loadIncomes}
              onEdit={(i) => { setEditingIncome(i); setIsModalOpen(true); }}
            />
          )}
        </div>
      ) : (
                <div className="empty-state">
                    {incomes.length === 0 ? "Nenhuma receita" : "Nenhuma receita para esta carteira"}
                </div>
            )}

        </div>
    );
}

export default Incomes;