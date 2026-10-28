import { me } from "@/services/serviceMe";
import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
    user: any;
    setUser: (User: any) => void
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({children}: {children: React.ReactNode}){
    const [user, setUser] = useState<any>(null)
    useEffect(()=>{
        async function inicializaUsuario() {
            const dados = await me()
            if(dados) setUser(dados)
        }
        inicializaUsuario()
    }, [])

    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser(){
    const context = useContext(UserContext)

    if(!context){
        throw new Error('useUser deve ser usado dentro de um UserProvider')
    }

    return context
}