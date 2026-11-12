import { useCallback, useEffect, useState } from "react";

import type { RecurringTransaction } from "../types";

import { getRecurringTransactions } from "../api/recurringTransactions";
import RecurringTransactionForm from "../components/forms/RecurringTransactionForm/RecurringTransactionForm";
import RecurringTransactionItem from "../components/items/RecurringTransactionItem/RecurringTransactionItem";
import DynamicModal from "../components/ui/DynamicModal/DynamicModal";
import PrimaryButton from "../components/ui/PrimaryButton/PrimaryButton";
import TotalCard from "../components/ui/TotalCard/TotalCard";
import { useAuthStore } from "../stores/authStore";
import { toastApiError } from "../utils/toast";

import "./RecurringTransactions.css";

export function RecurringTransactions() {
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const [items, setItems] = useState<RecurringTransaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringTransaction | undefined>(undefined);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getRecurringTransactions();
      setItems(res.recurringTransactions);
      setBalance(res.balance);
    } catch (err) {
      toastApiError(err, "Erro ao carregar transações recorrentes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, activeWorkspaceId]);

  return (
    <div className="page-container">
      <div className="page-header with-total">
        <TotalCard label="Saldo das recorrentes" value={balance} />
        <PrimaryButton
          buttonText="+ Recorrente"
          onClick={() => {
            setEditing(undefined);
            setIsModalOpen(true);
          }}
        />
      </div>

      <DynamicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Editar recorrente" : "Adicionar recorrente"}
      >
        <RecurringTransactionForm
          initial={editing}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadData}
        />
      </DynamicModal>

      <div className="recurring-list-section">
        {loading ? (
          <div className="empty-state">Carregando transações recorrentes...</div>
        ) : items.length > 0 ? (
          items.map((tx: RecurringTransaction) => (
            <RecurringTransactionItem
              key={tx.id}
              transaction={tx}
              onUpdate={loadData}
              onEdit={(item) => {
                setEditing(item);
                setIsModalOpen(true);
              }}
            />
          ))
        ) : (
          <div className="empty-state">
            Nenhuma transação recorrente cadastrada neste espaço.
          </div>
        )}
      </div>
    </div>
  );
}

export default RecurringTransactions;
