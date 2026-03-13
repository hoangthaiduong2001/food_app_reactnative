import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import Toast, { ToastConfigParams } from "react-native-toast-message";

const toastConfig = {
  success: (props: ToastConfigParams<unknown>) => (
    <View
      style={{
        width: "92%",
        backgroundColor: "#16A34A",
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
      }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 19,
          backgroundColor: "rgba(255,255,255,0.2)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="checkmark" size={22} color="#fff" />
      </View>

      <View style={{ marginLeft: 14, flex: 1 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          {props.text1}
        </Text>

        {props.text2 && (
          <Text
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.85)",
              marginTop: 2,
            }}
            numberOfLines={2}
          >
            {props.text2}
          </Text>
        )}
      </View>
    </View>
  ),

  error: (props: ToastConfigParams<unknown>) => (
    <View
      style={{
        width: "92%",
        backgroundColor: "#DC2626",
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
      }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 19,
          backgroundColor: "rgba(255,255,255,0.2)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="close" size={20} color="#fff" />
      </View>

      <View style={{ marginLeft: 14, flex: 1 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          {props.text1}
        </Text>

        {props.text2 && (
          <Text
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.85)",
              marginTop: 2,
            }}
            numberOfLines={2}
          >
            {props.text2}
          </Text>
        )}
      </View>
    </View>
  ),
};

export default function ToastProvider() {
  return <Toast config={toastConfig} position="top" topOffset={70} />;
}
