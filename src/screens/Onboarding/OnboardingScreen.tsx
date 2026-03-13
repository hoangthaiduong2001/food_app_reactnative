import { dataOnboarding } from "@/data/onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const OnboardingScreen = () => {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = async () => {
    if (currentIndex < dataOnboarding.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      router.replace("/(public)/login");
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/(public)/login");
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        ref={flatListRef}
        data={dataOnboarding}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width }} className="items-center justify-center px-5">
            <Image
              source={item.img}
              style={{ width: width, height: width }}
              resizeMode="contain"
            />

            <Text className="text-3xl font-bold mt-6 text-center">
              {item.title}
            </Text>

            <Text className="text-base text-gray-500 text-center mt-4 px-6">
              {item.description}
            </Text>
          </View>
        )}
      />

      <View className="flex-row justify-center mb-5">
        {dataOnboarding.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full mx-1 ${
              currentIndex === index ? "w-5 bg-black" : "w-5 bg-gray-300"
            }`}
          />
        ))}
      </View>

      <View className="flex-row justify-between items-center px-8 pb-10">
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-gray-400 text-base">Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          className="bg-black px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">
            {currentIndex === dataOnboarding.length - 1 ? "Start" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;
