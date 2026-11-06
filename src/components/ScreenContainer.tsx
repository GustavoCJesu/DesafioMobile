import { StyleSheet, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Importe daqui!
import { ScreenContainerProps } from "react-native-screens";

//Import gradients
import { gradients } from "../styles/gradientList";
import { LinearGradient } from "expo-linear-gradient";

export default function ScreenContainer({ children }: ScreenContainerProps) {
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#34518b",
  },
  content: {
    flex: 1,
  },
});
