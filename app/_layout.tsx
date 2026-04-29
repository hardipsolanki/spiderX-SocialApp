import { store } from "@/store";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(root)/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="(root)/interests"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(root)/allCompleted"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </Provider>
  );
}
