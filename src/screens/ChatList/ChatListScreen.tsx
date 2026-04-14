import { useCreateConversation, useGetChatUsers } from "@/apis/hooks/chat";
import { ChatUserType } from "@/types/chat";
import { socket } from "@/utils/socket";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

const ChatListScreen = () => {
  const router = useRouter();

  const { data } = useGetChatUsers();
  const { mutateAsync: createConversation } = useCreateConversation();

  const users = data?.data || [];

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});

  const sortedUsers = [...users].sort((a, b) => {
    const aOnline = onlineUsers.includes(a._id);
    const bOnline = onlineUsers.includes(b._id);

    if (aOnline === bOnline) return 0;
    return aOnline ? -1 : 1;
  });

  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  useEffect(() => {
    const handleAlert = (data: any) => {
      setUnreadMap((prev) => {
        const current = prev[data.senderId] || 0;

        return {
          ...prev,
          [data.senderId]: current + 1,
        };
      });
    };

    socket.on("newMessageAlert", handleAlert);

    return () => {
      socket.off("newMessageAlert", handleAlert);
    };
  }, []);

  useEffect(() => {
    const handleUpdate = (data: any) => {
      setUnreadMap((prev) => {
        const current = prev[data.senderId] || 0;

        return {
          ...prev,
          [data.senderId]: current + 1,
        };
      });
    };

    socket.on("conversation:updated", handleUpdate);

    return () => {
      socket.off("conversation:updated", handleUpdate);
    };
  }, []);

  useEffect(() => {
    socket.on("newMessageAlert", (data) => {
      setUnreadMap((prev) => {
        const current = prev[data.senderId] || 0;
        return {
          ...prev,
          [data.senderId]: current + 1,
        };
      });
    });

    return () => {
      socket.off("newMessageAlert");
    };
  }, []);

  const handleSelectUser = async (user: ChatUserType) => {
    const res = await createConversation({
      receiverId: user._id,
    });

    const conversationId = res.data._id;

    setUnreadMap((prev) => ({
      ...prev,
      [user._id]: 0,
    }));

    router.push({
      pathname: "/chat/[conversationId]",
      params: {
        conversationId,
        username: user.username,
      },
    });
  };

  return (
    <View className="flex-1 bg-white pt-12 px-4">
      <Text className="text-xl font-bold mb-4">Chats</Text>

      <FlatList
        data={sortedUsers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const isOnline = onlineUsers.includes(item._id);
          const unread = unreadMap[item._id] || 0;

          return (
            <TouchableOpacity
              onPress={() => handleSelectUser(item)}
              className="flex-row items-center p-4 border-b border-gray-200"
            >
              <View className="relative">
                <Image
                  source={{ uri: item.img }}
                  className="w-12 h-12 rounded-full"
                />

                <View
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-lg font-semibold">{item.username}</Text>

                <Text className="text-gray-400 text-sm">
                  {isOnline ? "Online" : "Offline"}
                </Text>
              </View>

              {unread > 0 && (
                <View className="bg-red-500 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs">{unread}</Text>
                </View>
              )}

              <Ionicons name="chevron-forward" size={18} color="#aaa" />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default ChatListScreen;
