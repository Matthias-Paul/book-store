import {
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  Image,
  TextInput,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import Toast from "react-native-root-toast";
import { signInSuccess } from "../../redux/slice/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { fetchLoginApi } from "../../utils/authApi.js";
import ErrorModal from "../../components/ErrorModal.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();

  const { loginUser } = useSelector((state) => state.auth);

  console.log(loginUser)

  const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  };

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => fetchLoginApi({ email, password }),
    onSuccess: (data) => {
      dispatch(signInSuccess(data));
      console.log("Login success:", data);
      setEmail("");
      setPassword("");
    },
    onError: (err) => {
      console.log("Login failed:", err.message);
      setErrorMessage(err.message);
    },
  });

  const handleLogin = () => {
    loginMutation.mutate({ email, password });
  };

  return (
    <>
      <ErrorModal
        visible={!!errorMessage}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        className="flex-1   "
      >
        <View className="flex-1 bg-background p-4 items-center justify-center ">
          <View className="flex items-center justify-center w-full ">
            <Image
              source={require("../../assets/images/books.png")}
              className="w-full h-60 mb-8  "
              resizeMode="cover"
            />
          </View>
          <View
            className="bg-cardBackground w-full rounded-lg p-5 border border-border"
            style={shadowStyle}
          >
            <View className=" mb-4 ">
              <View className="mb-5  ">
                <Text className="text-base font-semibold text-textPrimary mb-2 ">
                  {" "}
                  Email{" "}
                </Text>
                <View className="bg-inputBackground px-3 py-1 flex-row items-center  rounded-lg  border border-border   ">
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#4CAF50"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#767676"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="flex-1 text-textPrimary mr-2 "
                  />
                </View>
              </View>

              <View className="mb-5  ">
                <Text className="text-base font-semibold text-textPrimary mb-2 ">
                  {" "}
                  Password{" "}
                </Text>
                <View className="bg-inputBackground px-3 py-1 flex-row items-center  rounded-lg  border border-border   ">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#4CAF50"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#767676"
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    keyboardType="default"
                    className="flex-1 text-textPrimary mr-2 "
                    secureTextEntry={!showPassword}
                  />

                  <Pressable
                    className=" "
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#4CAF50"
                      style={{ marginRight: 10 }}
                    />
                  </Pressable>
                </View>
              </View>

              <TouchableOpacity
                disabled={loginMutation.isPending}
                style={shadowStyle}
                activeOpacity={0.8}
                onPress={handleLogin}
                className="bg-primary flex items-center justify-center rounded-lg mt-4 h-[50px]"
              >
                {loginMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">Login</Text>
                )}
              </TouchableOpacity>

              <View className="mt-6 flex-row justify-center  ">
                <Text className="text-textSecondary mr-1 ">
                  Don&#39;t have an account?
                </Text>
                <Pressable>
                  <Link href="/(auth)/signup">
                    <Text className="font-bold text-primary   ">
                      Sign up
                    </Text>{" "}
                  </Link>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default Login;
