import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logOutSuccess } from "../../redux/slice/authSlice.js";
import { useRouter } from "expo-router";
import { useState } from "react";
import { fetchUserBook } from "../../utils/bookApi.js";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import renderStar from "../../components/renderStar.jsx";
import { deleteBook } from "../../utils/bookApi.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorModal from "../../components/ErrorModal.jsx";

export default function ProfileTab() {
  const { loginUser } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const user = loginUser?.user;
  const token = loginUser?.token;
  const handleLogOut = async () => {
    try {
      dispatch(logOutSuccess());
      console.log("log out successfully");
      router.replace("/(auth)");
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading} = useQuery({
    queryKey: ["userBook", loginUser?.token],
    queryFn: ({ queryKey }) => fetchUserBook(queryKey[1]),
    enabled: !!loginUser?.token,
  });


  const deleteMutation = useMutation({
    mutationFn: ({ bookId }) => deleteBook(token, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries("userBook");
      setSelectedBook(null);
      console.log("Book deleted successfully");
    },
    onError: (data) => {
      console.log("Failed to delete book");
      setError(data.message);
    },
  });

  const handleDeleteProduct = (bookId) => {
      deleteMutation.mutate({ bookId });
   
  };

  const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  };

  function formatDateWithSuffix(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  }

  console.log("data", data);

 const renderBookItem = ({ item }) => (
  <View
    style={shadowStyle}
    className="flex-row bg-cardBackground rounded-lg p-3 mb-4 border border-border items-start"
  >
    <Image
      source={{ uri: item?.image }}
      className="w-[70px] h-[100px] rounded-[8px] mr-3"
      resizeMode="cover"
    />

    {/* Middle: Book Details */}
    <View className="flex-1">
      <Text
        className="text-[16px] font-bold capitalize mb-1 text-textPrimary"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item?.title}
      </Text>

      <View className="flex-row mb-2">{renderStar(item?.rating)}</View>

      <Text
        className="text-[14px] mb-1 text-textDark"
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item?.caption}
      </Text>

      <Text className="text-[12px] mb-1 text-textSecondary">
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>

    {/* Right: Trash Icon */}
    <Pressable
      style={shadowStyle}
      className="p-2 justify-center  ml-2"
        onPress={() => {
          setSelectedBook(item);
          setModalVisible(true);
        }}
    >
      <Ionicons name="trash-outline" size={20} color="#4CAF50" />
    </Pressable>

      
  </View>
);

  return (
    <>
      {/* Delete Confirmation Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/30 justify-center items-center">
          <View 
            className="w-[280px] bg-white rounded-xl items-center"
          >
            <View className="p-3 items-center">
              <Text className="text-lg font-semibold text-black mb-2">Delete Book</Text>
              <Text className="text-sm text-primary text-center mb-5">
                Are you sure you want to delete "{selectedBook?.title}"?
              </Text>
            </View>

            <View className="flex-row border-t border-gray-200 w-full">
              <Pressable 
                className="flex-1 py-3 items-center" 
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-textSecondary font-medium text-base">Cancel</Text>
              </Pressable>
              <View className="w-px bg-gray-200"></View>
              <Pressable 
                className="flex-1 py-3 items-center" 
                onPress={() => {
                  setModalVisible(false);
                  handleDeleteProduct(selectedBook?._id);
                  console.log("delete book", selectedBook?._id);
                }}
              >
                <Text className="text-red-500 font-medium text-base">Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <ErrorModal
        visible={!!error}
        message={error}
        onClose={() => setError("")}
      />

      <View className="flex-1 bg-background">
     

      <View className="p-4">
        {/* profile header */}
        <View
          style={shadowStyle}
          className="flex-row w-full items-center bg-cardBackground rounded-2xl p-4 mb-4 border border-border"
        >
          <Image
            source={{
              uri: "https://res.cloudinary.com/drkxtuaeg/image/upload/v1735897100/Image_4_jb0cpq.png",
            }}
            className="w-[80px] h-[80px] rounded-full mr-4"
          />

          <View className="flex-1">
            <Text className="text-[20px] font-[700] capitalize truncate mb-1 text-textPrimary">
              {user?.username}
            </Text>
            <Text className="text-[14px] capitalize truncate mb-1 text-textSecondary">
              {user?.email}
            </Text>
            <Text className="text-textSecondary text-3 truncate">
              Joined at {formatDateWithSuffix(user?.createdAt)}
            </Text>
          </View>
        </View>

        {/* log out button */}
        <Pressable
          style={shadowStyle}
          className="bg-primary w-full rounded-xl p-3 flex-row items-center justify-center mb-6"
          onPress={handleLogOut}
        >
          <Ionicons name="log-out-outline" size={20} color="#ffffff" />
          <Text className="ml-[6px] font-bold text-white">Logout</Text>
        </Pressable>

        {/* recommendations header */}
        <View className="flex-row justify-between mb-4 items-center w-full">
          <Text className="text-[18px] font-[700] text-textPrimary">
            Your Recommendations
          </Text>
          <Text className="text-[14px] text-textSecondary">
            {data?.books?.length || 0} Books
          </Text>
        </View>
      </View>

      {/* Book list */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#688f68" />
        </View>
      ) : (
        <FlatList
          data={data?.books || []}
          renderItem={renderBookItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-10 p-10">
              <Ionicons name="book-outline" size={50} color="#688f68" />
              <Text className="text-textPrimary text-[18px] mb-4">
                No recommendation yet!
              </Text>
              <Pressable
                onPress={() => router.push("/(tabs)/create")}
                style={[shadowStyle]}
                className="bg-primary w-full rounded-xl p-3 flex-row items-center justify-center"
              >
                <Text className="ml-[6px] font-bold text-white">
                  Add your first book
                </Text>
              </Pressable>
            </View>
          }
        />
      )}
    </View>
    </>
  );
}
