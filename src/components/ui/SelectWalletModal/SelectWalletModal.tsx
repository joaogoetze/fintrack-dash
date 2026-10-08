import { useEffect, useState } from "react";

import type { Wallet } from "../../../types";

import { getWallets } from "../../../api/wallets";
import { toDateInputValue } from "../../../utils/formatters";
import { toastApiError } from "../../../utils/toast";
import DynamicModal from "../DynamicModal/DynamicModal";
import SelectField from "../SelectField/SelectField";

interface SelectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (walletId: number, date?: string | null) => void;
  initialWalletId?: number | null;
  initialDate?: string | null;
}

function SelectWalletModal({
  isOpen,
  onClose,
  onConfirm,
  initialWalletId,
  initialDate,
}: SelectWalletModalProps) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletId, setWalletId] = useState<number | "">(initialWalletId || "");
  const [paymentDate, setPaymentDate] = useState<string>("");

  useEffect(() => {
    if (!isOpen) return;
    setWalletId(initialWalletId || "");
    setPaymentDate(initialDate ? toDateInputValue(initialDate) : "");
    const loadWallets = async () => {
      try {
        const data = await getWallets();
        setWallets(data);
      } catch (err) {
        toastApiError(err, "Erro ao carregar carteiras");
      }
    };
    loadWallets();
  }, [isOpen, initialWalletId, initialDate]);

  const handleConfirm = () => {
    if (walletId === "") return;
    onConfirm(Number(walletId), paymentDate ? paymentDate : null);
    onClose();
  };

  return (
    <DynamicModal isOpen={isOpen} onClose={onClose} title="Confirmar pagamento">
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

        <div className="form-field">
          <label htmlFor="payment-date">Data do pagamento (opcional)</label>
          <input
            id="payment-date"
            type={paymentDate ? "date" : "text"}
            placeholder="Nenhuma data selecionada"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
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