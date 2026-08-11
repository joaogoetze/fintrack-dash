import { useEffect, useState, useCallback } from "react";
import PrimaryButton from "../components/ui/PrimaryButton/PrimaryButton";
import type { Wallet } from "../types/Wallet";
import { getWallets } from "../api/wallets";
import DynamicModal from "../components/ui/DynamicModal/DynamicModal";
import WalletForm from "../components/forms/WalletForm/WalletForm";
import WalletItem from "../components/items/WalletItem/WalletItem";

function Wallets() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadWallets = useCallback(async () => {
        const data = await getWallets();
        setWallets(data);
    }, []);

    useEffect(() => {
        getWallets().then(setWallets);
    }, []);

    return (
        <div className="page-container">
            <div className="page-header">
                <PrimaryButton buttonText="+ Carteira" onClick={() => setIsModalOpen(true)} />
            </div>
            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Adicionar Carteira"
            >
                <WalletForm
                    onClose={() => setIsModalOpen(false)}
                    onSaved={loadWallets}
                />
            </DynamicModal>

            {wallets.length > 0 ? (
                wallets.map(wallet =>
                    <WalletItem key={wallet.id} wallet={wallet} />
                )
            ) : (
                <div className="empty-state">Nenhuma carteira</div>
            )}
        </div>
    );
}

export default Wallets;