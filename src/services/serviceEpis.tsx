import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { episMock } from "@/mocks/epis";
import { Epi } from "@/types/epi";

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

  return response.data?.data ?? response.data;
}
