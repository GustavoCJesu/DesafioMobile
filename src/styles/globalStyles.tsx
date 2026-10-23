import {
    Container
} from "lucide-react-native"
import {
    StyleSheet
} from "react-native"


export const globalStyles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    pm:{
        padding: 20
    },
    ps:{
        padding: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    column:{
        flexDirection: 'column',
        alignItems: 'baseline',
        justifyContent: 'flex-start'
    },
    box:{
        borderWidth: 1,
        borderColor: 'black',
        padding: 5,
        borderRadius: 10,
        color: '#fff',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Necessário para o Android
    },
    input:{
        borderWidth: 1,
        borderColor: '#4b5ce3'
    }
})