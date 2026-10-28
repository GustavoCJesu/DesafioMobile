import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { episMock } from "@/mocks/epis";
import { Epi } from "@/types/epi";

// Trocar para false quando a rota GET /epis estiver pronta no backend
const USE_MOCK = true;

export async function listEpis(): Promise<Epi[]> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return episMock;
  }

  const token = await SecureStore.getItemAsync("auth_token");
  if (!token) {
    throw new Error("Sem token de acesso");
  }

  const response = await axios.get(`${process.env.EXPO_PUBLIC_BASE_URL}/epis`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  // Aceita tanto { data: [...] } (Laravel Resource) quanto [...]
  return response.data?.data ?? response.data;
}
