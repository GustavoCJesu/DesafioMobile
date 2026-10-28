import { useCallback, useEffect, useState } from "react";
import { listEmployees } from "@/services/serviceEmployees";
import { Employee } from "@/types/employee";

const LOAD_ERROR = "Não foi possível carregar os funcionários.";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        const data = await listEmployees();
        if (!cancelled) setEmployees(data);
      } catch (e) {
        console.log("Erro ao carregar funcionários", e);
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
      const data = await listEmployees();
      setEmployees(data);
      setError(null);
    } catch (e) {
      console.log("Erro ao carregar funcionários", e);
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

  return { employees, loading, refreshing, error, refresh, retry };
}
