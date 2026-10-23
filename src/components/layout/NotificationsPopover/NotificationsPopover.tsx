import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { authApi } from "../../../api/auth";
import { useAuthStore } from "../../../stores/authStore";
import type { WorkspaceInvite } from "../../../types/Auth";
import { Bell, Check, X, Users } from "lucide-react";
import "./NotificationsPopover.css";

export const NotificationsPopover: React.FC = () => {
  const { setWorkspaces, setActiveWorkspaceId } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [invites, setInvites] = useState<WorkspaceInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // const fetchInvites = async () => {
  //   try {
  //     const data = await authApi.getMyInvites();
  //     setInvites(data);
  //   } catch (error) {
  //     console.error("Erro ao buscar convites:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchInvites();
  //   // Atualiza a cada 30 segundos
  //   const interval = setInterval(fetchInvites, 30000);
  //   return () => clearInterval(interval);
  // }, []);

  // Fecha o popover ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleAccept = async (invite: WorkspaceInvite) => {
    try {
      setLoading(true);
      const res = await authApi.acceptInvite(invite.id);
      setWorkspaces(res.workspaces);
      setActiveWorkspaceId(invite.workspaceId);
      toast.success(`Você agora faz parte do espaço "${invite.workspaceName}"!`);
      setInvites((prev) => prev.filter((i) => i.id !== invite.id));
    } catch (error: any) {
      toast.error(error.message || "Erro ao aceitar convite");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (invite: WorkspaceInvite) => {
    try {
      setLoading(true);
      await authApi.rejectInvite(invite.id);
      toast.info("Convite recusado.");
      setInvites((prev) => prev.filter((i) => i.id !== invite.id));
    } catch (error: any) {
      toast.error(error.message || "Erro ao recusar convite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notifications-wrapper" ref={popoverRef}>
      <button
        className={`bell-button ${invites.length > 0 ? "has-unread" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Notificações e convites"
        type="button"
      >
        <Bell size={17} />
        {invites.length > 0 && <span className="unread-badge">{invites.length}</span>}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h4>Convites Recebidos</h4>
            <span className="notifications-count">{invites.length} pendente(s)</span>
          </div>

          <div className="notifications-list">
            {invites.length === 0 ? (
              <div className="empty-notifications">
                <p>Nenhum convite pendente no momento.</p>
              </div>
            ) : (
              invites.map((invite) => (
                <div key={invite.id} className="invite-item-card">
                  <div className="invite-item-avatar">
                    {invite.inviterAvatar ? (
                      <img src={invite.inviterAvatar} alt={invite.inviterName} />
                    ) : (
                      <div className="avatar-placeholder">
                        <Users size={16} />
                      </div>
                    )}
                  </div>

                  <div className="invite-item-info">
                    <p className="invite-text">
                      <strong>{invite.inviterName}</strong> convidou você para o espaço:
                    </p>
                    <span className="invite-ws-name">{invite.workspaceName}</span>

                    <div className="invite-actions">
                      <button
                        className="btn-accept"
                        onClick={() => handleAccept(invite)}
                        disabled={loading}
                        type="button"
                      >
                        <Check size={14} /> Aceitar
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleReject(invite)}
                        disabled={loading}
                        type="button"
                      >
                        <X size={14} /> Recusar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPopover;
