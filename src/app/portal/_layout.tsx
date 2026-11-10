import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { PortalSessionProvider, usePortalSession } from "@/portal/providers/PortalSessionProvider";

function PortalStack() {
  const {session, loading} = usePortalSession()
  if(loading) return null
  return (
    <Stack screenOptions={{headerShown: false}} >
      <Stack.Protected guard={!session}>
        <Stack.Screen name="login"/>
      </Stack.Protected>
      
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="saldo"/>
      </Stack.Protected>
    </Stack>
  )
}

export default function PortalLayout() {
  return (
    <PortalSessionProvider>
      <StatusBar style="light" />
      <PortalStack />
    </PortalSessionProvider>
  );
}
