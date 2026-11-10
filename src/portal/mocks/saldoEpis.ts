export type TamanhoEstoque = {
  tamanho: string;
  estoque: number;
};

export type SaldoEpiCardData = {
  id: number;
  categoria: string;
  nome: string;
  ca: string;
  disponivel: number;
  limite: number;
  unidade: string;
  tamanhos: TamanhoEstoque[];
};