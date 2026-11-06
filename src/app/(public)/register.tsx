import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Register(){

    const router = useRouter()

    return (
        <View>
            <Text>
                Tela de Registro
            </Text>
            <TouchableOpacity onPress={() =>{
                router.replace('/(public)/loginScreen')
            }}>
                <Text>
                    Voltar para Tela de login
                </Text>
            </TouchableOpacity>
        </View>
    );
}