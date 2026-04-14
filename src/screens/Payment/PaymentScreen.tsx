import { useCreateOrderMutation } from "@/apis/hooks/order";
import AddressPicker from "@/components/AddressPicker";
import { AddressItem } from "@/hooks/useAddressSearch";
import { useAuthStore } from "@/store/auth";
import { showError, showSuccess } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SelectedItem } from "../Cart/type";

const PaymentScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = useAuthStore((state) => state.userId);

  const selectedItems: SelectedItem[] = params.items
    ? JSON.parse(params.items as string)
    : [];

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "wallet">("cod");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<AddressItem | null>(
    null,
  );

  const { mutate: createOrder } = useCreateOrderMutation();

  const subtotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.totalPrice, 0),
    [selectedItems],
  );

  const deliveryFee = 15000;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!selectedAddress || !name || !phone) {
      showError("Please fill all required fields");
      return;
    }

    const body = {
      userId: userId as string,
      address: selectedAddress.name,
      phone,
      name,
      paymentMethod,
      description,
      shippingFee: deliveryFee,
      products: selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    if (paymentMethod === "cod") {
      createOrder(body, {
        onSuccess: (data) => {
          showSuccess(data.message);
          router.replace("/(protected)/(tabs)/order");
        },
        onError: (err) => showError(err.message),
      });
      return;
    }

    router.push({
      pathname: "/(protected)/pinPayment",
      params: {
        payload: JSON.stringify(body),
        amount: total,
      },
    });
  };

  useEffect(() => {
    if (params.address) {
      setSelectedAddress({
        name: params.address as string,
        lat: params.lat as string,
        lon: params.lon as string,
      });
    }
  }, [params.address]);

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row items-center px-4 pt-12 pb-3 bg-orange-300 shadow-sm">
        <TouchableOpacity
          onPress={() => router.push("/(protected)/(tabs)/cart")}
          className="p-2 rounded-full bg-gray-100"
        >
          <Ionicons name="arrow-back" size={20} />
        </TouchableOpacity>

        <Text className="ml-3 text-lg font-bold">Payment</Text>
      </View>
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={[{ key: "content" }]}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        renderItem={() => (
          <>
            <View className="bg-white p-4 rounded-2xl mb-4">
              <Text className="font-bold text-lg mb-3">Delivery Address</Text>

              <View className="mb-3">
                <AddressPicker onSelect={(item) => setSelectedAddress(item)} />
              </View>

              <View className="flex-row items-center my-2">
                <View className="flex-1 h-[1px] bg-gray-200" />
                <Text className="mx-2 text-gray-400 text-sm">or</Text>
                <View className="flex-1 h-[1px] bg-gray-200" />
              </View>

              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/map",
                    params: {
                      items: JSON.stringify(selectedItems),
                    },
                  })
                }
                activeOpacity={0.8}
                className="flex-row items-center justify-center p-3 bg-orange-50 border border-orange-200 rounded-xl"
              >
                <Ionicons name="map-outline" size={18} color="#f97316" />
                <Text className="ml-2 text-orange-500 font-medium">
                  Select from map
                </Text>
              </TouchableOpacity>

              {selectedAddress && (
                <View className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <View className="flex-row items-start">
                    <Ionicons name="location" size={18} color="#f97316" />
                    <View className="ml-2 flex-1">
                      <Text className="text-gray-500 text-xs mb-1">
                        Deliver to
                      </Text>
                      <Text className="font-semibold text-gray-800">
                        {selectedAddress.name}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            <View className="bg-white p-4 rounded-2xl mb-4">
              <Text className="font-bold text-lg mb-3">Contact Info</Text>

              <View className="mb-3">
                <Text className="text-gray-500 mb-1">Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  className="border border-gray-300 rounded-xl p-3"
                />
              </View>

              <View className="mb-3">
                <Text className="text-gray-500 mb-1">Phone</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone"
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-300 rounded-xl p-3"
                />
              </View>

              <View>
                <Text className="text-gray-500 mb-1">Note</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Optional note for delivery"
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#9CA3AF"
                  className="border border-gray-300 rounded-xl p-3"
                />
              </View>
            </View>

            <View className="bg-white p-4 rounded-2xl mb-4">
              <Text className="font-bold text-lg mb-3">Your Order</Text>

              {selectedItems.map((item) => (
                <View
                  key={item.productId}
                  className="flex-row items-center mb-3"
                >
                  <Image
                    source={{ uri: item.img }}
                    className="w-14 h-14 rounded-xl"
                  />

                  <View className="flex-1 ml-3">
                    <Text className="font-medium">{item.productName}</Text>
                    <Text className="text-gray-400">x{item.quantity}</Text>
                  </View>

                  <Text className="font-semibold">
                    {item.totalPrice.toLocaleString()}đ
                  </Text>
                </View>
              ))}
            </View>

            <View className="bg-white p-4 rounded-2xl mb-4">
              <Text className="font-bold text-lg mb-3">Payment Method</Text>

              <TouchableOpacity
                onPress={() => setPaymentMethod("cod")}
                className={`flex-row items-center p-3 rounded-xl mb-2 ${
                  paymentMethod === "cod" ? "bg-orange-100" : "bg-gray-100"
                }`}
              >
                <Ionicons name="cash-outline" size={20} />
                <Text className="ml-3 flex-1">Cash on Delivery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPaymentMethod("wallet")}
                className={`flex-row items-center p-3 rounded-xl ${
                  paymentMethod === "wallet" ? "bg-orange-100" : "bg-gray-100"
                }`}
              >
                <Ionicons name="wallet-outline" size={20} />
                <Text className="ml-3 flex-1">Wallet</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-white p-4 rounded-2xl">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-500">Subtotal</Text>
                <Text>{subtotal.toLocaleString()}đ</Text>
              </View>

              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-500">Delivery</Text>
                <Text>{deliveryFee.toLocaleString()}đ</Text>
              </View>

              <View className="flex-row justify-between mt-2">
                <Text className="font-bold text-lg">Total</Text>
                <Text className="font-bold text-lg text-orange-500">
                  {total.toLocaleString()}đ
                </Text>
              </View>
            </View>
          </>
        )}
      />

      <View className="absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-gray-200">
        <TouchableOpacity
          onPress={handleCheckout}
          disabled={!selectedAddress}
          className={`py-4 rounded-2xl items-center ${
            selectedAddress && name && phone ? "bg-orange-500" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-bold text-lg">
            {paymentMethod === "cod" ? "Order" : "Pay"} •{" "}
            {total.toLocaleString()}đ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentScreen;
