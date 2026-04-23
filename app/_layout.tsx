import { Stack } from "expo-router";
import { ContactsProvider } from "./social";

export default function RootLayout() {
  return (
    <ContactsProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "SyncUp" }} />
        <Stack.Screen name="social" options={{ title: "Social" }} />
      </Stack>
    </ContactsProvider>
  );
}
