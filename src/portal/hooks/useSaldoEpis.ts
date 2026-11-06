import { useEffect, useState } from "react";
import { usePortalSession } from "../providers/PortalSessionProvider";
import { SaldoEpiCardData } from "../mocks/saldoEpis";
import { toSaldoCard } from "../utils/toSaldoCard";
import { buscarSaldoEpis } from "@/services/portal/serviceSaldo";

export function useSaldoEpis() {
  const { session } = usePortalSession();
  const [saldo, setSaldo] = useState<SaldoEpiCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    let cancelado = false;

    async function carregar() {
      if (!session) return;
      try {
        const resposta = await buscarSaldoEpis(
          session.token.value,
          session.pessoa.empresa.id,
          session.pessoa.matricula,
        );

        if (!cancelado) setSaldo(resposta.saldo_epis.map(toSaldoCard));
      } catch (e) {
        console.log("Erro no hook", e);
        if (!cancelado) setErro("Não foi possivel carregar o saldo.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [session]);

  return { saldo, loading, erro };
}
