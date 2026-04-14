import { useCreateWalletMutation } from "@/apis/hooks/wallet";
import { useAuthStore } from "@/store/auth";
import { showError, showSuccess } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const CreateWalletScreen = () => {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const { mutate: createWalletMutation } = useCreateWalletMutation();

  const confirmRef = useRef<TextInput>(null);

  const isValid = pin.length === 6 && confirmPin === pin;

  const handleCreate = () => {
    if (!isValid) return;

    createWalletMutation(
      { pin, userId: userId as string },
      {
        onSuccess: (data) => {
          showSuccess(data.message);
          router.push("/(protected)/wallet");
        },
        onError: (err) => {
          showError(err.message);
        },
      },
    );
  };

  const handlePinChange = (value: string) => {
    setPin(value);

    if (value.length === 6) {
      confirmRef.current?.focus();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-gray-100">
        <View className="bg-orange-400 pt-14 pb-6 px-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.push("/")} className="mr-3">
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>

          <View>
            <Text className="text-white text-xl font-bold">Create Wallet</Text>
            <Text className="text-orange-100 mt-1">
              Set your 6-digit PIN to secure your wallet
            </Text>
          </View>
        </View>

        <View className="flex-1 p-4">
          <View className="items-center my-6">
            <View className="w-20 h-20 rounded-full bg-orange-100 items-center justify-center">
              <Ionicons name="wallet-outline" size={40} color="#f97316" />
            </View>
          </View>

          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-gray-500 mb-2">Enter PIN</Text>
            <TextInput
              value={pin}
              onChangeText={handlePinChange}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={6}
              placeholder="••••••"
              className="border border-gray-300 rounded-xl p-3 text-center text-lg tracking-[8px]"
            />
          </View>

          <View className="bg-white rounded-2xl p-4">
            <Text className="text-gray-500 mb-2">Confirm PIN</Text>
            <TextInput
              ref={confirmRef}
              value={confirmPin}
              onChangeText={setConfirmPin}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={6}
              placeholder="••••••"
              className="border border-gray-300 rounded-xl p-3 text-center text-lg tracking-[8px]"
            />
          </View>

          {confirmPin.length > 0 && confirmPin !== pin && (
            <Text className="text-red-500 mt-2">PIN does not match</Text>
          )}

          <View className="mt-4">
            <Text className="text-gray-400 text-sm">
              • PIN must be 6 digits
            </Text>
            <Text className="text-gray-400 text-sm">
              • Do not share your PIN with anyone
            </Text>
          </View>
        </View>

        <View className="p-4 bg-white border-t border-gray-200">
          <TouchableOpacity
            disabled={!isValid}
            onPress={handleCreate}
            className={`py-4 rounded-2xl items-center ${
              isValid ? "bg-orange-500" : "bg-gray-300"
            }`}
          >
            <Text className="text-white font-bold text-lg">Create Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateWalletScreen;
