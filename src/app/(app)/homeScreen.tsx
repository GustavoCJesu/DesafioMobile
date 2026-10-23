import { View, Text } from "react-native";
import { globalStyles } from "@/styles/globalStyles";

export default function homeScreen(){
    return (
        <View style={globalStyles.container}>
            <Text>
                Essa é a tela Home
            </Text>
        </View>
    )
}