import type { Wallet } from "../../../types";

import SelectField from "../SelectField/SelectField";

import "./WalletFilter.css";

interface WalletFilterProps {
  wallets: Wallet[];
  value: number | "";
  onChange: (walletId: number | "") => void;
}

function WalletFilter({ wallets, value, onChange }: WalletFilterProps) {
  return (
    <div className="wallet-filter">
      <SelectField
        id="wallet-filter"
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      >
        <option value="">Todas as carteiras</option>
        {wallets.map((wallet) => (
          <option key={wallet.id} value={wallet.id}>
            {wallet.name}
          </option>
        ))}
      </SelectField>
    </div>
  );
}

export default WalletFilter;
