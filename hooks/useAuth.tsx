// FIX: Updated component to use React.PropsWithChildren for better type safety with children props.
import React, { createContext, useContext, useState, ReactNode, PropsWithChildren } from 'react';
import { User, UserRole, AuthContextType, Organization, Profile } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock database based on SQL schema
const mockOrganizations: Organization[] = [
    { id: 1, name: 'SGA - Sociedade Gestora de Aeroportos' },
    { id: 2, name: 'CGCF - Comité de Gestão Coordenada de Fronteiras' }
];

const mockProfiles: Profile[] = [
    { id: 1, name: 'Administrador', role: 'administrador', description: 'Acesso total ao sistema, incluindo gestão completa.' },
    { id: 2, name: 'Gestor Operacional', role: 'gestor', description: 'Pode gerir usuários da própria organização e consultar relatórios.' },
    { id: 3, name: 'Técnico de Sistema de Informação', role: 'tecnico_si', description: 'Gerencia a infraestrutura de TI, sistemas e segurança da informação.' },
    { id: 4, name: 'Usuário Padrão', role: 'padrao', description: 'Acesso básico, restrito a consultas e ações simples.' },
    { id: 5, name: 'Visitante / Auditor', role: 'consultor', description: 'Acesso somente de leitura, sem alterações.' },
    { id: 10, name: 'Técnico de Operação', role: 'tecnico_op', description: 'Executa atividades de campo, fiscalização e operações diárias.' },
];

// Omit<User, ...> helps define the raw user data before joining with organization and profile.
const mockUsers: (Omit<User, 'organization'|'profile'> & { password: string, organization_id: number, profile_id: number })[] = [
  { 
    id: 1,
    username: 'Geiger Carlos',
    email: 'glcarlos@sga.co.ao',
    password: 'siif2024',
    organization_id: 1,
    profile_id: 1
  },
  {
    id: 2,
    username: 'Gestor de Operações',
    email: 'gestor@sgo.cgcf.gov.ao',
    password: 'siif2024',
    organization_id: 2,
    profile_id: 2
  },
  {
    id: 3,
    username: 'Técnico de Operação',
    email: 'tecnico.op@sgo.cgcf.gov.ao',
    password: 'siif2024',
    organization_id: 2,
    profile_id: 10 // Técnico de Operação
  },
  {
    id: 4,
    username: 'Usuario Padrão',
    email: 'padrao@sgo.cgcf.gov.ao',
    password: 'siif2024',
    organization_id: 2,
    profile_id: 4
  },
  {
    id: 5,
    username: 'Auditor Externo',
    email: 'auditor@sgo.cgcf.gov.ao',
    password: 'siif2024',
    organization_id: 2,
    profile_id: 5
  },
  {
    id: 6,
    username: 'Gestor CGCF',
    email: 'gestor.cgcf@sgo.gov.ao',
    password: 'siif2024',
    organization_id: 2,
    profile_id: 2 // gestor
  },
  {
    id: 7,
    username: 'Técnico de Sistema de Informação',
    email: 'tecnico.si@sgo.gov.ao',
    password: 'siif2024',
    organization_id: 2,
    profile_id: 3 // Técnico de Sistema de Informação
  },
  {
    id: 8,
    username: 'Padrão CGCF',
    email: 'padrao.cgcf@sgo.gov.ao',
    password: 'siif2024',
    organization_id: 2,
    profile_id: 4 // padrao
  },
  {
    id: 9,
    username: 'Consultor CGCF',
    email: 'consultor.cgcf@sgo.gov.ao',
    password: 'siif2024',
    organization_id: 2,
    profile_id: 5 // consultor
  }
];

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = (username: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        const foundUser = mockUsers.find(
          (u) => u.username === username && u.password === password
        );

        if (foundUser) {
          const organization = mockOrganizations.find(org => org.id === foundUser.organization_id);
          const profile = mockProfiles.find(p => p.id === foundUser.profile_id);
          
          if (organization && profile) {
              const { password, organization_id, profile_id, ...userToStore } = foundUser;
              const fullUser: User = {
                  ...userToStore,
                  organization,
                  profile
              };
              setUser(fullUser);
              setIsAuthenticated(true);
              resolve(true);
          } else {
              // Data integrity issue in mock data
              resolve(false);
          }
        } else {
          resolve(false);
        }
      }, 500);
    });
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user?.profile) return false;

    const userRole = user.profile.role;
    
    // "Administrador" has "Acesso total ao sistema"
    if (userRole === 'administrador') {
        return true;
    }
    
    return userRole === role;
  };

  const value = { user, isAuthenticated, hasRole, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};