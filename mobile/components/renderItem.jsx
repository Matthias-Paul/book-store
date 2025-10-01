import { View, Text, Image } from "react-native";

import renderStar from "./renderStar";

const shadowStyle = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3.84,
  elevation: 5,
};

function formatDateWithSuffix(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}

const renderItem = ({ item }) => (
  <View
    style={shadowStyle}
    className="bg-cardBackground rounded-2xl mt-5 p-4 border border-border"
  >
    <View className="flex-row  items-center mb-3">
      <Image
        source={{
          uri: "https://res.cloudinary.com/drkxtuaeg/image/upload/v1735897100/Image_4_jb0cpq.png",
        }}
        className="w-[36px] h-[36px]  rounded-full mr-2"
      />
      <Text className="text-textPrimary capitalize w-full  text-base font-bold">
        {item?.user?.username}
      </Text>
    </View>

    <View className="w-full h-[250px] overflow-hidden rounded-lg mb-3 border border-border">
      <Image
        source={{ uri: item?.image }}
        resizeMode="cover"
        className="w-full h-full"
      />
    </View>

    <View className="py-3  ">
      <Text className="text-textPrimary capitalize w-full  text-[18px] mb-[6px] font-[700]">
        {item?.title}
      </Text>
      <Text className="flex-row mb-2  "> {renderStar(item?.rating)} </Text>
      <Text className="text-textDark w-full  text-[14px] mb-[8px] ">
        {item?.caption}
      </Text>
      <Text className="text-textDark w-full text-[14px] mb-[8px] ">
        Shared on {formatDateWithSuffix(item?.createdAt)}
      </Text>
    </View>
  </View>
);
export default renderItem;
