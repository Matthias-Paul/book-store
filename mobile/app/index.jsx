import { Text, View } from "react-native";
import "./global.css";
import { Link } from "expo-router";

export default function Index() {
  return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-3xl text-center text-placeholderText">
          Edit index.jsx to edit this screen.
        </Text>
        <Link href="/(auth)/signup">Go to sign up page</Link>
        <Link href="/(auth)">Go to login page</Link>
      </View>
  );
}
