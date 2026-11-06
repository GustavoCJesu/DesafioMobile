export type Categorias = {
  id: number;
  nome: string;
  quantidade_maxima?: number;
};
export type Unidade_Medida = {
  id: number;
  nome: string;
};

export type Variacao = {
  id: number;
  id_contrato: number;
  tipo: string;
  descricao: string | null;
};

export type Estoque = {
  id: number;
  id_estoque: number;
  id_empresa: number;
  id_produto: number;
  quantidade_minima: number;
  quantidade_maxima: number;
  quantidade_atual: number;
  ponto_compra: number;
  status: number;
  created_at: string;
  updated_at: string;
};

export type Permissao = {
  id: number;
  id_produto: number;
  id_grupo: number;
  quantidade_maxima: number;
  info_categoria: number;
  id_categoria: number;
  periodo: number;
};

export type Filhos = {
  id: number;
  id_referencia: number;
  nome: string;
  cod_externo: string | null;
  status: number;
  id_categoria: number;
  id_unidadeMedida: number;
  id_variacao: number;
  categorias: Categorias;
  unidade_medida: Unidade_Medida;
  variacoes: Variacao;
  estoque: Estoque | [];
};

export type Produto = {
    id: number
    nome: string
    ca: number
    status: number
    id_empresa: number
    id_categoria: number
    id_unidadeMedida: number
    cod_externo: string | null
    id_variacao: number | null
    categorias: Categorias
    unidade_medida: Unidade_Medida
    filhos: Filhos[]
    permissao: Permissao[]
};

export type SaldoEpi = {
    produto: Produto
    qtd_disponivel: number
}

export type SaldoEpisResponse = {
    saldo_epis: SaldoEpi[]
}
