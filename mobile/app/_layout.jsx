import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { store, persistor } from "../redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Regular": require("../assets/fonts/JetBrainsMono-Regular.ttf"),
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
    "JetBrainsMono-Bold": require("../assets/fonts/JetBrainsMono-Bold.ttf"),
    "JetBrainsMono-ExtraBold": require("../assets/fonts/JetBrainsMono-ExtraBold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#688f68" />
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SafeScreen>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />

              </Stack>
              <StatusBar style="dark" />
            </SafeScreen>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
