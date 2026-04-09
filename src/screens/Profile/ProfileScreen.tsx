import { useLogoutMutation } from "@/apis/hooks/auth";
import { useAuthStore } from "@/store/auth";
import { getRefreshToken } from "@/utils/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;

type MenuItem = {
  title: string;
  icon: IconName;
};

const menu: MenuItem[] = [
  { title: "My Orders", icon: "receipt-outline" },
  { title: "Favorite Foods", icon: "heart-outline" },
  { title: "Delivery Address", icon: "location-outline" },
  { title: "Payment Methods", icon: "card-outline" },
  { title: "Settings", icon: "settings-outline" },
  { title: "Help Center", icon: "help-circle-outline" },
];

const ProfileScreen = () => {
  const { setToken, logout } = useAuthStore.getState();
  const { mutate } = useLogoutMutation();

  const handleLogout = async () => {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      setToken("");
      return;
    }
    mutate(
      { refreshToken },
      {
        onSuccess: (data) => {
          setToken("");
          logout();
        },
        onError: () => {
          setToken("");
        },
      },
    );
  };
  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="bg-orange-400 pt-16 pb-10 items-center">
        <Image
          source={{
            uri: "https://i.pravatar.cc/150?img=3",
          }}
          className="w-24 h-24 rounded-full border-4 border-white"
        />

        <Text className="text-white text-xl font-bold mt-3">Dragon Slayer</Text>

        <Text className="text-white/80">dragon@email.com</Text>
      </View>

      <View className="bg-white rounded-t-3xl p-5 -mt-6">
        {menu.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center py-4 border-b border-gray-100"
          >
            <Ionicons name={item.icon} size={22} color="#ff6b4a" />

            <Text className="ml-4 flex-1 text-gray-700">{item.title}</Text>

            <Ionicons name="chevron-forward" size={18} color="gray" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          className="bg-red-500 py-4 rounded-xl mt-6 items-center"
          onPress={handleLogout}
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
