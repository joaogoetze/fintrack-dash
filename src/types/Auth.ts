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
  ownerId: number;
  role?: 'owner' | 'member';
}

export interface WorkspaceMember {
  userId: number;
  name: string;
  email: string;
  role: 'owner' | 'member';
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

