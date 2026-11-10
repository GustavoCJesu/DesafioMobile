import { PortalLoginResponse } from "@/portal/types/session";
import axios from "axios";

export async function login(email: string, senha: string) {
  const baseURL = process.env.EXPO_PUBLIC_STW_BASE_URL;

  try {
    const response = await axios.post<PortalLoginResponse>(`${baseURL}/login`, {
      email: email,
      senha: senha,
      device_name: "Teste-Gustavo",
      device_type: "Teste-Gustavo",
    });

    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (!e.response) {
        throw new Error("Sem conexão. Verifique sua internet");
      }
      if (e.response.status === 401 || e.response.status === 422) {
        throw new Error("Email ou senha inválidos");
      }
      if (e.response.status >= 500) {
        throw new Error("Servidor indisponivel. Tente novamente mais tarde.");
      }
    }

    throw new Error("Não foi possível entrar. Tente novamente.");
  }
}
