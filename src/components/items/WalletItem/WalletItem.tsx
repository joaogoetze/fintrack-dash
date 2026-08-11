import type { Wallet } from "../../../types/Wallet";
import { Wallet as WalletIcon } from "lucide-react";
import "./WalletItem.css";

function WalletItem({ wallet }: { wallet: Wallet }) {
  const formatCurrencyLocal = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="wallet-card">
      <div className="wallet-card-name-wrapper">
        <div className="wallet-icon">
          <WalletIcon size={20} />
        </div>
        <span className="wallet-card-name">{wallet.name}</span>
      </div>
      <span className="wallet-card-value">{formatCurrencyLocal(wallet.balance)}</span>
    </div>
  );
}

export default WalletItem;