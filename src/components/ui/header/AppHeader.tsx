import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const AppHeader = ({ username }: { username: string | undefined }) => {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 12,
        backgroundColor: "#fbc099",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text style={{ fontSize: 14 }}>Welcome 👋</Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontWeight: "600", fontSize: 18, color: "#1f2937" }}>
              {username || "Guest"}
            </Text>
          </View>
        </View>

        <View
          style={{ backgroundColor: "#fff", padding: 8, borderRadius: 999 }}
        >
          <Ionicons name="notifications-outline" size={20} color="#ff6b4a" />
        </View>
      </View>
    </View>
  );
};

export default AppHeader;
