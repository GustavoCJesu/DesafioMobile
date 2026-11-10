import { Stack, Redirect, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import { UserProvider } from "@/Context/UserContext";
import { HardHat, Home, User, UserGroupIcon, UserRoundGroup } from "lucide-react-native";

export default function ProtectedLayout() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const home = <Home />;

  useEffect(() => {
    async function checkToken() {
      try {
        const savedToken = await SecureStore.getItemAsync("auth_token");
        setToken(savedToken);
      } finally {
        setLoading(false);
      }
    }

    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/(public)/loginScreen" />;
  }

  return (

    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let IconComponent = Home
          if (route.name === "homeScreen") {
            IconComponent = Home;
          }else if(route.name === 'employeeScreen'){
            IconComponent = UserRoundGroup
          }else if(route.name === 'epiScreen'){
            IconComponent = HardHat
          }

          return(
            <View style={{
                backgroundColor: focused ? '#cfd5ff' : 'transparent', 
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <IconComponent color={color} size={size} /> 
            </View>
          )
        },
        tabBarActiveTintColor: '#4b5ce3',
        headerShown: true
      })}
    >
      <Tabs.Screen name="homeScreen" options={{ title: "Início" }} />
      <Tabs.Screen
        name="employeeScreen"
        options={{ title: "Pessoas", headerShown: false }}
      />
      <Tabs.Screen
        name="epiScreen"
        options={{ title: "EPIs", headerShown: false }}
      />
    </Tabs>
  );
}
