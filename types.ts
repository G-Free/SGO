
export type UserRole = 
  | 'administrador' 
  | 'tecnico_si' 
  | 'coordenador_central' 
  | 'coordenador_operacional_central' 
  | 'tecnico_operacional_central'
  | 'coordenador_utl_regional'     // 📍 Supervisão Regional
  | 'gestor_operacao_provincial'    // 🛠 Tático Regional
  | 'tecnico_operacao_provincial';  // 🔧 Base Regional

export interface Organization {
    id: number;
    name: string;
}

export interface Profile {
    id: number;
    name: string; 
    role: UserRole;
    description: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  organization: Organization;
  profile: Profile;
  province?: string; // Campo opcional para perfis regionais
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface ServiceOrder {
  id: string;
  title: string;
  status: 'Pendente' | 'Em Curso' | 'Pausada' | 'Concluída';
  priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  createdDate: string;
  
  // Official Document Fields (UTC Modelo)
  reference: string;
  operationPeriod: string;
  
  // Comando e Responsabilidade
  coordGeral: string;
  coordGeralAdjTecnica: string;
  coordTecnicoOperacional: string;
  coordOperacional: string;
  respOperacional: string;
  respTecnicoOperacional: string;
  respTecnicoOperacionalAdj: string;
  
  // Apoio
  apoioLogistica: string;
  apoioCooperacaoInstitucional: string;
  orgaosExecutores: string;
  
  // Sections 01-12
  antecedentes: string;
  objetivos: string;
  alvos: string;
  accoesControlo: string;
  indicadoresDesempenho: string;
  recursosHumanos: string;
  areaAccoes: string;
  postoComando: string;
  estrategiaActuacao: string;
  constituicaoGrupos: string;
  mapaCabimentacao: string;
  logisticaDetalhe: string;
  distribuicao: string;
}
