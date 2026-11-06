export type Session = {
  habilidades: string[];
  pessoa: Pessoa;
  id_contrato: number;
  isSempher: boolean;
  token: AuthToken;
  primeiro_acesso: number;
};

export type PortalLoginResponse = Omit<Session, "token"> & {
  token: string;
  expires_at: string;
};

export type AuthToken = {
  value: string;
  expires_at: number;
};

export type Pessoa = {
  nome: string;
  avatar: string | null;
  matricula: string;
  tipoUsuario: string;
  supervisor: unknown;
  grupo: Grupo;
  funcao: Funcao;
  area: unknown;
  setor: Setor;
  regimeTrabalho: unknown;
  empresa: Empresa;
  id_pessoa: number;
  email: string;
};

type Grupo = {
  id: number;
  nome: string;
};

type Funcao = {
  id: number;
  nome: string;
};

type Setor = {
  id: number;
  titulo: string;
};

type Empresa = {
  id: number;
  nome: string;
};
