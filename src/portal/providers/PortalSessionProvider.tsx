import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Session } from "../types/session";
import { login } from "@/services/portal/serviceLogin";
import { clearSession, loadSession, saveSession } from "@/services/portal/serviceSession";
import { toSession } from "../utils/toSession";

type PortalSessionContextValue = {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const PortalSessionContext = createContext<PortalSessionContextValue | null>(
  null,
);

export function PortalSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    async function restaurar() {
      try{
        const salva = await loadSession()
      setSession(salva)
      }finally{
        setLoading(false)
      }
    }
    restaurar()
  }, [])

  async function signIn(email: string, password: string) {
    const resposta = await login(email, password);
    const nova = toSession(resposta);
    await saveSession(nova);
    setSession(nova);
  }

  async function signOut() {
    await clearSession()
    setSession(null)
  }
  return (
    <PortalSessionContext.Provider
      value={{ session, loading, signIn, signOut }}
    >
      {children}
    </PortalSessionContext.Provider>
  );
}

export function usePortalSession() {
    const context = useContext(PortalSessionContext);
    if (!context) {
      throw new Error(
        "usePortalSession must be used within a PortalSessionProvider",
      );
    }
    return context;
}
