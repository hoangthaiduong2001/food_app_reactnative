import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, View } from "react-native";

type LoadingType = "spinner" | "icon" | "dots";

type LoadingProps = {
  type?: LoadingType;
  fullScreen?: boolean;
  overlay?: boolean;
  size?: "small" | "large";
};

const Loading = ({
  type = "spinner",
  fullScreen = false,
  overlay = false,
  size = "large",
}: LoadingProps) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (type === "icon") {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ).start();
    }
  }, [type]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderLoading = () => {
    switch (type) {
      case "icon":
        return (
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="refresh" size={28} color="#f97316" />
          </Animated.View>
        );

      case "dots":
        return (
          <View className="flex-row gap-1">
            <View className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            <View className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            <View className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
          </View>
        );

      case "spinner":
      default:
        return <ActivityIndicator size={size} color="#f97316" />;
    }
  };

  return (
    <View
      className={`
        items-center justify-center
        ${fullScreen ? "flex-1" : ""}
        ${overlay ? "absolute inset-0 bg-black/20 z-50" : ""}
      `}
      pointerEvents={overlay ? "auto" : "none"}
    >
      {overlay ? (
        <View className="bg-white p-4 rounded-2xl shadow">
          {renderLoading()}
        </View>
      ) : (
        renderLoading()
      )}
    </View>
  );
};

export default Loading;
