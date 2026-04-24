import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ContactsProvider } from "./context/ContactContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ContactsProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "SyncUp", headerShown: false }} />
          <Stack.Screen name="social" options={{ title: "Social", headerShown: false }} />
          <Stack.Screen name="chat" options={{ title: "Chat", headerShown: false }} />
        </Stack>
      </ContactsProvider>
    </SafeAreaProvider>
  );
}
