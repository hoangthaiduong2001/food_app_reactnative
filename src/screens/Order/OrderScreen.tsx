import { useGetOrderByUserId } from "@/apis/hooks/order";
import { useAuthStore } from "@/store/auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { optionOrder } from "./const";

const OrderScreen = () => {
  const [status, setStatus] = useState("waiting");
  const userId = useAuthStore((state) => state.userId);
  const router = useRouter();
  const { data } = useGetOrderByUserId({
    id: userId as string,
    status: status,
  });

  const orders = data?.data || [];

  return (
    <View className="flex-1 bg-gray-100 pt-14 px-4">
      <Text className="text-2xl font-bold mb-6">My Orders</Text>

      <View className="flex-row mb-4 bg-gray-200 p-1 rounded-xl">
        {optionOrder.map((item) => {
          const isActive = status === item.value;

          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => setStatus(item.value)}
              className={`px-4 py-2 rounded-lg items-center mr-2 ${
                isActive ? "bg-white" : ""
              }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                elevation: 2,
              }}
            >
              <Text
                className={`text-sm font-medium ${
                  isActive ? "text-yellow-500" : "text-gray-500"
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {orders.map((order) => (
          <View
            key={order.id}
            className="bg-white p-4 rounded-2xl mb-4 shadow-sm"
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text className="font-semibold text-gray-800">
                Order #{order.id.slice(-6)}
              </Text>
            </View>

            <View className="flex-row items-start mb-2">
              <Ionicons name="location-outline" size={16} color="gray" />
              <Text className="text-gray-500 ml-2 flex-1">{order.address}</Text>
            </View>

            <View className="flex-row items-center mb-3">
              <Ionicons name="card-outline" size={16} color="gray" />
              <Text className="text-gray-500 ml-2">
                {order.paymentMethod === "cod" ? "Cash on Delivery" : "Wallet"}
              </Text>
            </View>

            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-lg font-bold text-orange-500">
                {order.totalPrice.toLocaleString()}đ
              </Text>

              <TouchableOpacity
                onPress={() => router.push(`/order/${order.id}`)}
                className="bg-orange-500 px-4 py-2 rounded-full"
              >
                <Text className="text-white text-sm font-medium">View</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {orders.length === 0 && (
          <View className="items-center mt-20">
            <Ionicons name="receipt-outline" size={50} color="gray" />
            <Text className="text-gray-400 mt-3">No orders yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default OrderScreen;
