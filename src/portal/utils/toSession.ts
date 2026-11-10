import type { PortalLoginResponse, Session } from "@/portal/types/session";

export function toSession(response: PortalLoginResponse): Session {
  return {
    habilidades: response.habilidades,
    pessoa: response.pessoa,
    id_contrato: response.id_contrato,
    isSempher: response.isSempher,
    primeiro_acesso: response.primeiro_acesso,
    token: {
      value: response.token,
      expires_at: Date.parse(response.expires_at.replace(" ", "T")),
    },
  };
}
