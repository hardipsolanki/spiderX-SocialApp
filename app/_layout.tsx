import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
export default function RootLayout() {
  return (
    <>
      <Toast />
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(root)/index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
