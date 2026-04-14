import {
  useGetNotifications,
  useGetUnreadCount,
  useMarkAllAsRead,
  useMarkAsRead,
} from "@/apis/hooks/notification";
import { socket } from "@/utils/socket";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const NotificationScreen = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data, isLoading, refetch, isFetching } = useGetNotifications({
    page: 1,
    limit: 20,
  });

  const { data: unreadData } = useGetUnreadCount();

  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending } = useMarkAllAsRead();

  const notifications = data?.data || [];
  const unreadCount = unreadData?.data || 0;

  useEffect(() => {
    const handleNotification = () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-unread"] });
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, []);

  const handlePressItem = (item: any) => {
    if (!item.isRead) {
      markAsRead(item._id);
    }

    // if (item.type === "order" && item.data?.orderId) {
    //   router.push(`/order/${item.data.orderId}`);
    // }
  };

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => handlePressItem(item)}
        className={`p-4 mb-3 rounded-2xl ${
          item.isRead ? "bg-white" : "bg-orange-50"
        }`}
      >
        <View className="flex-row items-start gap-3">
          <View className="mt-1">
            <Ionicons
              name={
                item.type === "order"
                  ? "receipt-outline"
                  : item.type === "wallet"
                    ? "wallet-outline"
                    : "notifications-outline"
              }
              size={22}
              color="#ff6b4a"
            />
          </View>

          <View className="flex-1">
            <Text className="font-semibold text-gray-800">{item.title}</Text>

            <Text className="text-gray-500 mt-1">{item.message}</Text>

            <Text className="text-xs text-gray-400 mt-2">
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>

          {!item.isRead && (
            <View className="w-2 h-2 bg-red-500 rounded-full mt-2" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-orange-400 pt-12 pb-4 px-4">
        <View className="w-full items-center justify-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-0 px-2"
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-white">Notifications</Text>

          {unreadCount > 0 && (
            <TouchableOpacity
              disabled={isPending}
              onPress={() => markAllAsRead()}
              className="absolute right-0 px-2"
            >
              <Text className="text-white text-sm font-medium">Read all</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Ionicons name="notifications-off-outline" size={50} color="gray" />
            <Text className="text-gray-500 mt-3">No notifications yet</Text>
          </View>
        }
      />
    </View>
  );
};

export default NotificationScreen;
