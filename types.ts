export type UserRole = 
  | 'administrador' 
  | 'tecnico_si' 
  | 'coordenador_central' 
  | 'secretario_central'           
  | 'coordenador_operacional_central' 
  | 'tecnico_operacional_central'
  | 'coordenador_utl_regional'     
  | 'gestor_operacao_provincial'    
  | 'tecnico_operacao_provincial';  

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
  province?: string; 
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
  province?: string; // Novo campo para filtragem regional
  priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  opStatus: 'Pendente' | 'Em Curso' | 'Concluída' | 'Pausada'; 
  status: 'Pendente' | 'Aguardando Aprovação' | 'Aguardando Visto Físico' | 'Protocolado'; 
  
  createdDate: string;
  reference: string;
  operationPeriod: string;
  
  coordGeral: string;
  responsabilidades: Array<{ cargo: string; nome: string }>;
  
  suporteLogistico: string;
  orgaosExecutores: string;
  
  antecedentes: string;
  objetivos: string;
  alvos: string;
  accoesControlo: string;
  indicadoresDesempenho: string;
  equipaOperativa: Array<{ nome: string; cargo: string; unidade: string; acao: string }>;
  areaAccoes: string;
  postoComando: string;
  estrategiaActuacao: string;
  constituicaoGrupos: string;
  mapaCabimentacao: string;
  logisticaDetalhe: string;
  distribuicao: string;

  signedDocument?: {
    fileName: string;
    uploadDate: string;
    url: string;
  };

  respOperacional?: string;
  coordGeralAdjTecnica?: string;
  respTecnicoOperacional?: string;
  coordTecnicoOperacional?: string;
  respTecnicoOperacionalAdj?: string;
  coordOperacional?: string;
  apoioLogistica?: string;
  apoioCooperacaoInstitucional?: string;
  recursosHumanos?: string;
}