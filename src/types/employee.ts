export type EmployeeStatus = "active" | "inactive";

export type Employee = {
  id: number;
  name: string;
  role: string;
  sector: string;
  registration: string;
  cpf: string;
  /** Data de admissão no formato ISO (YYYY-MM-DD) */
  admissionDate: string;
  status: EmployeeStatus;
};
