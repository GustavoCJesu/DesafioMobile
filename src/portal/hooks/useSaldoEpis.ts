import { useEffect, useState } from "react";
import { usePortalSession } from "../providers/PortalSessionProvider";
import { SaldoEpiCardData } from "../mocks/saldoEpis";
import { toSaldoCard } from "../utils/toSaldoCard";
import { buscarSaldoEpis } from "@/services/portal/serviceSaldo";
import { lerSaldo, saveSaldo } from "@/services/portal/serviceSaldoCache";
import { useConexao } from "./useConexao";

export function useSaldoEpis() {
  const online = useConexao();
  const [tentativa, setTentativa] = useState(0);
  const { session } = usePortalSession();
  const [saldo, setSaldo] = useState<SaldoEpiCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [atualizadoEm, setAtualizadoEm] = useState<number | null>(null);

  useEffect(() => {
    if (!session) return;
    let cancelado = false;

    async function carregar() {
      if (!session) return;
      try {
        // throw new Error("Teste Offline")
        const resposta = await buscarSaldoEpis(
          session.token.value,
          session.pessoa.empresa.id,
          session.pessoa.matricula,
        );

        const itens = resposta.saldo_epis.map(toSaldoCard);

        saveSaldo(session.pessoa.matricula, itens).catch((e) => {
          console.log("falha ao salvar o cache do saldo", e);
        });

        if (!cancelado) {
          setSaldo(itens);
          setOffline(false);
          setAtualizadoEm(Date.now());
          setErro(null);
        }
      } catch {
        const salvo = await lerSaldo(session.pessoa.matricula).catch(
          () => null,
        );

        if (!cancelado) {
          if (salvo) {
            setSaldo(salvo.itens);
            setOffline(true);
            setAtualizadoEm(salvo.atualizadoEm);
          } else {
            setErro("Sem conexão e nenhum saldo salvo neste aparelho.");
          }
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [session, tentativa, online]);

  function recarregar() {
    setLoading(true);
    setErro(null);
    setTentativa((t) => t + 1);
  }

  return { saldo, loading, erro, offline, atualizadoEm, recarregar };
}
