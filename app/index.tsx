import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
      setTimeout(() => {
        if (hasSeenOnboarding) {
          router.replace("/(public)/login");
        } else {
          router.replace("/onboarding");
        }
      }, 2000);
      await AsyncStorage.clear();
    };

    checkFirstLaunch();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../src/assets/images/splash.png")}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: "100%", height: "100%" },
});
