import React, { useState } from "react";
import { useAuthStore } from "../../../stores/authStore";
import { WalletCards, ChevronDown, LogOut, UserPlus, Pencil } from "lucide-react";
import InviteModal from "../InviteModal/InviteModal";
import NotificationsPopover from "../NotificationsPopover/NotificationsPopover";
import "./WorkspaceSelector.css";

export const WorkspaceSelector: React.FC = () => {
  const { user, workspaces, activeWorkspaceId, setActiveWorkspaceId, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"invite" | "new_workspace" | "rename">("invite");

  if (!user) return null;

  return (
    <div className="user-workspace-controls">
      {/* Seletor de Espaço */}
      <div className="workspace-dropdown-wrapper">
        <div className="workspace-badge">
          <WalletCards size={15} className="ws-icon" />
          <select
            className="workspace-select"
            value={activeWorkspaceId || ""}
            onChange={(e) => setActiveWorkspaceId(Number(e.target.value))}
          >
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="select-arrow" />
        </div>
      </div>

      {/* Botão de Renomear Espaço */}
      <button
        className="action-icon-button"
        onClick={() => {
          setModalTab("rename");
          setIsModalOpen(true);
        }}
        title="Renomear espaço"
        type="button"
      >
        <Pencil size={15} />
      </button>

      {/* Botão de Convidar / Compartilhar */}
      <button
        className="action-icon-button"
        onClick={() => {
          setModalTab("invite");
          setIsModalOpen(true);
        }}
        title="Convidar membro ou criar espaço conjunto"
        type="button"
      >
        <UserPlus size={16} />
      </button>

      {/* Notificações / Convites */}
      <NotificationsPopover />

      {/* Perfil & Logout */}
      <div className="user-profile-widget">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="user-avatar" />
        ) : (
          <div className="user-avatar-fallback">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="user-name">{user.name.split(" ")[0]}</span>

        <button
          className="logout-button"
          onClick={logout}
          title="Sair da conta"
          type="button"
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* Modal de Gerenciamento / Convite */}
      <InviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={modalTab}
      />
    </div>
  );
};

export default WorkspaceSelector;
