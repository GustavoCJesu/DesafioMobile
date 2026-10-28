import axios from 'axios'
import * as SecureStore from 'expo-secure-store'


export async function index() {
    const token = SecureStore.getItem('auth_token')
    try{
        if(!token){
            return console.log('Sem token, ou token invalido')
        }
        const response = await axios.get(`${process.env.EXPO_PUBLIC_BASE_URL}/home`,{
            headers:{
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        })
        return response.data
    }catch(e){
        console.log(e)
    }
}