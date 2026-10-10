import { useEffect, useState, useCallback } from "react";

import type { Wallet } from "../types";

import { getWallets } from "../api/wallets";
import WalletForm from "../components/forms/WalletForm/WalletForm";
import WalletItem from "../components/items/WalletItem/WalletItem";
import DynamicModal from "../components/ui/DynamicModal/DynamicModal";
import PrimaryButton from "../components/ui/PrimaryButton/PrimaryButton";
import { toastApiError } from "../utils/toast";
import TotalCard from "../components/ui/TotalCard/TotalCard";

function Wallets() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [total, setTotal] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState<Wallet | undefined>(undefined);

    const loadWallets = useCallback(async () => {
        try {
            const { wallets, total } = await getWallets();
            setWallets(wallets);
            setTotal(total);
        } catch (err) {
            toastApiError(err, "Erro ao carregar carteiras");
        }
    }, []);

    useEffect(() => {
        loadWallets();
    }, [loadWallets]);

    return (
        <div className="page-container">
            <div className="page-header with-total">
                <TotalCard label="Total" value={total} />
                <PrimaryButton buttonText="+ Carteira" onClick={() => { setEditingWallet(undefined); setIsModalOpen(true); }} />
            </div>
            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingWallet ? "Editar Carteira" : "Adicionar Carteira"}
            >
                <WalletForm
                    initial={editingWallet}
                    onClose={() => setIsModalOpen(false)}
                    onSaved={loadWallets}
                />
            </DynamicModal>

            {wallets.length > 0 ? (
                wallets.map(wallet =>
                    <WalletItem
                        key={wallet.id}
                        wallet={wallet}
                        onUpdate={loadWallets}
                        onEdit={(w) => { setEditingWallet(w); setIsModalOpen(true); }}
                    />
                )
            ) : (
                <div className="empty-state">Nenhuma carteira</div>
            )}
        </div>
    );
}

export default Wallets;