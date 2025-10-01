import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import { View, ActivityIndicator } from "react-native";
import "./global.css";

export default function Index() {
  const { loginUser } = useSelector((state) => state.auth);

  // Show loading indicator while Redux Persist is rehydrating
  if (loginUser === undefined) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (loginUser) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)" />;
}
