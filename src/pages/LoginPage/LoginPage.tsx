import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { CalendarDays, ShieldCheck, Users } from "lucide-react";

import { authApi } from "../../api/auth";
import { useAuthStore } from "../../stores/authStore";

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
      toast.error(error.message || "Erro ao conectar com sua conta Google");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-badge">
            <img src="/favicon.svg" alt="" className="login-logo-img" />
          </div>
          <h1>FinTrack</h1>
          <p className="login-subtitle">
            Seu controle financeiro pessoal e compartilhado
          </p>
        </div>

        <div className="login-actions">
          <div className="google-btn-wrapper">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => toast.error("Falha ao fazer login com o Google")}
              useOneTap
              theme="outline"
              shape="rectangular"
              text="continue_with"
            />
          </div>
          <p className="login-cta">Acesse com sua conta Google</p>
        </div>

        <div className="login-features">
          <div className="feature-item">
            <div className="feature-icon">
              <Users size={18} />
            </div>
            <div>
              <strong>Controle personalizado</strong>
              <p>Pessoal, casal ou casa, cada um com o próprio saldo.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <CalendarDays size={18} />
            </div>
            <div>
              <strong>Visualização mensal</strong>
              <p>Vencimentos, o que já pagou e o que ainda vai gastar.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <ShieldCheck size={18} />
            </div>
            <div>
              <strong>Acesso fácil</strong>
              <p>Acesso rápido e protegido pela sua conta Google</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
