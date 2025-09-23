import { View, Text } from "react-native";

export default function CreateTab() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-3xl font-bold text-textPrimary mb-4">
        Create New Book
      </Text>
      <Text className="text-lg text-textSecondary text-center px-6">
        Add a new book to your collection
      </Text>
    </View>
  );
}
