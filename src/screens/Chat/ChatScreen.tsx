import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const initialMessages = [
  { id: "1", text: "Hello, your order is on the way 🚚", sender: "shop" },
  { id: "2", text: "Great, thank you!", sender: "user" },
];

const ChatScreen = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
    };

    setMessages([...messages, newMessage]);
    setText("");
  };

  return (
    <View className="flex-1 bg-white pt-12">
      <View className="flex-row items-center justify-between px-4 pb-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <Ionicons name="arrow-back" size={22} />
          <Text className="ml-3 text-lg font-semibold">Pizza Hut</Text>
        </View>

        <Ionicons name="call-outline" size={22} />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const isUser = item.sender === "user";

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

      {/* Input */}
      <View className="flex-row items-center px-4 py-3 border-t border-gray-200">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2"
        />

        <TouchableOpacity
          onPress={sendMessage}
          className="ml-3 bg-orange-400 p-3 rounded-full"
        >
          <Ionicons name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
