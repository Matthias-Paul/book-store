import { View, Text, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logOutSuccess } from "../../redux/slice/authSlice.js";
import { useRouter } from "expo-router";

export default function ProfileTab() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loginUser } = useSelector((state) => state.auth);

  const handleLogOut = async () => {
    try {
      dispatch(logOutSuccess());
      console.log("log out successfully");
      router.replace("/(auth)");
    } catch (error) {
      console.log(error);
    }
  };
  console.log(loginUser);

  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-3xl font-bold text-textPrimary mb-4">
        Your Profile
      </Text>
      <Text className="text-lg text-textSecondary text-center px-6">
        Manage your account and preferences
      </Text>
      <Pressable onPress={handleLogOut}>
        <Text> Log out </Text>
      </Pressable>
    </View>
  );
}
