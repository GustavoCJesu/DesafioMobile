export type EpiStatus = "active" | "inactive";

export type Epi = {
  id: number;
  name: string;
  /** Número do Certificado de Aprovação */
  ca: string;
  category: string;
  status: EpiStatus;
};
