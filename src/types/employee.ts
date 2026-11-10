export type EmployeeStatus = "active" | "inactive";

export type Employee = {
  id: number;
  name: string;
  role: string;
  sector: string;
  registration: string;
  cpf: string;
  admissionDate: string;
  status: EmployeeStatus;
};
