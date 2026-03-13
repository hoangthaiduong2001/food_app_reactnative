import { GetProductsTopRatingResType } from "@/types/product";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width;

const SpecialOfferCarousel = ({
  data,
}: {
  data: GetProductsTopRatingResType[];
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(1);

  const loopData = useMemo(() => {
    if (!data?.length) return [];
    return [data[data.length - 1], ...data, data[0]];
  }, [data]);

  useEffect(() => {
    if (!data?.length) return;

    const timer = setInterval(() => {
      flatListRef.current?.scrollToOffset({
        offset: ITEM_WIDTH * (index + 1),
        animated: true,
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [index, data]);

  const handleScrollEnd = (e: any) => {
    const offset = e.nativeEvent.contentOffset.x;
    let newIndex = Math.round(offset / ITEM_WIDTH);

    if (newIndex === 0) {
      flatListRef.current?.scrollToOffset({
        offset: ITEM_WIDTH * data.length,
        animated: false,
      });
      newIndex = data.length;
    }

    if (newIndex === data.length + 1) {
      flatListRef.current?.scrollToOffset({
        offset: ITEM_WIDTH,
        animated: false,
      });
      newIndex = 1;
    }

    setIndex(newIndex);
  };

  const renderItem = ({ item }: { item: GetProductsTopRatingResType }) => (
    <View style={{ width: ITEM_WIDTH }} className="px-12">
      <View className="bg-white rounded-3xl p-5 flex-row items-center">
        <View className="flex-1">
          <Text className="text-lg font-bold">{item.title}</Text>

          <Text className="text-gray-400 text-sm mt-1" numberOfLines={2}>
            {item.desc}
          </Text>

          <Text className="text-orange-400 mt-1">
            ⭐ {item.averageRating.toFixed(1)}
          </Text>

          <TouchableOpacity className="bg-orange-400 px-4 py-2 rounded-full mt-3 self-start">
            <Text className="text-white font-semibold">Order Now</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: item.img }}
          className="w-24 h-24 rounded-xl"
          resizeMode="cover"
        />
      </View>
    </View>
  );

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={loopData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onMomentumScrollEnd={handleScrollEnd}
        contentOffset={{ x: ITEM_WIDTH, y: 0 }}
      />

      {/* DOTS */}
      <View className="flex-row justify-center mt-3">
        {data.map((_, i) => {
          const active = index - 1 === i;

          return (
            <View
              key={i}
              className={`mx-1 rounded-full ${
                active ? "bg-orange-400 w-5 h-2" : "bg-gray-300 w-2 h-2"
              }`}
            />
          );
        })}
      </View>
    </View>
  );
};

export default SpecialOfferCarousel;
