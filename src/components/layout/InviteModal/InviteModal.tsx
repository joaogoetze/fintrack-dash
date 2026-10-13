import React, { useState } from "react";
import { toast } from "sonner";
import { authApi } from "../../../api/auth";
import { useAuthStore } from "../../../stores/authStore";
import { UserPlus, PlusCircle, X, Users } from "lucide-react";
import "./InviteModal.css";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose }) => {
  const { workspaces, activeWorkspaceId, setWorkspaces, setActiveWorkspaceId } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"invite" | "new_workspace">("invite");
  
  // Tab: Convidar
  const [selectedWsId, setSelectedWsId] = useState<number>(activeWorkspaceId || workspaces[0]?.id || 0);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tab: Criar Novo Workspace
  const [newWsName, setNewWsName] = useState("");

  if (!isOpen) return null;

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Informe o e-mail da pessoa");
      return;
    }

    try {
      setIsSubmitting(true);
      await authApi.inviteUser(selectedWsId, email.trim());
      toast.success(`Convite enviado para ${email}!`);
      setEmail("");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar convite");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) {
      toast.error("Informe o nome do espaço (ex: Finanças do Casal)");
      return;
    }

    try {
      setIsSubmitting(true);
      const newWs = await authApi.createWorkspace(newWsName.trim());
      const updated = [...workspaces, newWs];
      setWorkspaces(updated);
      setActiveWorkspaceId(newWs.id);
      setSelectedWsId(newWs.id);
      toast.success(`Espaço "${newWs.name}" criado com sucesso!`);
      setNewWsName("");
      setActiveTab("invite"); // Já leva direto para convidar alguém para o novo espaço
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar espaço");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Users size={20} className="modal-title-icon" />
            <h2>Compartilhar Finanças</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === "invite" ? "active" : ""}`}
            onClick={() => setActiveTab("invite")}
            type="button"
          >
            <UserPlus size={15} /> Convidar Membro
          </button>
          <button
            className={`tab-btn ${activeTab === "new_workspace" ? "active" : ""}`}
            onClick={() => setActiveTab("new_workspace")}
            type="button"
          >
            <PlusCircle size={15} /> Novo Espaço Conjunto
          </button>
        </div>

        {activeTab === "invite" ? (
          <form onSubmit={handleSendInvite} className="modal-form">
            <p className="modal-description">
              Convide seu parceiro(a) ou familiar pelo e-mail Google para terem acesso conjunto às finanças.
            </p>

            <div className="form-group">
              <label>Espaço a ser compartilhado:</label>
              <select
                value={selectedWsId}
                onChange={(e) => setSelectedWsId(Number(e.target.value))}
                className="modal-select"
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name} {ws.isPersonal ? "(Pessoal)" : "(Compartilhado)"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>E-mail Google do convidado:</label>
              <input
                type="email"
                placeholder="exemplo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="modal-input"
              />
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? "Enviando..." : "Enviar Convite"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateWorkspace} className="modal-form">
            <p className="modal-description">
              Crie uma conta/espaço novo dedicado para despesas em conjunto (ex: <em>"Casal"</em>, <em>"Casa / Família"</em>).
            </p>

            <div className="form-group">
              <label>Nome do Espaço:</label>
              <input
                type="text"
                placeholder="Ex: Finanças do Casal"
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                required
                className="modal-input"
              />
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? "Criando..." : "Criar Espaço"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InviteModal;
