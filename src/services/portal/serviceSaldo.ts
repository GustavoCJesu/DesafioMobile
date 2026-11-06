import axios from "axios";
import { SaldoEpisResponse } from "@/portal/types/saldo";

export async function buscarSaldoEpis(
  token: string,
  idEmpresa: number,
  matricula: string,
): Promise<SaldoEpisResponse> {
  const baseURL = process.env.EXPO_PUBLIC_STW_BASE_URL;

  const response = await axios.post<SaldoEpisResponse>(
    `${baseURL}/pessoas/buscarEpi`,
    { id_empresa: idEmpresa, matricula },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
}
