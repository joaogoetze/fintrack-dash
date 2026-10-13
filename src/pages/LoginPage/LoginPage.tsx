import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { authApi } from "../../api/auth";
import { useAuthStore } from "../../stores/authStore";
import { WalletCards, ShieldCheck, Users, Sparkles } from "lucide-react";
import "./LoginPage.css";

export const LoginPage: React.FC = () => {
  const setAuth = useAuthStore((state: any) => state.setAuth);


  const handleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        toast.error("Falha ao obter credenciais do Google");
        return;
      }

      const res = await authApi.loginWithGoogle(credentialResponse.credential);
      setAuth(res.token, res.user, res.workspaces);
      toast.success(`Bem-vindo, ${res.user.name.split(" ")[0]}!`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao conectar com sua conta Google");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-badge">
            <WalletCards size={32} />
          </div>
          <h1>FinTrack</h1>
          <p className="login-subtitle">
            Seu controle financeiro pessoal e compartilhado
          </p>
        </div>

        <div className="login-features">
          <div className="feature-item">
            <div className="feature-icon">
              <ShieldCheck size={18} />
            </div>
            <div>
              <strong>Segurança Total</strong>
              <p>Acesso rápido e protegido pela sua conta Google</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <Users size={18} />
            </div>
            <div>
              <strong>Controle Individual ou a Dois</strong>
              <p>Separe suas contas pessoais das despesas do casal ou da família</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <Sparkles size={18} />
            </div>
            <div>
              <strong>Visão Clara & Tempo Real</strong>
              <p>Monitore receitas, gastos e metas num só lugar</p>
            </div>
          </div>
        </div>

        <div className="login-actions">
          <div className="google-btn-wrapper">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => toast.error("Falha ao fazer login com o Google")}
              useOneTap
              theme="filled_black"
              shape="pill"
              text="continue_with"
            />
          </div>
        </div>

        <div className="login-footer">
          <p>Ao entrar, você concorda em gerenciar suas finanças de forma inteligente.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
