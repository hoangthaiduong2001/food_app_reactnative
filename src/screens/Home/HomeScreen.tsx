import { useAddCartMutation } from "@/apis/hooks/cart";
import { useGetAllCategory, useGetCategoryById } from "@/apis/hooks/category";
import {
  useGetAllProducts,
  useGetProductsTopRating,
} from "@/apis/hooks/product";
import DismissKeyboardView from "@/components/DismissKeyBoardView";
import Loading from "@/components/Loading";
import { useAuthStore } from "@/store/auth";
import { useCartAnimation } from "@/store/cartAnimationContext";
import { ProductType } from "@/types/product";
import { showError } from "@/utils/toast";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SearchBox from "./component/SearchBox";
import SpecialOfferCarousel from "./component/SpecialOfferCarousel";
import { DEFAULT_CATEGORY } from "./const";
import { AnimatingItem } from "./type";

const HomeScreen = () => {
  const userId = useAuthStore((state) => state.userId);
  const [activeId, setActiveId] = useState<string | null>(DEFAULT_CATEGORY);
  const itemRefs = useRef<Record<string, View | null>>({});
  const { cartRef } = useCartAnimation();
  const [animatingItem, setAnimatingItem] = useState<AnimatingItem | null>(
    null,
  );
  const anim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { data: dataTopRating } = useGetProductsTopRating();
  const { data: dataCategories } = useGetAllCategory();
  const { data: dataProductByCategory } = useGetCategoryById({
    id: activeId ?? "",
  });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllProducts();
  const { mutate: addCartMutation } = useAddCartMutation();

  const categories = [
    { id: DEFAULT_CATEGORY, name: "All" },
    ...(dataCategories ?? []),
  ];

  const handleAddToCart = (item: ProductType) => {
    const itemRef = itemRefs.current[item.id];

    if (!itemRef || !cartRef.current) return;

    addCartMutation(
      { productId: item.id, userId: userId as string },
      {
        onSuccess: () => {
          requestAnimationFrame(() => {
            setTimeout(() => {
              itemRef.measureInWindow((x, y) => {
                cartRef.current?.measureInWindow((cx, cy) => {
                  setAnimatingItem({
                    uri: item.img,
                    startX: x,
                    startY: y,
                    endX: cx,
                    endY: cy,
                  });
                  anim.setValue(0);
                  Animated.timing(anim, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                  }).start(() => {
                    setAnimatingItem(null);
                  });
                });
              });
            }, 30);
          });
        },

        onError: (error) => {
          showError(error.message);
        },
      },
    );
  };

  const products = useMemo(() => {
    if (activeId === DEFAULT_CATEGORY) {
      return data?.pages.flatMap((page) => page.data) ?? [];
    }

    return dataProductByCategory?.products ?? [];
  }, [activeId, data, dataProductByCategory]);

  return (
    <DismissKeyboardView>
      <View className="flex-1 bg-gray-100">
        <SearchBox />
        <FlatList
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          data={products}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          ListHeaderComponent={
            <>
              <SpecialOfferCarousel data={dataTopRating ?? []} />
              <View className="flex-row justify-between items-center mt-5 mb-3">
                <Text className="text-lg font-bold">Popular Food</Text>
              </View>

              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 16 }}
                renderItem={({ item }) => {
                  const isActive = activeId === item.id;
                  return (
                    <TouchableOpacity
                      onPress={() => setActiveId(item.id)}
                      className={`px-4 py-2 rounded-full mr-3 ${
                        isActive ? "bg-orange-400" : "bg-gray-200"
                      }`}
                    >
                      <Text className={isActive ? "text-white" : "text-black"}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </>
          }
          renderItem={({ item }) => (
            <View
              ref={(ref) => {
                itemRefs.current[item.id] = ref;
              }}
              className="mb-4"
            >
              <TouchableOpacity
                onPress={() => router.push(`/product/${item.id}`)}
                activeOpacity={0.8}
              >
                <View className="bg-white p-4 rounded-2xl flex-row items-center shadow-sm">
                  <Image
                    source={{ uri: item.img }}
                    className="w-20 h-20 rounded-2xl"
                    resizeMode="cover"
                  />

                  <View className="flex-1 ml-4">
                    <Text className="font-semibold text-base">
                      {item.title}
                    </Text>
                    <Text className="text-gray-400 text-sm mt-1">
                      {item.desc}
                    </Text>
                    <Text className="font-bold mt-2 text-orange-400">
                      {item.price}đ
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleAddToCart(item)}
                    className="bg-orange-400 w-9 h-9 rounded-full items-center justify-center shadow"
                  >
                    <Text className="text-white text-lg">+</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          )}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? (
              <Loading fullScreen type="spinner" size="small" />
            ) : null
          }
        />
        {animatingItem && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: animatingItem.startY,
              left: animatingItem.startX,
              zIndex: 999,
            }}
          >
            <Animated.Image
              source={{ uri: animatingItem.uri }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 12,
                transform: [
                  {
                    translateX: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        0,
                        animatingItem.endX - animatingItem.startX,
                      ],
                    }),
                  },
                  {
                    translateY: anim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [
                        0,
                        -80,
                        animatingItem.endY - animatingItem.startY,
                      ],
                    }),
                  },
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.3],
                    }),
                  },
                ],
                opacity: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.7],
                }),
              }}
            />
          </Animated.View>
        )}
      </View>
    </DismissKeyboardView>
  );
};

export default HomeScreen;
