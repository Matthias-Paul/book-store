import { View, Text } from "react-native";

export default function HomeTab() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-3xl font-bold text-textPrimary mb-4">
        Welcome to Book Store
      </Text>
      <Text className="text-lg text-textSecondary text-center px-6">
        Browse and discover amazing books in our collection
      </Text>
    </View>
  );
}
