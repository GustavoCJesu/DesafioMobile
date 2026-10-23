import axios  from 'axios';

export async function login(email: string, senha: string){
    console.log(email, senha)

    try{
        const response = await axios.post('http://127.0.0.1:8000/api/login', {
        'email': email,
        'password': senha
    })
    console.log(response.data)
    return response.data
    }catch(e){
        console.log('Error', e)
        throw e
    }
}