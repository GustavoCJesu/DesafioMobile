import axios  from 'axios';
import * as SecureStore from 'expo-secure-store'

export async function login(email: string, senha: string){
    try{
        const response = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/login`, {
        'email': email,
        'password': senha
    })
    await saveData(response.data)
    return response.data
    }catch(e){
        console.log('Error', e)
        throw e
    }
}

async function saveData(response: any) {
    try{
        await SecureStore.setItemAsync('auth_token', response.token)
        await SecureStore.setItemAsync('user_data', JSON.stringify(response.user))
        console.log(SecureStore.getItem('user_data'))
        return
    }catch(e){
        console.log('Erro ao tentar salvar o token de acesso')
        throw e
    }
    
}