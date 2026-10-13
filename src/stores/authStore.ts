import { create } from "zustand";
import type { User, Workspace } from "../types/Auth";

interface AuthState {
  token: string | null;
  user: User | null;
  workspaces: Workspace[];
  activeWorkspaceId: number | null;
  setAuth: (token: string, user: User, workspaces: Workspace[]) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspaceId: (workspaceId: number) => void;
  logout: () => void;
}


const STORAGE_KEY_TOKEN = "fintrack_token";
const STORAGE_KEY_USER = "fintrack_user";
const STORAGE_KEY_WORKSPACES = "fintrack_workspaces";
const STORAGE_KEY_ACTIVE_WS = "fintrack_active_ws";

export const useAuthStore = create<AuthState>((set) => {
  const initialToken = localStorage.getItem(STORAGE_KEY_TOKEN);
  const initialUser = localStorage.getItem(STORAGE_KEY_USER)
    ? JSON.parse(localStorage.getItem(STORAGE_KEY_USER)!)
    : null;
  const initialWorkspaces: Workspace[] = localStorage.getItem(STORAGE_KEY_WORKSPACES)
    ? JSON.parse(localStorage.getItem(STORAGE_KEY_WORKSPACES)!)
    : [];
  const storedActiveWs = localStorage.getItem(STORAGE_KEY_ACTIVE_WS);
  const initialActiveWs = storedActiveWs
    ? Number(storedActiveWs)
    : initialWorkspaces[0]?.id || null;

  return {
    token: initialToken,
    user: initialUser,
    workspaces: initialWorkspaces,
    activeWorkspaceId: initialActiveWs,

    setAuth: (token, user, workspaces) => {
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_WORKSPACES, JSON.stringify(workspaces));

      const activeWs = workspaces[0]?.id || null;
      if (activeWs) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_WS, String(activeWs));
      }

      set({
        token,
        user,
        workspaces,
        activeWorkspaceId: activeWs,
      });
    },

    setWorkspaces: (workspaces) => {
      localStorage.setItem(STORAGE_KEY_WORKSPACES, JSON.stringify(workspaces));
      set({ workspaces });
    },

    setActiveWorkspaceId: (workspaceId) => {

      localStorage.setItem(STORAGE_KEY_ACTIVE_WS, String(workspaceId));
      set({ activeWorkspaceId: workspaceId });
    },

    logout: () => {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_WORKSPACES);
      localStorage.removeItem(STORAGE_KEY_ACTIVE_WS);

      set({
        token: null,
        user: null,
        workspaces: [],
        activeWorkspaceId: null,
      });
    },
  };
});
