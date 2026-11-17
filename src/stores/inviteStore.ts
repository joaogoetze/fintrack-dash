import { create } from "zustand";

import { authApi } from "../api/auth";
import type { WorkspaceInvite } from "../types/Auth";

interface InviteState {
  invites: WorkspaceInvite[];
  fetchInvites: () => Promise<void>;
  removeInvite: (inviteId: number) => void;
}

export const useInviteStore = create<InviteState>((set) => ({
  invites: [],

  fetchInvites: async () => {
    try {
      const data = await authApi.getMyInvites();
      set({ invites: data });
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
    }
  },

  removeInvite: (inviteId) => {
    set((state) => ({
      invites: state.invites.filter((invite) => invite.id !== inviteId),
    }));
  },
}));
