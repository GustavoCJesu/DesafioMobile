import { StyleSheet } from "react-native"

export const typography = StyleSheet.create({
    bigFont:{
        fontWeight: 'bold',
        fontSize: 50,
    },
    h1:{
        fontSize: 31,
        fontWeight: 'bold'
    },
    h2:{
        fontSize: 25,
        fontWeight: 'bold'
    },
    h3:{
        fontSize: 18,
        fontWeight: '400'
    },
    p:{
        fontSize: 15,
        fontWeight: "300"
    },
    bold:{
        fontWeight: 'bold'
    },
    error:{
        color: '#ef4444'
    },
    fontFamily:{
        fontFamily: 'Roboto'
    },
    primary:{
        color: '#4b5ce3'
    },
    secundary:{
        color: '#0f172a'
    },
    tertiary:{
        color: '#475569'
    }
})