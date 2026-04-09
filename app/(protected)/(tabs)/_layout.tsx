import AppHeader from "@/components/ui/header/AppHeader";
import { useAuthStore } from "@/store/auth";
import { useCartAnimation } from "@/store/cartAnimationContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

const TabsLayout = () => {
  const username = useAuthStore((s) => s.username);
  const { cartRef } = useCartAnimation();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <AppHeader username={username as string} />,
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 55,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 10,
        },

        tabBarActiveTintColor: "#ff6b4a",
        tabBarInactiveTintColor: "#9ca3af",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="order"
        options={{
          tabBarLabel: "Order",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          tabBarLabel: "Cart",
          tabBarIcon: ({ color, size }) => (
            <View ref={cartRef}>
              <Ionicons name="cart" size={size} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
