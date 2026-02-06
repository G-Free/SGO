import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";
import {
  User,
  UserRole,
  AuthContextType,
  Organization,
  Profile,
} from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockOrganizations: Organization[] = [
  { id: 1, name: "SGA - Sociedade Gestora de Aeroportos" },
  { id: 2, name: "CGCF - Comité de Gestão Coordenada de Fronteiras" },
];

const mockProfiles: Profile[] = [
  {
    id: 1,
    name: "Administrador do System",
    role: "administrador",
    description: "Gestão técnica total.",
  },
  {
    id: 2,
    name: "Coordenador Central",
    role: "coordenador_central",
    description:
      "Autoridade superior nacional. Acesso exclusivo para monitorização tática.",
  },
  {
    id: 3,
    name: "Coordenador Operacional Central",
    role: "coordenador_operacional_central",
    description: "Supervisão operacional nacional e aprovações.",
  },
  {
    id: 4,
    name: "Técnico Central Operacional",
    role: "tecnico_operacional_central",
    description: "Execução técnica central.",
  },
  {
    id: 5,
    name: "Técnico de SI",
    role: "tecnico_si",
    description: "Suporte técnico de TI.",
  },
  {
    id: 6,
    name: "Coordenador da UTL Regional",
    role: "coordenador_utl_regional",
    description: "Supervisão Provincial.",
  },
  {
    id: 7,
    name: "Gestor de Operação Provincial",
    role: "gestor_operacao_provincial",
    description: "Tático Regional.",
  },
  {
    id: 8,
    name: "Técnico de Operação Regional",
    role: "tecnico_operacao_provincial",
    description: "Base Regional.",
  },
];

const mockUsers: (Omit<User, "organization" | "profile"> & {
  password: string;
  organization_id: number;
  profile_id: number;
  province?: string;
})[] = [
  {
    id: 1,
    username: "GeigerCarlos",
    email: "glcarlos@cgcf.gov.ao",
    password: "siif2024",
    organization_id: 1,
    profile_id: 1,
  },
  {
    id: 2,
    username: "Coordenador_Central",
    email: "coordenadorcentral@cgcf.gov.ao",
    password: "siif2024",
    organization_id: 2,
    profile_id: 3,
  },
  {
    id: 3,
    username: "CoordLuanda",
    email: "coord.luanda@cgcf.gov.ao",
    password: "siif2024",
    organization_id: 2,
    profile_id: 6,
    province: "Luanda",
  },
  {
    id: 7,
    username: "Secretariado_Central",
    email: "SecretariadoCentral@cgcf.gov.ao",
    password: "siif2024",
    organization_id: 2,
    profile_id: 2,
  }, // NOVO USUÁRIO PCA
  {
    id: 4,
    username: "GestorCabinda",
    email: "gestor.cabinda@cgcf.gov.ao",
    password: "siif2024",
    organization_id: 2,
    profile_id: 7,
    province: "Cabinda",
  },
  {
    id: 5,
    username: "TecnicoZaire",
    email: "tecnico.zaire@cgcf.gov.ao",
    password: "siif2024",
    organization_id: 2,
    profile_id: 8,
    province: "Zaire",
  },
  {
    id: 6,
    username: "TecnicoCentral",
    email: "tecnico.central@cgcf.gov.ao",
    password: "siif2024",
    organization_id: 2,
    profile_id: 4,
  },
];

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = (username: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(
          (u) =>
            (u.username === username || u.email === username) &&
            u.password === password,
        );

        if (foundUser) {
          const organization = mockOrganizations.find(
            (org) => org.id === foundUser.organization_id,
          );
          const profile = mockProfiles.find(
            (p) => p.id === foundUser.profile_id,
          );

          if (organization && profile) {
            const {
              password: _,
              organization_id: __,
              profile_id: ___,
              ...userToStore
            } = foundUser as any;
            const fullUser: User = {
              ...userToStore,
              organization,
              profile,
              province: foundUser.province,
            };
            setUser(fullUser);
            setIsAuthenticated(true);
            resolve(true);
          } else {
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
    // Administrador tem acesso a tudo
    if (userRole === "administrador") return true;
    // Verificação estrita
    return userRole === role;
  };

  const value = { user, isAuthenticated, hasRole, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
