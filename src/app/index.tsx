import * as Device from "expo-device";
import { Platform, StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, useRouter } from "expo-router";

import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";

import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const  token =  SecureStore.getItem("auth_token");

  useEffect(()=>{
    if (token) {
    router.replace("/(protected)/homeScreen");
  } else {
    router.replace("/(protected)/homeScreen");
  }
  }, [token, router])

  return null
  
}
