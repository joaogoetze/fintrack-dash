import { useEffect, useState, useCallback } from "react";

import type { Expense, Wallet } from "../types";

import { getExpenses } from "../api/expenses";
import { getWallets } from "../api/wallets";
import ExpenseForm from "../components/forms/ExpenseForm/ExpenseForm";
import ExpenseItem from "../components/items/ExpenseItem/ExpenseItem";
import DynamicModal from "../components/ui/DynamicModal/DynamicModal";
import PrimaryButton from "../components/ui/PrimaryButton/PrimaryButton";
import TotalCard from "../components/ui/TotalCard/TotalCard";
import WalletFilter from "../components/ui/WalletFilter/WalletFilter";
import { useAuthStore } from "../stores/authStore";
import { useMonthStore } from "../stores/monthStore";
import { toastApiError } from "../utils/toast";

function Expenses() {
  const activeMonth = useMonthStore((state) => state.activeMonth);
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<number | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  const loadExpenses = useCallback(async () => {
    try {
      const { expenses, total, totalPaid, totalUnpaid } = await getExpenses(activeMonth);
      setExpenses(expenses);
      setTotal(total);
      setTotalPaid(totalPaid ?? 0);
      setTotalUnpaid(totalUnpaid ?? 0);
    } catch (err) {
      toastApiError(err, "Erro ao carregar despesas");
    }

    try {
      const { wallets } = await getWallets();
      setWallets(wallets);
    } catch (err) {
      toastApiError(err, "Erro ao carregar carteiras");
    }
  }, [activeMonth]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses, activeWorkspaceId]);

  const effectiveWalletId =
    selectedWalletId === "" || wallets.some((wallet) => wallet.id === selectedWalletId)
      ? selectedWalletId
      : "";

  const filteredExpenses =
    effectiveWalletId === ""
      ? expenses
      : expenses.filter((expense) => expense.walletId === effectiveWalletId);

  return (
    <div className="page-container">
      <div className="page-header with-total">
        <TotalCard
          label="Total Previsto"
          value={total}
          paidValue={totalPaid}
          paidLabel="Já Pago"
          unpaidValue={totalUnpaid}
          unpaidLabel="A Pagar"
        />
        <div className="page-header-actions">
          <WalletFilter
            wallets={wallets}
            value={effectiveWalletId}
            onChange={setSelectedWalletId}
          />
          <PrimaryButton buttonText="+ Despesa" onClick={() => { setEditingExpense(undefined); setIsModalOpen(true); }} />
        </div>
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


      {filteredExpenses.length > 0 ? (
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
          {filteredExpenses.map(expense =>
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onUpdate={loadExpenses}
              onEdit={(e) => { setEditingExpense(e); setIsModalOpen(true); }}
            />
          )}
        </div>
      ) : (
        <div className="empty-state">
          {expenses.length === 0 ? "Nenhuma despesa" : "Nenhuma despesa para esta carteira"}
        </div>
      )}

    </div>
  );
}

export default Expenses;