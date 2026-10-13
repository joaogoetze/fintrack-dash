export interface User {
  id: number;
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
}

export interface Workspace {
  id: number;
  name: string;
  isPersonal: boolean;
  ownerId: number;
  role?: 'owner' | 'admin' | 'member';
}

export interface WorkspaceInvite {
  id: number;
  workspaceId: number;
  workspaceName?: string;
  invitedEmail: string;
  invitedBy: number;
  inviterName?: string;
  inviterEmail?: string;
  inviterAvatar?: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: string;
}

