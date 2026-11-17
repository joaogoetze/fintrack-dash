import React, { useState } from "react";
import { toast } from "sonner";
import { authApi } from "../../api/auth";
import { useAuthStore } from "../../stores/authStore";
import { useInviteStore } from "../../stores/inviteStore";
import type { WorkspaceInvite } from "../../types/Auth";
import { ArrowRight, Check, Users, LogOut } from "lucide-react";
import "./OnboardingPage.css";

export const OnboardingPage: React.FC = () => {
  const { user, setWorkspaces, setActiveWorkspaceId, logout } = useAuthStore();
  const invites = useInviteStore((state) => state.invites);
  const removeInvite = useInviteStore((state) => state.removeInvite);
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) {
      toast.error("Informe um nome para o seu espaço financeiro");
      return;
    }

    try {
      setLoading(true);
      const newWs = await authApi.createWorkspace(workspaceName.trim());
      setWorkspaces([newWs]);
      setActiveWorkspaceId(newWs.id);
      toast.success(`Espaço "${newWs.name}" criado com sucesso!`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar espaço financeiro");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async (invite: WorkspaceInvite) => {
    try {
      setLoading(true);
      const res = await authApi.acceptInvite(invite.id);
      setWorkspaces(res.workspaces);
      setActiveWorkspaceId(invite.workspaceId);
      toast.success(`Você agora faz parte do espaço "${invite.workspaceName}"!`);
      removeInvite(invite.id);
    } catch (error: any) {
      toast.error(error.message || "Erro ao aceitar convite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="onboarding-top-nav">
          <div className="onboarding-user-info">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="onboarding-avatar" />
            ) : (
              <div className="onboarding-avatar-placeholder">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span>{user?.email}</span>
          </div>
          <button className="onboarding-logout-btn" onClick={logout} title="Trocar de conta">
            <LogOut size={16} /> Sair
          </button>
        </div>

        <div className="onboarding-header">
          <div className="onboarding-logo-badge">
            <img src="/favicon.svg" alt="" className="onboarding-logo-img" />
          </div>
          <h1>Bem-vindo ao FinTrack!</h1>
          <p className="onboarding-subtitle">
            Para começar, crie seu primeiro espaço financeiro.
          </p>
        </div>

        

        <form onSubmit={handleCreateWorkspace} className="onboarding-form">
          <div className="form-group">
            <label htmlFor="ws-name" className="required">Nome do seu espaço financeiro</label>
            <input
              id="ws-name"
              type="text"
              placeholder="Ex: Minhas Finanças, Finanças do Casal..."
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              required
              autoFocus
              className="onboarding-input"
            />
          </div>

          <button type="submit" disabled={loading} className="onboarding-submit-btn">
            {loading ? "Criando espaço..." : "Continuar para o Dashboard"}
            <ArrowRight size={16} />
          </button>
        </form>

        {invites.length > 0 && (
          <>
          <div className="onboarding-divider">
          <span>ou acesse espaços a que você já foi convidado</span>
        </div>
          <div className="onboarding-invites-section">
            {/* <span className="onboarding-invites-title">
              Você foi convidado para um espaço:
            </span> */}
            {invites.map((invite) => (
              <div key={invite.id} className="onboarding-invite-card">
                <div className="onboarding-invite-icon">
                  <Users size={18} />
                </div>
                <div className="onboarding-invite-details">
                  <strong>{invite.workspaceName}</strong>
                  <p>Criado por {invite.inviterName}</p>
                </div>
                <button
                  className="onboarding-accept-btn"
                  onClick={() => handleAcceptInvite(invite)}
                  disabled={loading}
                >
                  <Check size={14} /> Entrar
                </button>
              </div>
            ))}
            
          </div>
          </>
          
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
