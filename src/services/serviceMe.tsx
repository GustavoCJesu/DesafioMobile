import axios from "axios";
import * as SecureStore from "expo-secure-store";

export async function me() {
  try {
    const token = SecureStore.getItem("auth_token");
    if (!token) {
      return console.log('Sem token de acesso')
    }
    
    const response = await axios.get(`${process.env.EXPO_PUBLIC_BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    console.log(response.data)
    return response.data
  } catch (e) {
    console.log("Erro rota /me", e);
    return
  }
}
