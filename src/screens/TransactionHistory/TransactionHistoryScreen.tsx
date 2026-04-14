import { useGetTransactionHistory } from "@/apis/hooks/transaction";
import { useAuthStore } from "@/store/auth";
import { formatDate } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TransactionHistoryScreen = () => {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetTransactionHistory({ id: userId as string });

  const transactions = data?.pages?.flatMap((page) => page.data) ?? [];

  const getIcon = (type: string) => {
    switch (type) {
      case "topup":
        return { name: "arrow-down-circle", color: "#16a34a" };
      case "payment":
        return { name: "arrow-up-circle", color: "#ef4444" };
      case "refund":
        return { name: "refresh-circle", color: "#3b82f6" };
      default:
        return { name: "help-circle", color: "#9ca3af" };
    }
  };

  const formatAmount = (type: string, amount: number) => {
    if (type === "topup" || type === "refund") {
      return `+${amount.toLocaleString()}đ`;
    }
    return `-${amount.toLocaleString()}đ`;
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
      <View className="bg-orange-400 pt-12 pb-4 px-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text className="text-white text-lg font-semibold">
          Transaction History
        </Text>

        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => {
          const icon = getIcon(item.type);

          return (
            <View className="flex-row items-center bg-white p-4 rounded-2xl mb-3">
              {/* Icon */}
              <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                <Ionicons
                  name={icon.name as any}
                  size={22}
                  color={icon.color}
                />
              </View>

              <View className="flex-1 ml-3">
                <Text className="font-medium text-gray-800 capitalize">
                  {item.type}
                </Text>

                <Text className="text-gray-400 text-xs mt-1">
                  {formatDate(item.createdAt)}
                </Text>
              </View>

              <Text
                className={`font-semibold ${
                  item.type === "payment" ? "text-red-500" : "text-green-600"
                }`}
              >
                {formatAmount(item.type, item.amount)}
              </Text>
            </View>
          );
        }}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Ionicons name="receipt-outline" size={50} color="#9ca3af" />
            <Text className="text-gray-400 mt-3">No transactions yet</Text>
          </View>
        }
      />
    </View>
  );
};

export default TransactionHistoryScreen;
