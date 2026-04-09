import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useSearchProduct } from "@/apis/hooks/product";
import Loading from "@/components/Loading";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "expo-router";

const SearchBox = () => {
  const router = useRouter();
  const [text, setText] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  const debounced = useDebounce(text, 400);
  const { data = [], isLoading } = useSearchProduct(debounced);

  return (
    <View className="px-4" pointerEvents="box-none">
      <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 my-3 shadow border border-gray-100 ">
        <Ionicons name="search" size={18} color="#9CA3AF" />

        <TextInput
          placeholder="Search food..."
          value={text}
          onChangeText={setText}
          placeholderTextColor="#9CA3AF"
          className="ml-2 flex-1 text-base"
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />

        {text.length > 0 && (
          <TouchableOpacity onPress={() => setText("")}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {isFocus && text.length > 0 && (
        <View className="absolute top-16 left-4 right-4 bg-white rounded-2xl shadow-lg z-50 border border-gray-100 max-h-48 overflow-hidden">
          {isLoading ? (
            <View className="py-6 items-center">
              <Loading type="dots" />
            </View>
          ) : data.length === 0 ? (
            <View className="items-center justify-center py-6">
              <Text className="text-gray-400">
                No results for &quot;{debounced}&quot;
              </Text>
            </View>
          ) : (
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={data}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    router.push(`/product/${item.id}`);
                    setIsFocus(false);
                    setText("");
                  }}
                  className="flex-row items-center p-3 border-b border-gray-100"
                >
                  <Image
                    source={{ uri: item.img }}
                    className="w-10 h-10 rounded-lg"
                  />
                  <View className="ml-3">
                    <Text className="font-medium">{item.title}</Text>
                    <Text className="text-gray-400 text-sm">${item.price}</Text>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default SearchBox;
