import {
  useGetOrderDetail,
  useOrderAgainMutation,
  useUpdateStatusOrderMutation,
} from "@/apis/hooks/order";
import ConfirmModal from "@/components/ConfirmModal";
import Loading from "@/components/Loading";
import { useAuthStore } from "@/store/auth";
import { OrderAgainBodyType } from "@/types/order";
import { capitalize } from "@/utils/format";
import { showError } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const OrderDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showConfirm, setShowConfirm] = useState(false);
  const userId = useAuthStore((state) => state.userId);
  const [actionType, setActionType] = useState<"received" | "cancelled" | null>(
    null,
  );

  const { mutate: updateStatus, isPending } = useUpdateStatusOrderMutation();
  const { mutate: orderAgain, isPending: isPendingOrderAgain } =
    useOrderAgainMutation();

  const { data: order, isLoading } = useGetOrderDetail({
    id: id as string,
  });

  const handleUpdateStatus = () => {
    if (!actionType) return;

    updateStatus(
      {
        id: id as string,
        body: { deliveryStatus: actionType },
      },
      {
        onSuccess: (data) => {
          console.log(data);
          setShowConfirm(false);
          setActionType(null);
          router.push("/(protected)/(tabs)/order");
        },
        onError: (err) => {
          setShowConfirm(false);
          setActionType(null);
        },
      },
    );
  };

  const handleOrderAgain = () => {
    if (!order?.data?.products?.length) return;

    const body: OrderAgainBodyType = {
      userId: userId as string,
      products: order.data.products.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    orderAgain(body, {
      onSuccess: () => {
        router.push("/(protected)/(tabs)/cart");
      },
      onError: (err) => {
        showError(err.message);
      },
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "waiting":
        return {
          bg: "bg-orange-100",
          text: "text-orange-500",
        };
      case "received":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
        };
      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-500",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-500",
        };
    }
  };

  if (isLoading || !order) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loading />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-white pt-12 pb-4 px-4 flex-row items-center justify-between border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.push("/(protected)/(tabs)/order")}
        >
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>

        <Text className="text-lg font-semibold">Order Detail</Text>

        <View style={{ width: 22 }} />
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
          <Text className="font-semibold text-base mb-3">Customer</Text>

          <Text className="text-gray-800 font-medium">{order.data.name}</Text>
          <Text className="text-gray-500 mt-1">{order.data.phone}</Text>
          <Text className="text-gray-500 mt-1">{order.data.address}</Text>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
          <Text className="font-semibold text-base mb-3">Status</Text>

          <View
            className={`self-start px-3 py-1 rounded-full ${getStatusStyle(order.data.deliveryStatus).bg}`}
          >
            <Text
              className={`font-medium text-sm ${getStatusStyle(order.data.deliveryStatus).text}`}
            >
              {capitalize(order.data.deliveryStatus)}
            </Text>
          </View>

          <Text className="text-gray-500 mt-3">
            Payment:{" "}
            <Text className="text-gray-800 font-medium">
              {order.data.paymentMethod}
            </Text>{" "}
            ({order.data.paymentStatus})
          </Text>

          {!!order.data.description && (
            <Text className="text-gray-500 mt-2">
              Note: {order.data.description}
            </Text>
          )}
        </View>

        <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
          <Text className="font-semibold text-base mb-3">Products</Text>

          {order.data.products.map((item) => (
            <View
              key={item.id}
              className="flex-row items-center mb-4 pb-4 border-b border-gray-100 last:border-b-0"
            >
              <Image
                source={{ uri: item.img }}
                className="w-16 h-16 rounded-xl"
              />

              <View className="ml-3 flex-1">
                <Text className="font-medium text-gray-800">{item.title}</Text>

                <Text className="text-gray-400 text-xs mt-1">
                  x{item.quantity}
                </Text>

                <Text className="text-gray-500 text-sm mt-1">
                  {item.price.toLocaleString()}đ
                </Text>
              </View>

              <Text className="font-semibold text-orange-500">
                {(item.price * item.quantity).toLocaleString()}đ
              </Text>
            </View>
          ))}
        </View>

        <View className="bg-white rounded-2xl p-4 mb-6 border border-gray-100">
          <Text className="font-semibold text-base mb-3">Summary</Text>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500">Shipping</Text>
            <Text className="text-gray-800">
              {order.data.shippingFee.toLocaleString()}đ
            </Text>
          </View>

          <View className="flex-row justify-between border-t border-gray-100 pt-3 mt-2">
            <Text className="text-base font-semibold">Total</Text>
            <Text className="text-lg font-bold text-orange-500">
              {order.data.totalPrice.toLocaleString()}đ
            </Text>
          </View>
        </View>
        {order.data.deliveryStatus === "waiting" && (
          <View className="mb-6">
            <TouchableOpacity
              onPress={() => {
                setActionType("cancelled");
                setShowConfirm(true);
              }}
              className="py-4 rounded-2xl bg-red-50 border border-red-200 items-center"
            >
              <Text className="text-red-500 font-semibold text-base">
                Cancel Order
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {order.data.deliveryStatus === "received" && (
          <View className="mb-6">
            <TouchableOpacity
              onPress={handleOrderAgain}
              disabled={isPending}
              className={`py-4 rounded-2xl items-center ${
                isPending ? "bg-gray-300" : "bg-orange-500"
              }`}
            >
              <Text className="text-white font-semibold text-base">
                {isPending ? "Adding..." : "Order Again"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <ConfirmModal
          visible={showConfirm}
          title={actionType === "received" ? "Confirm Order" : "Cancel Order"}
          message={
            actionType === "received"
              ? "Are you sure you have received this order?"
              : "Do you want to cancel this order?"
          }
          onCancel={() => {
            setShowConfirm(false);
            setActionType(null);
          }}
          onConfirm={handleUpdateStatus}
          loading={isPending}
        />
      </ScrollView>
    </View>
  );
};

export default OrderDetailScreen;
