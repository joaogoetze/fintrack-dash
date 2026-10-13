import { api } from "./client";
import type { User, Workspace, WorkspaceInvite } from "../types/Auth";

interface LoginResponse {
  token: string;
  user: User;
  workspaces: Workspace[];
}

export const authApi = {
  loginWithGoogle(credential: string) {
    return api.post<LoginResponse>("/auth/google", { credential });
  },

  getMe() {
    return api.get<{ user: User; workspaces: Workspace[] }>("/auth/me");
  },

  createWorkspace(name: string) {
    return api.post<Workspace>("/auth/workspaces", { name });
  },

  inviteUser(workspaceId: number, email: string) {
    return api.post<WorkspaceInvite>(`/auth/workspaces/${workspaceId}/invites`, { email });
  },

  getMyInvites() {
    return api.get<WorkspaceInvite[]>("/auth/invites");
  },

  acceptInvite(inviteId: number) {
    return api.post<{ success: boolean; workspaces: Workspace[] }>(`/auth/invites/${inviteId}/accept`, {});
  },

  rejectInvite(inviteId: number) {
    return api.post<{ success: boolean }>(`/auth/invites/${inviteId}/reject`, {});
  },
};

