import { View, Text } from "react-native";

export default function ProfileTab() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-3xl font-bold text-textPrimary mb-4">
        Your Profile
      </Text>
      <Text className="text-lg text-textSecondary text-center px-6">
        Manage your account and preferences
      </Text>
    </View>
  );
}
