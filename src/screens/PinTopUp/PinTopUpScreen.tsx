import { useTopupWallet } from "@/apis/hooks/wallet";
import { useAuthStore } from "@/store/auth";
import { showError, showSuccess } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const PinTopUpScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [pin, setPin] = useState("");
  const [failCount, setFailCount] = useState(0);

  const inputRef = useRef<TextInput>(null);

  const amount = Number(params.amount || 0);
  const isLocked = failCount >= 5;

  const { mutate: topupWallet } = useTopupWallet();
  const userId = useAuthStore((user) => user.userId);

  const handleSubmit = () => {
    if (pin.length !== 6 || isLocked) return;

    topupWallet(
      { userId: userId as string, amount, pin },
      {
        onSuccess: (data) => {
          showSuccess(data.message);
          setFailCount(0);
          router.replace("/wallet");
        },
        onError: () => {
          const newFail = failCount + 1;
          setFailCount(newFail);

          setPin("");
          inputRef.current?.focus();

          if (newFail >= 5) {
            showError("Too many failed attempts. Redirecting...");
            setTimeout(() => {
              router.replace("/wallet");
            }, 800);
          } else {
            showError(`Incorrect PIN (${newFail}/5)`);
          }
        },
      },
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-gray-100">
        <View className="bg-orange-400 pt-14 pb-6 px-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text className="text-white text-lg font-semibold ml-4">
            Enter PIN
          </Text>
        </View>

        <View className="flex-1 px-6 justify-center items-center">
          <View className="w-20 h-20 rounded-full bg-orange-100 items-center justify-center mb-6">
            <Ionicons name="lock-closed-outline" size={36} color="#f97316" />
          </View>

          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Confirm Payment
          </Text>

          <Text className="text-gray-500 mb-4 text-center">
            Enter your 6-digit PIN to continue
          </Text>

          <Text className="text-2xl font-bold text-orange-500 mb-6">
            {amount.toLocaleString()} đ
          </Text>

          {failCount > 0 && !isLocked && (
            <Text className="text-red-500 mb-3">
              Incorrect PIN ({failCount}/5)
            </Text>
          )}

          {isLocked && (
            <Text className="text-red-500 mb-3 text-center">
              Too many failed attempts. Please try again later.
            </Text>
          )}

          <TextInput
            ref={inputRef}
            value={pin}
            editable={!isLocked}
            onChangeText={(text) => setPin(text.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            autoFocus
            className={`border rounded-2xl p-4 text-center text-xl tracking-[10px] w-full ${
              isLocked ? "border-gray-200 bg-gray-100" : "border-gray-300"
            }`}
          />

          <Text className="text-gray-400 text-sm mt-3">
            Your PIN is secure 🔒
          </Text>
        </View>

        <View className="p-4 bg-white border-t border-gray-200">
          <TouchableOpacity
            disabled={pin.length !== 6 || isLocked}
            onPress={handleSubmit}
            className={`py-4 rounded-2xl items-center ${
              pin.length === 6 && !isLocked ? "bg-orange-500" : "bg-gray-300"
            }`}
          >
            <Text className="text-white font-bold text-lg">Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PinTopUpScreen;
