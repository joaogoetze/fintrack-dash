import type { Wallet } from "../../../types/Wallet";
import { Wallet as WalletIcon, Trash2 } from "lucide-react";
import { deleteWallet } from "../../../api/wallets";
import { useState } from "react";
import ConfirmDialog from "../../ui/ConfirmDialog/ConfirmDialog";
import "./WalletItem.css";

interface WalletItemProps {
  wallet: Wallet;
  onUpdate?: () => void;
}

function WalletItem({ wallet, onUpdate }: WalletItemProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const formatCurrencyLocal = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleDelete = async () => {
    try {
      await deleteWallet(wallet.id);
      setIsDeleteModalOpen(false);
      onUpdate?.();
    } catch (err) {
      console.error("Erro ao excluir carteira:", err);
    }
  };

  return (
    <>
      <div className="wallet-card">
        <div className="wallet-card-name-wrapper">
          <div className="wallet-icon">
            <WalletIcon size={20} />
          </div>
          <span className="wallet-card-name">{wallet.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className="wallet-card-value">{formatCurrencyLocal(wallet.balance)}</span>
          <button
            type="button"
            className="item-delete-btn"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Excluir carteira"
        message={`Deseja excluir a carteira "${wallet.name}"?`}
        confirmText="Excluir"
        onConfirm={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}

export default WalletItem;