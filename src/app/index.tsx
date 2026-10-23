import * as Device from "expo-device";
import { Platform, StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";

import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";



export default function index() {
  return (
    <Redirect href={'/(auth)/loginScreen'} />
  );
}
