import { useEffect, useState } from "react";
import DynamicModal from "../DynamicModal/DynamicModal";
import SelectField from "../SelectField/SelectField";
import { getWallets } from "../../../api/wallets";
import type { Wallet } from "../../../types/Wallet";

interface SelectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (walletId: number) => void;
}

function SelectWalletModal({ isOpen, onClose, onConfirm }: SelectWalletModalProps) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletId, setWalletId] = useState<number | "">("");

  useEffect(() => {
    if (!isOpen) return;
    setWalletId("");
    const loadWallets = async () => {
      try {
        const data = await getWallets();
        setWallets(data);
      } catch (err) {
        console.error("Erro ao carregar wallets:", err);
      }
    };
    loadWallets();
  }, [isOpen]);

  const handleConfirm = () => {
    if (walletId === "") return;
    onConfirm(Number(walletId));
    onClose();
  };

  return (
    <DynamicModal isOpen={isOpen} onClose={onClose} title="Selecionar carteira">
      <div className="form">
        <div className="form-field">
          <label htmlFor="wallet-select">Carteira</label>
          <SelectField
            id="wallet-select"
            value={walletId}
            onChange={(e) => setWalletId(e.target.value === "" ? "" : Number(e.target.value))}
          >
            <option value="">Selecione uma carteira</option>
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn-save"
            onClick={handleConfirm}
            disabled={walletId === ""}
          >
            Confirmar
          </button>
        </div>
      </div>
    </DynamicModal>
  );
}

export default SelectWalletModal;