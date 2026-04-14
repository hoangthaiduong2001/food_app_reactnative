import { useGetTransactionRecent } from "@/apis/hooks/transaction";
import { useGetBalance } from "@/apis/hooks/wallet";
import { useAuthStore } from "@/store/auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const WalletScreen = () => {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);

  const { data: dataBalance } = useGetBalance({ id: userId as string });
  const { data: dataTransactionRecent } = useGetTransactionRecent({
    id: userId as string,
  });

  const transactions = dataTransactionRecent?.data || [];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const getAmountStyle = (type: string) => {
    if (type === "topup" || type === "refund") {
      return {
        color: "text-green-600",
        prefix: "+",
      };
    }

    return {
      color: "text-red-500",
      prefix: "-",
    };
  };

  const getTitle = (type: string) => {
    switch (type) {
      case "topup":
        return "Top Up";
      case "payment":
        return "Order Payment";
      case "refund":
        return "Refund";
      default:
        return "Transaction";
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-orange-300 pt-12 pb-4 px-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.push("/")}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>

        <Text className="text-lg font-semibold">Wallet</Text>

        <View style={{ width: 22 }} />
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        <View className="bg-orange-500 rounded-2xl p-5 mb-4">
          <Text className="text-white text-sm">Your Balance</Text>
          <Text className="text-white text-2xl font-bold mt-1">
            {dataBalance?.data.balance.toLocaleString()} đ
          </Text>
        </View>

        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity
            className="flex-1 bg-white p-4 rounded-2xl items-center"
            onPress={() => router.push("/(protected)/topup")}
          >
            <Ionicons name="add-circle-outline" size={24} color="#f97316" />
            <Text className="mt-2 text-gray-700">Top Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-white p-4 rounded-2xl items-center"
            onPress={() => router.push("/(protected)/transactionHistory")}
          >
            <Ionicons name="time-outline" size={24} color="#f97316" />
            <Text className="mt-2 text-gray-700">History</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-2xl p-4">
          <Text className="font-semibold text-base mb-3">
            Recent Transactions
          </Text>

          {transactions.length === 0 ? (
            <Text className="text-gray-400 text-center py-6">
              No transactions yet
            </Text>
          ) : (
            transactions.map((item) => {
              const { color, prefix } = getAmountStyle(item.type);

              return (
                <View
                  key={item.id}
                  className="flex-row justify-between items-center mb-4"
                >
                  <View>
                    <Text className="font-medium">{getTitle(item.type)}</Text>
                    <Text className="text-gray-400 text-xs">
                      {formatDate(item.createdAt)}
                    </Text>
                  </View>

                  <Text className={`${color} font-semibold`}>
                    {prefix}
                    {item.amount.toLocaleString()}đ
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default WalletScreen;
