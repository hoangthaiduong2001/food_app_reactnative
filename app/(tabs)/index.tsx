import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";

export default function HomeScreen() {
  const [text, setText] = useState<string>("");
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <Text className="text-blue-500">Welcome!</Text>
        <ThemedText type="title" className="text-red-500">
          Welcome132!
        </ThemedText>
        <HelloWave />
      </ThemedView>
      <View style={{ padding: 20 }}>
        <Text variant="headlineMedium">Xin chào 👋</Text>

        <TextInput
          label="Input name test"
          value={text}
          onChangeText={setText}
          style={{ marginVertical: 10 }}
        />

        <Button mode="contained" onPress={() => alert(text)}>
          Click here
        </Button>

        <Card style={{ marginTop: 20 }}>
          <Card.Title title="Card title" />
          <Card.Content>
            <Text>This is content card</Text>
          </Card.Content>
        </Card>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
