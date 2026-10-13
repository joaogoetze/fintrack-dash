import React, { useState } from "react";
import { useAuthStore } from "../../../stores/authStore";
import { Users, User as UserIcon, ChevronDown, LogOut, UserPlus } from "lucide-react";
import InviteModal from "../InviteModal/InviteModal";
import NotificationsPopover from "../NotificationsPopover/NotificationsPopover";
import "./WorkspaceSelector.css";

export const WorkspaceSelector: React.FC = () => {
  const { user, workspaces, activeWorkspaceId, setActiveWorkspaceId, logout } = useAuthStore();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  if (!user) return null;

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  return (
    <div className="user-workspace-controls">
      {/* Seletor de Espaço */}
      <div className="workspace-dropdown-wrapper">
        <div className="workspace-badge">
          {activeWorkspace?.isPersonal ? (
            <UserIcon size={14} className="ws-icon" />
          ) : (
            <Users size={14} className="ws-icon ws-shared" />
          )}
          <select
            className="workspace-select"
            value={activeWorkspaceId || ""}
            onChange={(e) => setActiveWorkspaceId(Number(e.target.value))}
          >
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name} {ws.isPersonal ? "(Pessoal)" : "(Compartilhado)"}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="select-arrow" />
        </div>
      </div>

      {/* Botão de Convidar / Compartilhar */}
      <button
        className="action-icon-button"
        onClick={() => setIsInviteOpen(true)}
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

      {/* Modal de Convite */}
      <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
};

export default WorkspaceSelector;

