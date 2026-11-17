import React, { useEffect, useRef, useState } from "react";

import { ChevronDown, LogOut, Settings, WalletCards } from "lucide-react";

import { useAuthStore } from "../../../stores/authStore";
import InviteModal from "../InviteModal/InviteModal";
import NotificationsPopover from "../NotificationsPopover/NotificationsPopover";

import "./WorkspaceSelector.css";

export const WorkspaceSelector: React.FC = () => {
  const { user, workspaces, activeWorkspaceId, setActiveWorkspaceId, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  if (!user) return null;

  return (
    <div className="user-workspace-controls">
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

      <NotificationsPopover />

      <div className="user-profile-widget" ref={menuRef}>
        <button
          type="button"
          className="user-avatar-button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          title={user.name}
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="user-avatar" />
          ) : (
            <div className="user-avatar-fallback">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </button>

        {isMenuOpen && (
          <div className="user-menu" role="menu">
            <div className="user-menu-header">
              <span className="user-menu-name">{user.name}</span>
              <span className="user-menu-email">{user.email}</span>
            </div>
            <button
              type="button"
              className="user-menu-item"
              role="menuitem"
              onClick={() => {
                setIsMenuOpen(false);
                setIsModalOpen(true);
              }}
            >
              <Settings size={16} />
              Gerenciar espaço
            </button>
            <button
              type="button"
              className="user-menu-item user-menu-item-danger"
              role="menuitem"
              onClick={logout}
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        )}
      </div>

      <InviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab="info"
      />
    </div>
  );
};

export default WorkspaceSelector;
