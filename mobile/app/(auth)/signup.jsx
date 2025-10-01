import {
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { fetchSignUpApi } from "../../utils/authApi";
import { useMutation } from "@tanstack/react-query";
import ErrorModal from "../../components/ErrorModal";
import { signInSuccess } from "../../redux/slice/authSlice.js";
import { useDispatch } from "react-redux";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  };

  const signupMutation = useMutation({
    mutationFn: ({ username, email, password }) =>
      fetchSignUpApi({ username, email, password }),
    onSuccess: (data) => {
      dispatch(signInSuccess(data));
      console.log("Sign up success:", data);
      setUsername("");
      setEmail("");
      setPassword("");
    },
    onError: (err) => {
      console.log("sign up failed:", err.message);
      setErrorMessage(err.message);
    },
  });

  const handleSignup = () => {
    signupMutation.mutate({ username, email, password });
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
        keyboardVerticalOffset={Platform.OS === "ios" ? "100" : 0}
        className="flex-1"
      >
        <View className="flex-1 bg-background p-4 items-center justify-center ">
          <View
            className="bg-cardBackground w-full rounded-xl p-5 border border-border"
            style={shadowStyle}
          >
            <View className=" mb-4 ">
              <View className=" mb-6 flex items-center ">
                <Text className="text-[32px] mb-2 text-primary    ">
                  {" "}
                  BookRec{" "}
                </Text>
                <Text className="text-4 mb-2 text-textSecondary  ">
                  {" "}
                  Share your favourite reads{" "}
                </Text>
              </View>

              <View className="mb-5 ">
                <Text className="text-base font-semibold text-textPrimary mb-2 ">
                  {" "}
                  Username{" "}
                </Text>
                <View className="bg-inputBackground px-3 py-1 flex-row items-center  rounded-lg  border border-border   ">
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#4CAF50"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    placeholder="Enter your username"
                    placeholderTextColor="#767676"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoComplete="false"
                    keyboardType="default"
                    className="flex-1 text-textPrimary mr-2 "
                  />
                </View>
              </View>

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
                disabled={signupMutation.isPending}
                style={shadowStyle}
                activeOpacity={0.8}
                onPress={handleSignup}
                className="bg-primary flex items-center justify-center rounded-lg mt-4 h-[50px]"
              >
                {signupMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Sign Up
                  </Text>
                )}
              </TouchableOpacity>

              <View className="mt-6 flex-row justify-center  ">
                <Text className="text-textSecondary mr-1 ">
                  Already have an account?
                </Text>
                <Pressable>
                  <Link href="/">
                    <Text className="font-bold text-primary   ">
                      Log in
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

export default Signup;
