export function tempoDesde(desde: number, agora:number){
    const min = Math.floor((agora - desde) / 60000)
    if(min < 1) return "agora"
    if(min < 60) return `há ${min} min`
    const horas = Math.floor(min / 60)
    if (horas < 24) return `há ${horas} h`
    return `há ${Math.floor(horas / 24)} d`
}

export function formatarDataHora(ms: number) {
    return new Date(ms).toLocaleString("pt-BR", {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}