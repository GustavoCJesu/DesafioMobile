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
    flex:{
        flex: 1
    },
    pm:{
        padding: 20
    },
    ps:{
        padding: 10
    },
    iconp:{
        padding: 8
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
        borderColor: 'rgb(0,0,0,0.1)',
        borderRadius: 10,
        flex: 1,
        margin: 5,
    },
    border: {
        borderWidth: 1,
        borderColor: 'rgb(0,0,0,0.1)',
        borderRadius: 10,
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
    },
    span:{
        backgroundColor: 'rgb(255,255,255,0.2)',
        color: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 100
    },
    alertSpan:{
        backgroundColor: '#fae2a7',
        color: '#BA8E23',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 100
    }
})