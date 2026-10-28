import { Stack } from 'expo-router';
import { UserProvider } from '../Context/UserContext';
import { HeaderShownContext } from 'expo-router/build/react-navigation/index.js';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{headerShown: false}} />
    </UserProvider>
  );
}