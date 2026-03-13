import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const initialCart = [
  {
    id: "1",
    name: "Pepperoni Pizza",
    restaurant: "Pizza Hut",
    price: 10,
    quantity: 1,
    image: "https://i.imgur.com/0umadnY.png",
  },
  {
    id: "2",
    name: "Burger Combo",
    restaurant: "McDonald's",
    price: 8.5,
    quantity: 2,
    image: "https://i.imgur.com/l49aYS3.png",
  },
];

const CartScreen = () => {
  const [cart, setCart] = useState(initialCart);

  const increase = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decrease = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const delivery = 2;

  const total = subtotal + delivery;

  return (
    <View className="flex-1 bg-gray-100 pt-14 px-5">
      {/* Header */}
      <Text className="text-2xl font-bold mb-6">Cart</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {cart.map((item) => (
          <View
            key={item.id}
            className="bg-white p-4 rounded-2xl flex-row items-center mb-4"
          >
            <Image
              source={{ uri: item.image }}
              className="w-16 h-16 rounded-xl"
            />

            <View className="flex-1 ml-4">
              <Text className="font-semibold">{item.name}</Text>
              <Text className="text-gray-400 text-sm">{item.restaurant}</Text>

              <Text className="font-bold mt-1">${item.price.toFixed(2)}</Text>
            </View>

            {/* Quantity */}
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => decrease(item.id)}
                className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
              >
                <Ionicons name="remove" size={16} />
              </TouchableOpacity>

              <Text className="mx-3">{item.quantity}</Text>

              <TouchableOpacity
                onPress={() => increase(item.id)}
                className="bg-orange-400 w-8 h-8 rounded-full items-center justify-center"
              >
                <Ionicons name="add" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Summary */}
      <View className="bg-white p-5 rounded-2xl">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500">Subtotal</Text>
          <Text>${subtotal.toFixed(2)}</Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500">Delivery</Text>
          <Text>${delivery.toFixed(2)}</Text>
        </View>

        <View className="flex-row justify-between mb-4">
          <Text className="font-bold">Total</Text>
          <Text className="font-bold">${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity className="bg-orange-400 py-4 rounded-xl items-center">
          <Text className="text-white font-semibold text-lg">Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;
