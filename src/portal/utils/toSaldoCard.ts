import { SaldoEpiCardData } from "../mocks/saldoEpis";
import { SaldoEpi } from "../types/saldo";

export function toSaldoCard({produto, qtd_disponivel}: SaldoEpi):SaldoEpiCardData{
    return{
        id: produto.id,
        categoria: produto.categorias.nome,
        nome: produto.nome,
        ca: String(produto.ca),
        caValidade: "",
        caVenceEmDias: null,
        vidaUtilDias: 0,
        disponivel: qtd_disponivel,
        limite: produto.permissao[0]?.quantidade_maxima ?? 0,
        unidade: produto.unidade_medida.nome.toLowerCase(),
        tamanhos: produto.filhos.map((filho)=>({
            tamanho: (filho.variacoes?.descricao ?? "").replace(/^Varia[çc][ãa]o\s/i, "") || "-",
            estoque: Array.isArray(filho.estoque) ? 0 : filho.estoque.quantidade_atual,
        }))
    }
}