import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AMOUNTS = [10000, 20000, 50000, 100000, 200000, 500000];

const TopUpScreen = () => {
  const router = useRouter();

  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const finalAmount = customAmount ? Number(customAmount) : amount || 0;
  const isValidAmount = finalAmount > 0;
  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-orange-300 pt-12 pb-4 px-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>

        <Text className="text-lg font-semibold">Top Up</Text>

        <View style={{ width: 22 }} />
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="font-semibold mb-3">Choose Amount</Text>

          <View className="flex-row flex-wrap gap-3">
            {AMOUNTS.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setAmount(item);
                  setCustomAmount("");
                }}
                className={`px-4 py-3 rounded-xl border ${
                  amount === item
                    ? "bg-orange-500 border-orange-500"
                    : "border-gray-200"
                }`}
              >
                <Text
                  className={`font-medium ${
                    amount === item ? "text-white" : "text-gray-700"
                  }`}
                >
                  {item.toLocaleString()}đ
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="font-semibold mb-2">Or Enter Amount</Text>

          <TextInput
            value={customAmount}
            onChangeText={(text) => {
              setCustomAmount(text.replace(/[^0-9]/g, ""));
              setAmount(null);
            }}
            keyboardType="numeric"
            placeholder="Enter amount..."
            placeholderTextColor="#9CA3AF"
            className="border border-gray-300 rounded-xl p-3"
          />

          {!isValidAmount && (
            <Text className="text-red-400 text-sm mt-2">
              Please enter amount before scanning QR
            </Text>
          )}
        </View>

        <View className="bg-white rounded-2xl p-4 mb-6">
          <Text className="font-semibold mb-3">Payment Method</Text>

          <TouchableOpacity
            disabled={!isValidAmount}
            onPress={() => {
              if (!isValidAmount) return;

              router.push({
                pathname: "/(protected)/scanQR",
                params: {
                  amount: finalAmount,
                },
              });
            }}
            activeOpacity={isValidAmount ? 0.7 : 1}
            className={`flex-row items-center justify-between p-3 border rounded-xl ${
              isValidAmount
                ? "border-gray-200 bg-white"
                : "border-gray-200 bg-gray-100 opacity-50"
            }`}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="qr-code-outline" size={20} color="#f97316" />
              <Text>VNPay (Scan QR)</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default TopUpScreen;
