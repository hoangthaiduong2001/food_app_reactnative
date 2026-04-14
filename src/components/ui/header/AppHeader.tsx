import { useGetUnreadCount } from "@/apis/hooks/notification";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/auth";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const AppHeader = ({ username }: { username: string | undefined }) => {
  const router = useRouter();
  const hasWallet = useAuthStore((state) => state.hasWallet);
  const userId = useAuthStore((state) => state.userId);

  const queryClient = useQueryClient();

  const { data } = useGetUnreadCount();
  const unreadCount = data?.data || 0;

  const socket = useSocket();

  useEffect(() => {
    if (!userId) return;

    socket.connect();

    socket.emit("join", userId);

    socket.on("notification", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-unread"] });
    });

    return () => {
      socket.off("notification");
    };
  }, [userId]);

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 12,
        backgroundColor: "#f97316",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text style={{ fontSize: 13, color: "#fff" }}>Welcome back 👋</Text>

          <Text
            style={{
              fontWeight: "700",
              fontSize: 20,
              color: "#fff",
            }}
          >
            {username || "Guest"}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={() => {
              if (!hasWallet) {
                router.replace("/createWallet");
              } else {
                router.replace("/wallet");
              }
            }}
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 999,
            }}
          >
            <Ionicons name="wallet-outline" size={20} color="#f97316" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/notification")}
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 999,
              position: "relative",
            }}
          >
            <Ionicons name="notifications-outline" size={20} color="#f97316" />

            {unreadCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  backgroundColor: "red",
                  borderRadius: 999,
                  minWidth: 18,
                  height: 18,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 4,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AppHeader;
