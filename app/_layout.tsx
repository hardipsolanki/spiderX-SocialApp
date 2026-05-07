import { persistor, store } from "@/store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <Stack>
              <Stack.Screen
                name="(root)/index"
                options={{ headerShown: false }}
              />
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
                name="(root)/chat/[uid]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(root)/invitationSucess"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(root)/call"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
        <Toast />
      </PersistGate>
    </Provider>
  );
}
