import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchBooks } from "../../utils/bookApi";
import renderItem from "../../components/renderItem";

export default function HomeTab() {
  const { loginUser } = useSelector((state) => state?.auth);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["books", loginUser?.token],
    queryFn: ({ pageParam = 1 }) =>
      fetchBooks({ pageParam, token: loginUser?.token }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
    enabled: !!loginUser?.token,
  });

  const books = data?.pages.flatMap((page) => page?.books) || [];

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#688f68" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4CAF50"]}
            tintColor={["#4CAF50"]}
          />
        }
        ListHeaderComponent={
          <View className="mt-5 items-center">
            <Text className="text-2xl text-primary font-bold mb-2">
              BookRec
            </Text>
            <Text className="text-base text-textSecondary text-center mb-2">
              Discover great reads from the community
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-textPrimary  text-[18px] mb-4 ">
              No recommendation yet!
            </Text>
            <Text className="text-textSecondary  text-base">
              Be the first to share a book!
            </Text>
          </View>
        }
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              size="small"
              color="#688f68"
              style={{ margin: 16 }}
            />
          ) : null
        }
      />
    </View>
  );
}
