export type UserRole = 'administrador' | 'gestor' | 'tecnico_op' | 'tecnico_si' | 'padrao' | 'consultor';

export interface Organization {
    id: number;
    name: string;
}

export interface Profile {
    id: number;
    name: string; // e.g., 'Gestor Operacional'
    role: UserRole; // e.g., 'gestor'
    description: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  organization: Organization;
  profile: Profile;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}