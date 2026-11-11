import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { authApi } from "../../../api/auth";
import { useAuthStore } from "../../../stores/authStore";
import { UserPlus, PlusCircle, X, Users, Pencil } from "lucide-react";
import "./InviteModal.css";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "invite" | "new_workspace" | "rename";
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  initialTab = "invite",
}) => {
  const {
    user,
    workspaces,
    activeWorkspaceId,
    setWorkspaces,
    setActiveWorkspaceId,
    updateWorkspaceInStore,
  } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"invite" | "new_workspace" | "rename">(initialTab);

  // Tab: Convidar
  const [selectedWsId, setSelectedWsId] = useState<number>(activeWorkspaceId || workspaces[0]?.id || 0);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tab: Criar Novo Workspace
  const [newWsName, setNewWsName] = useState("");

  // Tab: Renomear Workspace
  const [renameWsId, setRenameWsId] = useState<number>(activeWorkspaceId || workspaces[0]?.id || 0);
  const [renameWsName, setRenameWsName] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      const initialTargetId = activeWorkspaceId || workspaces[0]?.id || 0;
      setSelectedWsId(initialTargetId);
      setRenameWsId(initialTargetId);
      const currentWs = workspaces.find((w) => w.id === initialTargetId);
      setRenameWsName(currentWs ? currentWs.name : "");
    }
  }, [isOpen, initialTab, activeWorkspaceId, workspaces]);

  const handleSelectRenameWs = (wsId: number) => {
    setRenameWsId(wsId);
    const found = workspaces.find((w) => w.id === wsId);
    setRenameWsName(found ? found.name : "");
  };

  const targetWs = workspaces.find((w) => w.id === renameWsId);
  const canRename =
    !targetWs || !user
      ? false
      : targetWs.ownerId === user.id ||
        targetWs.role === "owner" ||
        targetWs.role === "admin";

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
      setRenameWsId(newWs.id);
      setRenameWsName(newWs.name);
      toast.success(`Espaço "${newWs.name}" criado com sucesso!`);
      setNewWsName("");
      setActiveTab("invite"); // Leva para convidar alguém para o novo espaço
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar espaço");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRenameWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameWsName.trim()) {
      toast.error("Informe o novo nome do espaço");
      return;
    }

    if (!canRename) {
      toast.error("Você não tem permissão para renomear este espaço");
      return;
    }

    try {
      setIsSubmitting(true);
      const updated = await authApi.updateWorkspace(renameWsId, renameWsName.trim());
      updateWorkspaceInStore(updated);
      toast.success(`Espaço renomeado para "${updated.name}" com sucesso!`);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Erro ao renomear espaço");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            {activeTab === "rename" ? (
              <Pencil size={20} className="modal-title-icon" />
            ) : activeTab === "new_workspace" ? (
              <PlusCircle size={20} className="modal-title-icon" />
            ) : (
              <Users size={20} className="modal-title-icon" />
            )}
            <h2>
              {activeTab === "invite" && "Compartilhar Finanças"}
              {activeTab === "new_workspace" && "Criar Novo Espaço"}
              {activeTab === "rename" && "Renomear Espaço"}
            </h2>
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
            <UserPlus size={15} /> Convidar
          </button>
          <button
            className={`tab-btn ${activeTab === "new_workspace" ? "active" : ""}`}
            onClick={() => setActiveTab("new_workspace")}
            type="button"
          >
            <PlusCircle size={15} /> Novo Espaço
          </button>
          <button
            className={`tab-btn ${activeTab === "rename" ? "active" : ""}`}
            onClick={() => setActiveTab("rename")}
            type="button"
          >
            <Pencil size={15} /> Renomear
          </button>
        </div>

        {activeTab === "invite" ? (
          <form onSubmit={handleSendInvite} className="modal-form">
            <p className="modal-description">
              Convide um membro pelo e-mail Google para terem acesso compartilhado às finanças deste espaço.
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
                    {ws.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="required">E-mail Google do convidado:</label>
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
        ) : activeTab === "new_workspace" ? (
          <form onSubmit={handleCreateWorkspace} className="modal-form">
            <p className="modal-description">
              Crie um novo espaço financeiro dedicado (ex: <em>"Pessoal"</em>, <em>"Casal"</em>, <em>"Casa / Família"</em>).
            </p>

            <div className="form-group">
              <label className="required">Nome do Espaço:</label>
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
        ) : (
          <form onSubmit={handleRenameWorkspace} className="modal-form">
            <p className="modal-description">
              Altere o nome deste espaço financeiro compartilhado ou pessoal.
            </p>

            <div className="form-group">
              <label>Espaço a ser renomeado:</label>
              <select
                value={renameWsId}
                onChange={(e) => handleSelectRenameWs(Number(e.target.value))}
                className="modal-select"
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="required">Novo Nome do Espaço:</label>
              <input
                type="text"
                placeholder="Ex: Finanças da Casa"
                value={renameWsName}
                onChange={(e) => setRenameWsName(e.target.value)}
                required
                disabled={!canRename}
                className="modal-input"
              />
            </div>

            {!canRename && (
              <p className="modal-warning">
                Apenas o proprietário ou administradores podem renomear este espaço.
              </p>
            )}

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !canRename || !renameWsName.trim()}
                className="btn-primary"
              >
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InviteModal;
