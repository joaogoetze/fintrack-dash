import { useEffect, useState, useCallback } from "react";
import { Repeat } from "lucide-react";
import type { RecurringTransaction } from "../types";
import { getRecurringTransactions } from "../api/recurringTransactions";
import RecurringTransactionItem from "../components/items/RecurringTransactionItem/RecurringTransactionItem";
import { useAuthStore } from "../stores/authStore";
import { toastApiError } from "../utils/toast";
import "./RecurringTransactions.css";

export function RecurringTransactions() {
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const [items, setItems] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getRecurringTransactions();
      setItems(res.recurringTransactions);
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
      <div className="recurring-section-header">
        <h2 className="recurring-section-title">Transações Recorrentes</h2>
        {items.length > 0 && (
          <span className="recurring-indicator">
            <Repeat size={13} /> {items.length} {items.length === 1 ? "recorrente" : "recorrentes"}
          </span>
        )}
      </div>

      <div className="recurring-list-section">
        {loading ? (
          <div className="empty-state">Carregando transações recorrentes...</div>
        ) : items.length > 0 ? (
          items.map((tx: RecurringTransaction) => (
            <RecurringTransactionItem key={tx.id} transaction={tx} />
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
