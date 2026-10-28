import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { employeesMock } from "@/mocks/employees";
import { Employee } from "@/types/employee";

// Trocar para false quando a rota GET /employees estiver pronta no backend
const USE_MOCK = true;

export async function listEmployees(): Promise<Employee[]> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return employeesMock;
  }

  const token = await SecureStore.getItemAsync("auth_token");
  if (!token) {
    throw new Error("Sem token de acesso");
  }

  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_BASE_URL}/employees`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );

  // Aceita tanto { data: [...] } (Laravel Resource) quanto [...]
  return response.data?.data ?? response.data;
}
