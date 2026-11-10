import { AuthToken, Session } from "@/portal/types/session";
import * as SecureStore from "expo-secure-store";
import Storage from "expo-sqlite/kv-store";

const TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";
const USER_AVATAR_KEY = "user_avatar";

export async function saveSession(session: Session): Promise<void> {
  const { token, ...perfil } = session;
  const { avatar, ...pessoa } = perfil.pessoa;

  await Storage.setItem(USER_DATA_KEY, JSON.stringify({ ...perfil, pessoa }));

  if (avatar) {
    await Storage.setItem(USER_AVATAR_KEY, JSON.stringify(avatar));
  } else {
    await Storage.removeItem(USER_AVATAR_KEY);
  }

  await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(token));
}
export async function loadSession(): Promise<Session | null> {

  const userData = await Storage.getItem(USER_DATA_KEY);
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  
  if (!userData || !token) {
    return null;
  }
  
  try {
    const perfil: Omit<Session, 'token'> = JSON.parse(userData);
    const parsedToken: AuthToken = JSON.parse(token)

    if(Number.isNaN(parsedToken.expires_at) || parsedToken.expires_at < Date.now()){
      await clearSession()
      return null
    }

    const avatarData = await Storage.getItem(USER_AVATAR_KEY)
    const avatar = avatarData ? JSON.parse(avatarData) : null

    return {
      ...perfil, pessoa: {...perfil.pessoa, avatar},
      token: parsedToken
    }

  }catch{
    await clearSession()
    return null
  }

}

export async function clearSession(): Promise<void> {
  await Promise.allSettled([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    Storage.removeItem(USER_DATA_KEY),
    Storage.removeItem(USER_AVATAR_KEY),
  ]);
}
