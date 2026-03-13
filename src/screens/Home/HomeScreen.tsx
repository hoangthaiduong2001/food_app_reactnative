import { useGetProductsTopRating } from "@/apis/hooks/product";
import { IUser } from "@/types/user";
import { getUser } from "@/utils/tokenStorage";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SpecialOfferCarousel from "./component/SpecialOfferCarousel";

const pizzas = [
  {
    id: 1,
    name: "Pepperoni Pizza",
    time: "20min",
    rating: 4.5,
    price: "$10.00",
    image: "https://i.imgur.com/0umadnY.png",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    time: "30min",
    rating: 4.6,
    price: "$8.00",
    image: "https://i.imgur.com/l49aYS3.png",
  },
];

const HomeScreen = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const { data: dataTopRating } = useGetProductsTopRating();

  useEffect(() => {
    const loadUser = async () => {
      const data = await getUser();
      setUser(data);
    };

    loadUser();
  }, []);
  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false} className="px-5 pt-14">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-gray-400 text-sm">Welcome back 👋</Text>

            <View className="flex-row items-center">
              <Text className="font-semibold text-lg">
                {user?.username || "Guest"}
              </Text>
            </View>
          </View>

          <View className="bg-white p-2 rounded-full shadow">
            <Ionicons name="notifications-outline" size={20} />
          </View>
        </View>

        <View className="flex-row items-center bg-white rounded-full px-4 py-3 mb-5">
          <Ionicons name="search" size={18} color="gray" />
          <TextInput
            placeholder="Search your favourite pizza"
            className="ml-2 flex-1"
          />
          <Feather name="sliders" size={18} color="gray" />
        </View>

        <SpecialOfferCarousel data={dataTopRating ?? []} />

        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold">Popular Pizza</Text>
          <Text className="text-orange-400">See All</Text>
        </View>

        {/* Filters */}
        <View className="flex-row mb-4">
          <TouchableOpacity className="bg-orange-400 px-4 py-2 rounded-full mr-2">
            <Text className="text-white">All Pizzas</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full mr-2">
            <Text>Vegetarian</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full">
            <Text>Specials</Text>
          </TouchableOpacity>
        </View>

        {/* Pizza List */}
        {pizzas.map((pizza) => (
          <View
            key={pizza.id}
            className="bg-white p-4 rounded-2xl flex-row items-center mb-4 shadow"
          >
            <Image
              source={{ uri: pizza.image }}
              className="w-20 h-20 rounded-full"
            />

            <View className="flex-1 ml-4">
              <Text className="font-semibold">{pizza.name}</Text>

              <Text className="text-gray-400 text-sm">
                Offer valid today only
              </Text>

              <View className="flex-row items-center mt-1">
                <Text className="text-gray-400">{pizza.time}</Text>
                <Text className="ml-3">⭐ {pizza.rating}</Text>
              </View>

              <Text className="font-bold mt-1">{pizza.price}</Text>
            </View>

            <TouchableOpacity className="bg-black w-8 h-8 rounded-full items-center justify-center">
              <Text className="text-white text-lg">+</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
