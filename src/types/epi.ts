export type EpiStatus = "active" | "inactive";

export type Epi = {
  id: number;
  name: string;
  ca: string;
  category: string;
  status: EpiStatus;
};
