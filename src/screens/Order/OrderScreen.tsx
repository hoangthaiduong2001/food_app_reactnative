import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const orders = [
  {
    id: 1,
    name: "Pepperoni Pizza",
    restaurant: "Pizza Hut",
    status: "Preparing",
    price: "$10.00",
    image: "https://i.imgur.com/0umadnY.png",
  },
  {
    id: 2,
    name: "Burger Combo",
    restaurant: "McDonald's",
    status: "Delivered",
    price: "$8.50",
    image: "https://i.imgur.com/l49aYS3.png",
  },
];

const OrdersScreen = () => {
  return (
    <View className="flex-1 bg-gray-100 pt-14 px-5">
      <Text className="text-2xl font-bold mb-6">Orders</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {orders.map((order) => (
          <View
            key={order.id}
            className="bg-white p-4 rounded-2xl flex-row items-center mb-4 shadow-sm"
          >
            <Image
              source={{ uri: order.image }}
              className="w-16 h-16 rounded-xl"
            />

            <View className="flex-1 ml-4">
              <Text className="font-semibold text-base">{order.name}</Text>

              <Text className="text-gray-400 text-sm">{order.restaurant}</Text>

              <View className="flex-row items-center mt-1">
                <Ionicons name="time-outline" size={14} color="gray" />
                <Text className="text-gray-400 ml-1 text-sm">
                  {order.status}
                </Text>
              </View>

              <Text className="font-bold mt-1">{order.price}</Text>
            </View>

            <TouchableOpacity className="bg-orange-400 px-4 py-2 rounded-full">
              <Text className="text-white text-sm">Track</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default OrdersScreen;
