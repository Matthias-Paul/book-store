 import { Ionicons } from "@expo/vector-icons";
import { View} from "react-native";



 
 const renderStar = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <View key={i} className="py-[1px] ">
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={16}
            color={i <= rating ? "#f4b400" : "#688f68"}
          />
        </View>
      );
    }
      return <View className="flex-row items-center">{stars}</View>;

  };

  export default renderStar;
