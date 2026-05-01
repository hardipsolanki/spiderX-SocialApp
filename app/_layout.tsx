import { persistor, store } from "@/store";
import { Stack } from "expo-router";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <Stack>
          <Stack.Screen name="(root)/index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(root)/interests"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(root)/allCompleted"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(root)/userProfile/[uid]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(root)/invitationSucess"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </PersistGate>
    </Provider>
  );
}
