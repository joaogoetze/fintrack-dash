import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { authApi } from "../../../api/auth";
import { useAuthStore } from "../../../stores/authStore";
import type { WorkspaceMember } from "../../../types/Auth";
import { ChevronDown, PlusCircle, X, UserPlus, Trash2, Info } from "lucide-react";
import ConfirmDialog from "../../ui/ConfirmDialog/ConfirmDialog";
import "./InviteModal.css";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "info" | "new_workspace";
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  initialTab = "info",
}) => {
  const {
    user,
    workspaces,
    activeWorkspaceId,
    setWorkspaces,
    setActiveWorkspaceId,
    updateWorkspaceInStore,
  } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"info" | "new_workspace">(initialTab);

  const [selectedWsId, setSelectedWsId] = useState<number>(activeWorkspaceId || workspaces[0]?.id || 0);
  const [renameWsName, setRenameWsName] = useState("");
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [showInviteInput, setShowInviteInput] = useState(false);
  const [email, setEmail] = useState("");
  const [newWsName, setNewWsName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<number | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<WorkspaceMember | null>(null);

  const targetWs = workspaces.find((w) => w.id === selectedWsId);
  const canRename =
    !targetWs || !user
      ? false
      : targetWs.ownerId === user.id || targetWs.role === "owner";
  const isOwner = canRename;

  const loadMembers = async (workspaceId: number) => {
    if (!workspaceId) {
      setMembers([]);
      return;
    }
    try {
      const data = await authApi.getWorkspaceMembers(workspaceId);
      setMembers(data);
    } catch (error: any) {
      toast.error(error.message || "Erro ao carregar membros");
      setMembers([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      const initialTargetId = activeWorkspaceId || workspaces[0]?.id || 0;
      setSelectedWsId(initialTargetId);
      const currentWs = workspaces.find((w) => w.id === initialTargetId);
      setRenameWsName(currentWs ? currentWs.name : "");
      setShowInviteInput(false);
      setEmail("");
      loadMembers(initialTargetId);
    }
  }, [isOpen, initialTab, activeWorkspaceId, workspaces]);

  const handleSelectWorkspace = (wsId: number) => {
    setSelectedWsId(wsId);
    const found = workspaces.find((w) => w.id === wsId);
    setRenameWsName(found ? found.name : "");
    setShowInviteInput(false);
    setEmail("");
    loadMembers(wsId);
  };

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
      setShowInviteInput(false);
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
      setRenameWsName(newWs.name);
      toast.success(`Espaço "${newWs.name}" criado com sucesso!`);
      setNewWsName("");
      setActiveTab("info");
      setShowInviteInput(false);
      await loadMembers(newWs.id);
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
      const updated = await authApi.updateWorkspace(selectedWsId, renameWsName.trim());
      updateWorkspaceInStore(updated);
      toast.success(`Espaço renomeado para "${updated.name}" com sucesso!`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao renomear espaço");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      setRemovingUserId(memberToRemove.userId);
      await authApi.removeWorkspaceMember(selectedWsId, memberToRemove.userId);
      toast.success(`${memberToRemove.name} foi removido do espaço.`);
      setMemberToRemove(null);
      await loadMembers(selectedWsId);
    } catch (error: any) {
      toast.error(error.message || "Erro ao remover membro");
    } finally {
      setRemovingUserId(null);
    }
  };

  return (
    <>
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            {activeTab === "new_workspace" ? (
              <PlusCircle size={20} className="modal-title-icon" />
            ) : (
              <Info size={20} className="modal-title-icon" />
            )}
            <h2>
              {activeTab === "info" && "Informações do Workspace"}
              {activeTab === "new_workspace" && "Criar Novo Espaço"}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
            type="button"
          >
            <Info size={15} /> Informações
          </button>
          <button
            className={`tab-btn ${activeTab === "new_workspace" ? "active" : ""}`}
            onClick={() => setActiveTab("new_workspace")}
            type="button"
          >
            <PlusCircle size={15} /> Novo Espaço
          </button>
        </div>

        {activeTab === "info" ? (
          <div className="modal-form">
            <div className="form-group">
              <label>Espaço:</label>
              <div className="modal-select-wrapper">
                <select
                  value={selectedWsId}
                  onChange={(e) => handleSelectWorkspace(Number(e.target.value))}
                  className="modal-select"
                >
                  {workspaces.map((ws) => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name}
                    </option>
                  ))}
                </select>
                <span className="modal-select-chevron">
                  <ChevronDown size={16} />
                </span>
              </div>
            </div>

            <form onSubmit={handleRenameWorkspace} className="rename-row">
              <div className="form-group">
                <label className="required">Nome do espaço:</label>
                <input
                  type="text"
                  value={renameWsName}
                  onChange={(e) => setRenameWsName(e.target.value)}
                  required
                  disabled={!canRename}
                  className="modal-input"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !canRename || !renameWsName.trim()}
                className="btn-primary rename-save-btn"
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </button>
            </form>

            {!canRename && (
              <p className="modal-warning">
                Apenas o proprietário pode renomear este espaço.
              </p>
            )}

            <div className="members-section">
              <div className="members-header">
                <span>Membros</span>
                <button
                  type="button"
                  className="add-member-btn"
                  onClick={() => setShowInviteInput((open) => !open)}
                  title="Adicionar membro"
                >
                  <UserPlus size={16} />
                </button>
              </div>

              {showInviteInput && (
                <form onSubmit={handleSendInvite} className="invite-inline">
                  <input
                    type="email"
                    placeholder="e-mail Google do convidado"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="modal-input"
                    autoFocus
                  />
                  <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? "Enviando..." : "Convidar"}
                  </button>
                </form>
              )}

              <ul className="members-list">
                {members.map((member) => (
                  <li key={member.userId} className="member-row">
                    <div className="member-info">
                      <strong>{member.name}</strong>
                      <span>{member.email}</span>
                    </div>
                    {isOwner && member.role !== "owner" && member.userId !== user?.id && (
                      <button
                        type="button"
                        className="remove-member-btn"
                        disabled={removingUserId === member.userId}
                        onClick={() => setMemberToRemove(member)}
                        title="Remover membro"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateWorkspace} className="modal-form">
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
        )}
      </div>
    </div>

    <ConfirmDialog
      isOpen={!!memberToRemove}
      title="Remover membro"
      message={
        memberToRemove
          ? `Remover ${memberToRemove.name} (${memberToRemove.email}) deste espaço?`
          : ""
      }
      confirmText="Remover"
      onConfirm={handleRemoveMember}
      onClose={() => setMemberToRemove(null)}
    />
    </>
  );
};

export default InviteModal;
