import NetInfo from "@react-native-community/netinfo"
import { useEffect, useState } from "react"


export function useConexao() {
    const [online, setOnline] = useState(true)

    useEffect(() =>{
        const cancelar = NetInfo.addEventListener((state) => {
            setOnline(state.isConnected !== false)
        })

        return cancelar
    }, [])

    return online
}