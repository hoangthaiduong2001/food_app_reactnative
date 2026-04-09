import { useGetCartById, useUpdateCartMutation } from "@/apis/hooks/cart";
import ConfirmModal from "@/components/ConfirmModal";
import { useAuthStore } from "@/store/auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SelectedItem } from "./type";

const CartScreen = () => {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const { data, refetch } = useGetCartById({ id: userId as string });
  const { mutate: updateCart } = useUpdateCartMutation();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    productId: string;
  } | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const products = data?.data?.products ?? [];

  const toggleSelect = (item: SelectedItem) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.productId === item.productId);

      if (exists) {
        return prev.filter((i) => i.productId !== item.productId);
      }

      return [...prev, item];
    });
  };

  const increase = (productId: string, quantity: number) => {
    updateCart(
      {
        userId: userId as string,
        productId,
        quantity: quantity + 1,
      },
      {
        onSuccess: () => refetch(),
      },
    );
  };

  const decrease = (productId: string, quantity: number) => {
    if (quantity === 1) {
      setSelectedItem({ productId });
      setShowConfirm(true);
      return;
    }

    updateCart(
      {
        userId: userId as string,
        productId,
        quantity: quantity - 1,
      },
      {
        onSuccess: () => refetch(),
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!selectedItem) return;

    updateCart(
      {
        userId: userId as string,
        productId: selectedItem.productId,
        quantity: 0,
      },
      {
        onSuccess: () => {
          setShowConfirm(false);
          setSelectedItem(null);
          refetch();
        },
      },
    );
  };

  const subtotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [selectedItems]);

  const delivery = selectedItems.length > 0 ? 20000 : 0;
  const total = subtotal + delivery;
  return (
    <View className="flex-1 bg-gray-100 pt-5 px-5">
      <Text className="text-2xl font-bold mb-6">Cart</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {products.map((item) => {
          const isSelected = selectedItems.some(
            (i) => i.productId === item.productId,
          );

          return (
            <View
              key={item.productId}
              className="bg-white p-4 rounded-2xl flex-row items-center mb-4"
            >
              <TouchableOpacity
                onPress={() => toggleSelect(item)}
                className={`w-6 h-6 rounded-md mr-3 items-center justify-center ${
                  isSelected ? "bg-orange-400" : "border border-gray-300"
                }`}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </TouchableOpacity>

              <Image
                source={{ uri: item.img }}
                className="w-16 h-16 rounded-xl"
              />

              <View className="flex-1 ml-4">
                <Text className="font-semibold">{item.productName}</Text>
                <Text className="font-bold mt-1">{item.unitPrice} VND</Text>
              </View>

              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => decrease(item.productId, item.quantity)}
                  className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
                >
                  <Ionicons name="remove" size={16} />
                </TouchableOpacity>

                <Text className="mx-3">{item.quantity}</Text>

                <TouchableOpacity
                  onPress={() => increase(item.productId, item.quantity)}
                  className="bg-orange-400 w-8 h-8 rounded-full items-center justify-center"
                >
                  <Ionicons name="add" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View className="bg-white p-5 rounded-2xl my-3">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500">Subtotal</Text>
          <Text>{subtotal}</Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500">Delivery</Text>
          <Text>{delivery}</Text>
        </View>

        <View className="flex-row justify-between mb-4">
          <Text className="font-bold">Total</Text>
          <Text className="font-bold">{total}</Text>
        </View>

        <TouchableOpacity
          disabled={selectedItems.length === 0}
          onPress={() => {
            router.push({
              pathname: "/(protected)/payment",
              params: {
                items: JSON.stringify(selectedItems),
              },
            });
          }}
          className={`py-4 rounded-xl items-center ${
            selectedItems.length === 0 ? "bg-gray-300" : "bg-orange-400"
          }`}
        >
          <Text className="text-white font-semibold text-lg">Checkout</Text>
        </TouchableOpacity>
      </View>
      <ConfirmModal
        visible={showConfirm}
        title="Remove item"
        message="Do you want to remove this item from cart?"
        onCancel={() => {
          setShowConfirm(false);
          setSelectedItem(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={false}
      />
    </View>
  );
};

export default CartScreen;
