import { useCallback, useEffect, useState } from "react";
import { listEpis } from "@/services/serviceEpis";
import { Epi } from "@/types/epi";

const LOAD_ERROR = "Não foi possível carregar os EPIs.";

export function useEpis() {
  const [epis, setEpis] = useState<Epi[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        const data = await listEpis();
        if (!cancelled) setEpis(data);
      } catch (e) {
        console.log("Erro ao carregar EPIs", e);
        if (!cancelled) setError(LOAD_ERROR);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInitial();
    return () => {
      cancelled = true;
    };
  }, []);

  const reload = useCallback(async () => {
    try {
      const data = await listEpis();
      setEpis(data);
      setError(null);
    } catch (e) {
      console.log("Erro ao carregar EPIs", e);
      setError(LOAD_ERROR);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }, [reload]);

  const retry = useCallback(async () => {
    setLoading(true);
    await reload();
    setLoading(false);
  }, [reload]);

  return { epis, loading, refreshing, error, refresh, retry };
}
