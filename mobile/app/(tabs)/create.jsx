import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useSelector } from "react-redux";
import ErrorModal from "../../components/ErrorModal";
import { postBook } from "../../utils/bookApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export default function CreateTab() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(null);
  const [error, setError] = useState("");

  const { loginUser } = useSelector((state) => state.auth);
  const router = useRouter();
  const queryClient = useQueryClient()

  const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  };

  const token = loginUser?.token;
  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        base64: false,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        const manipulated = await ImageManipulator.manipulateAsync(
          image.uri,
          [],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG } // force JPEG upload( convert all images to jpeg)
        );

        const formData = new FormData();
        formData.append("image", {
          uri: manipulated.uri,
          name: "upload.jpg",
          type: "image/jpeg",
        });

        setIsUploading(true);

        const res = await fetch(
          "https://book-store-59ah.onrender.com/api/upload",
          {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },

            body: formData,
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to upload");
          throw new Error(data.message || "Failed to upload");
        }

        setImage(data.imageUrl);

        console.log("Upload success:", data);
        return data;
      }
    } catch (error) {
      console.log("Upload error:", error);
      setError(error.message || "Failed to upload");
    } finally {
      setIsUploading(false);
    }
  };

  const postBookMutation = useMutation({
    mutationFn: ({ title, token, rating, image, caption }) =>
      postBook({ title, token, rating, image, caption }),
    onSuccess: (data) => {
      console.log("Book shared successfully:", data);
      queryClient.invalidateQueries("books")
      setCaption("");
      setImage("");
      setTitle("");
      setRating("");
      router.replace("/(tabs)");
    },
    onError: (err) => {
      console.log("Book upload failed:", err.message);
      setError(err.message);
    },
  });

  const handleShare = async () => {
    postBookMutation.mutate({ title, token, rating, image, caption });
  };

  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Pressable key={i} onPress={() => setRating(i)} className="p-2">
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : "#688f68"}
          />
        </Pressable>
      );
    }

    return (
      <View className="flex-row p-2 justify-around items-center rounded-lg border border-border bg-inputBackground">
        {stars}
      </View>
    );
  };

  return (
    <>
      <ErrorModal
        visible={!!error}
        message={error}
        onClose={() => setError("")}
      />

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        className="flex-1 justify-center items-center bg-background"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: "#e8f5e9",
            padding: 16,
          }}
          className="flex-1 bg-background"
        >
          <View
            style={shadowStyle}
            className=" bg-cardBackground rounded-xl p-5 my-4 border border-border  "
          >
            {/* Header */}
            <View className="mb-6 flex items-center">
              <Text className="text-[22px] text-center font-[700] mb-2 text-textPrimary">
                Add Book Recommendation
              </Text>
              <Text className="text-[14px] text-center text-textSecondary">
                Share your favourite reads with others{" "}
              </Text>
            </View>

            <View className="mb-[6px] ">
              {/* Title */}
              <View className="mb-5  ">
                <Text className="text-base font-semibold text-textPrimary mb-2 ">
                  {" "}
                  Book Title{" "}
                </Text>
                <View className="bg-inputBackground px-3 py-1 flex-row items-center  rounded-lg  border border-border   ">
                  <Ionicons
                    name="book-outline"
                    size={20}
                    color="#4CAF50"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    placeholder="Enter book title"
                    placeholderTextColor="#767676"
                    value={title}
                    onChangeText={setTitle}
                    autoCapitalize="none"
                    keyboardType="default"
                    className="flex-1 text-textPrimary mr-2 "
                  />
                </View>
              </View>

              {/* Rating */}
              <View className="mb-5">
                <Text className="text-base  font-semibold text-textPrimary mb-2 ">
                  {" "}
                  Your Rating{" "}
                </Text>
                {renderRatingPicker()}
              </View>

              {/* Book image */}
              <View className="mb-5">
                <Text className="text-base  font-semibold text-textPrimary mb-2 ">
                  {" "}
                  Book Image{" "}
                </Text>
                <Pressable
                  onPress={handleImageUpload}
                  disabled={isUploading}
                  className="w-full h-[250px] bg-inputBackground rounded-lg border border-border items-center justify-center"
                >
                  {isUploading ? (
                    <View className="absolute inset-0 rounded-lg bg-black/40 items-center justify-center">
                      <ActivityIndicator size="large" color="#fff" />
                      <Text className="text-white mt-2">Uploading...</Text>
                    </View>
                  ) : image ? (
                    <Image
                      source={{ uri: image }}
                      className="w-full rounded-lg h-full"
                    />
                  ) : (
                    <View className="items-center">
                      <Ionicons
                        name="image-outline"
                        size={40}
                        color="#688f68"
                      />
                      <Text className="mt-2 text-textSecondary">
                        Tap to select image
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>

              {/* Book caption */}
              <View className="mb-5">
                <Text className="text-base font-semibold text-textPrimary mb-2">
                  Book Caption
                </Text>

                <TextInput
                  placeholder="Write your review or thought about this book..."
                  placeholderTextColor="#767676"
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                  textAlignVertical="top"
                  className=" bg-inputBackground px-3 py-2 h-[100px] rounded-lg border border-border text-textPrimary"
                />
              </View>

              {/* Share button */}
              <TouchableOpacity
                disabled={postBookMutation.isPending}
                style={shadowStyle}
                activeOpacity={0.8}
                onPress={handleShare}
                className="bg-primary flex items-center justify-center rounded-lg mt-4 h-[50px]"
              >
                {postBookMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">Share</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
