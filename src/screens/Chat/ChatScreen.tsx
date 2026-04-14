import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useCreateConversation, useGetMessages } from "@/apis/hooks/chat";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/auth";

const ChatScreen = () => {
  const router = useRouter();

  const { conversationId: paramConversationId, username } =
    useLocalSearchParams();

  const userId = useAuthStore((s) => s.userId);
  const socket = useSocket();

  const flatListRef = useRef<FlatList>(null);

  const [conversationId, setConversationId] = useState<string>(
    (paramConversationId as string) || "",
  );

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const { mutateAsync: createConversation } = useCreateConversation();

  const { data } = useGetMessages(conversationId);

  useEffect(() => {
    const init = async () => {
      if (conversationId) return;

      try {
        const res = await createConversation({
          receiverId: paramConversationId as string,
        });

        const id = res.data?._id;

        setConversationId(id);
      } catch (err) {
        console.log("create conversation error:", err);
      }
    };

    if (paramConversationId) init();
  }, [paramConversationId]);

  useEffect(() => {
    if (data?.data) {
      setMessages(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (!conversationId) return;

    socket.emit("joinConversation", conversationId);

    const handleMessage = (msg: any) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handleMessage);

    return () => {
      socket.off("newMessage", handleMessage);
    };
  }, [conversationId]);

  const handleSend = () => {
    if (!text.trim() || !conversationId || !userId) return;

    socket.emit("sendMessage", {
      conversationId,
      senderId: userId,
      receiverId: paramConversationId,
      text,
    });

    setText("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <View className="flex-1 bg-white pt-12">
      <View className="flex-row items-center justify-between px-4 pb-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.push("/(protected)/(tabs)/chat")}
        >
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>

        <Text className="text-lg text-center flex-1 font-semibold">
          {username || "Chat"}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => {
          const isUser = item.senderId === userId;

          return (
            <View
              className={`mb-3 max-w-[75%] p-3 rounded-2xl ${
                isUser ? "bg-orange-400 self-end" : "bg-gray-200 self-start"
              }`}
            >
              <Text className={isUser ? "text-white" : "text-black"}>
                {item.text}
              </Text>
            </View>
          );
        }}
      />

      <View className="flex-row items-center px-4 py-3 border-t border-gray-200">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2"
        />

        <TouchableOpacity
          onPress={handleSend}
          className="ml-3 bg-orange-400 p-3 rounded-full"
        >
          <Ionicons name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
