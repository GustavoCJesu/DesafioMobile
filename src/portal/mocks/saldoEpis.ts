export type TamanhoEstoque = {
  /** Ex.: "P", "M", "G", "GG" ou numeração de calçado */
  tamanho: string;
  /** Quantidade disponível no equipamento (locker/dispenser). 0 = sem estoque */
  estoque: number;
};

export type SaldoEpiCardData = {
  id: number;
  /** Categoria do EPI, exibida em verde acima do nome */
  categoria: string;
  nome: string;
  /** Número do Certificado de Aprovação */
  ca: string;
  /** Validade do CA já formatada (dd/mm/aaaa) */
  caValidade: string;
  /** Dias até o CA vencer. Se for 60 ou menos, o CA aparece em alerta (laranja) */
  caVenceEmDias: number | null;
  /** Vida útil do EPI, em dias */
  vidaUtilDias: number;
  /** Quantidade que o colaborador ainda pode retirar neste período */
  disponivel: number;
  /** Limite de retirada por período */
  limite: number;
  /** Unidade da quantidade: "pares", "un." etc. */
  unidade: string;
  /** Estoque por tamanho. Vazio quando o EPI não tem tamanhos */
  tamanhos: TamanhoEstoque[];
};

export const saldoEpisMock: SaldoEpiCardData[] = [
  {
    id: 1,
    categoria: "Luva de grafeno",
    nome: "Luva para proteção contra agentes térmicos e mecânicos",
    ca: "42000",
    caValidade: "16/07/2028",
    caVenceEmDias: 600,
    vidaUtilDias: 15,
    disponivel: 1000,
    limite: 1000,
    unidade: "pares",
    tamanhos: [
      { tamanho: "G", estoque: 5 },
      { tamanho: "GG", estoque: 0 },
    ],
  },
  {
    id: 2,
    categoria: "Proteção respiratória",
    nome: "Máscara respiratória PFF2 sem válvula",
    ca: "223606",
    caValidade: "10/12/2026",
    caVenceEmDias: 43,
    vidaUtilDias: 1,
    disponivel: 10,
    limite: 10,
    unidade: "un.",
    tamanhos: [],
  },
  {
    id: 3,
    categoria: "Proteção auditiva",
    nome: "Protetor auricular tipo plug",
    ca: "255255",
    caValidade: "03/05/2027",
    caVenceEmDias: 187,
    vidaUtilDias: 30,
    disponivel: 4,
    limite: 6,
    unidade: "pares",
    tamanhos: [],
  },
  {
    id: 4,
    categoria: "Proteção ocular",
    nome: "Óculos de proteção incolor",
    ca: "161803",
    caValidade: "21/09/2027",
    caVenceEmDias: 327,
    vidaUtilDias: 90,
    disponivel: 1,
    limite: 2,
    unidade: "un.",
    tamanhos: [],
  },
  {
    id: 5,
    categoria: "Proteção das mãos",
    nome: "Luva nitrílica",
    ca: "187421",
    caValidade: "08/02/2028",
    caVenceEmDias: 468,
    vidaUtilDias: 7,
    disponivel: 0,
    limite: 4,
    unidade: "pares",
    tamanhos: [
      { tamanho: "M", estoque: 0 },
      { tamanho: "G", estoque: 0 },
    ],
  },
];
