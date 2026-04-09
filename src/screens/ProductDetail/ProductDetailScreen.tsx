import { useAddCartMutation } from "@/apis/hooks/cart";
import { useGetProductById } from "@/apis/hooks/product";
import {
  useAddReviewMutation,
  useDeleteReviewMutation,
} from "@/apis/hooks/review";
import ConfirmModal from "@/components/ConfirmModal";
import Loading from "@/components/Loading";
import { useAuthStore } from "@/store/auth";
import { showError } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ProductDetailScreen = () => {
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState(5);
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const route = useRouter();
  const userId = useAuthStore((state) => state.userId);

  const { id } = useLocalSearchParams();

  const {
    data: productDetail,
    isLoading,
    refetch,
  } = useGetProductById({
    id: id as string,
  });
  const { mutate: addCartMutation, isPending: isAddingCart } =
    useAddCartMutation();
  const { mutate: addReviewMutation, isPending } = useAddReviewMutation();
  const { mutate: deleteReviewMutation, isPending: isPendingDeleteReview } =
    useDeleteReviewMutation();

  const handleDeleteReview = (reviewId: string) => {
    deleteReviewMutation(
      {
        reviewId,
        body: { userId: userId as string },
      },
      {
        onSuccess: () => {
          setShowConfirm(false);
          setSelectedReviewId(null);
          refetch();
        },
        onError: (error) => {
          showError(error.message);
          setShowConfirm(false);
          setSelectedReviewId(null);
        },
      },
    );
  };

  const openConfirm = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setShowConfirm(true);
  };

  const handleAddReview = () => {
    if (!reviewContent.trim()) {
      alert("Please enter review content");
      return;
    }

    addReviewMutation(
      {
        productId: id as string,
        userId: userId as string,
        content: reviewContent,
        rating,
      },
      {
        onSuccess: () => {
          setReviewContent("");
          setRating(5);
          refetch();
        },
        onError: (err) => {
          showError(err.message);
        },
      },
    );
  };

  const handleAddToCart = () => {
    if (!userId) {
      showError("Please login first");
      return;
    }

    addCartMutation(
      {
        userId: userId as string,
        productId: id as string,
        quantity,
      },
      {
        onSuccess: () => {
          setQuantity(1);
          route.push("/(protected)/(tabs)/cart");
        },
        onError: (err) => {
          showError(err.message);
        },
      },
    );
  };

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (isLoading || !productDetail) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loading />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="relative">
        <Image source={{ uri: productDetail.img }} className="w-full h-60" />

        <TouchableOpacity
          onPress={() => route.replace("/(protected)/(tabs)")}
          className="absolute top-12 left-4 bg-white p-2 rounded-full shadow"
        >
          <Ionicons name="arrow-back" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 -mt-6">
        <View className="bg-white rounded-3xl p-5 shadow">
          <Text className="text-2xl font-bold">{productDetail.title}</Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="star" size={16} color="orange" />
            <Text className="ml-1 text-gray-600">
              {productDetail.averageRating} ({productDetail.totalReviews}{" "}
              reviews)
            </Text>
          </View>

          <View className="flex-row items-center mt-3">
            <Text className="text-2xl font-bold text-orange-500">
              {productDetail.price.toLocaleString()}đ
            </Text>

            {productDetail.discount > 0 && (
              <Text className="ml-2 text-gray-400 line-through">
                {(
                  productDetail.price + productDetail.discount
                ).toLocaleString()}
                đ
              </Text>
            )}
          </View>

          <Text className="text-gray-500 mt-3 leading-5">
            {productDetail.desc}
          </Text>

          <View className="flex-row items-center justify-between mt-6">
            <Text className="font-semibold text-lg">Quantity</Text>

            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={decrease}
                className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center"
              >
                <Text>-</Text>
              </TouchableOpacity>

              <Text className="mx-4 font-bold">{quantity}</Text>

              <TouchableOpacity
                onPress={increase}
                className="w-8 h-8 rounded-full bg-orange-400 items-center justify-center"
              >
                <Text className="text-white">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-6">
            <Text className="font-bold text-lg mb-3">Reviews</Text>

            {productDetail.reviews?.map((r) => (
              <View key={r.id} className="flex-row mb-4">
                <Image
                  source={{ uri: r.img }}
                  className="w-10 h-10 rounded-full"
                />

                <View className="ml-3 flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-semibold">{r.username}</Text>

                    <View className="flex-row items-center gap-2">
                      <Text className="text-orange-400 text-sm">
                        ⭐ {r.rating}
                      </Text>

                      {r.userId === userId && (
                        <TouchableOpacity onPress={() => openConfirm(r.id)}>
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color="red"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {!!r.content && (
                    <Text className="text-gray-500 mt-1">{r.content}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
          <View className="mt-2">
            <Text className="font-bold text-lg mb-3">Add Review</Text>
            <View className="flex-row mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={24}
                    color="orange"
                    style={{ marginRight: 4 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View className="mt-4 flex-row items-end bg-gray-100 rounded-2xl px-3 py-2">
              <TextInput
                placeholder="Write your review..."
                value={reviewContent}
                onChangeText={setReviewContent}
                multiline
                className="flex-1 text-gray-700 max-h-28"
                style={{
                  textAlignVertical: "top",
                  paddingVertical: 6,
                }}
              />

              <TouchableOpacity
                disabled={isPending || !reviewContent.trim()}
                onPress={handleAddReview}
                className={`ml-2 w-10 h-10 rounded-full items-center justify-center ${
                  isPending || !reviewContent.trim()
                    ? "bg-gray-300"
                    : "bg-orange-500"
                }`}
              >
                <Ionicons
                  name="send"
                  size={18}
                  color={
                    isPending || !reviewContent.trim() ? "#9CA3AF" : "#fff"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        className="p-5 bg-white"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 15,
        }}
      >
        <TouchableOpacity
          disabled={isAddingCart}
          onPress={handleAddToCart}
          className={`py-4 rounded-2xl items-center ${
            isAddingCart ? "bg-gray-400" : "bg-orange-500"
          }`}
        >
          <Text className="text-white font-bold text-md">
            {isAddingCart ? (
              <Loading type="spinner" fullScreen size="small" />
            ) : (
              `Add to Cart • ${(productDetail.price * quantity).toLocaleString()}đ`
            )}
          </Text>
        </TouchableOpacity>
      </View>
      <ConfirmModal
        visible={showConfirm}
        title="Delete Review"
        message="Are you sure you want to delete this review?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => handleDeleteReview(selectedReviewId as string)}
        loading={isPendingDeleteReview}
      />
    </View>
  );
};

export default ProductDetailScreen;
