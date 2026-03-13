import { useForgotPasswordMutation } from "@/apis/hooks/auth";
import InputField from "@/components/InputField";
import { showSuccess } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ForgotPasswordFormType, forgotPasswordSchema } from "./schema";

const ForgotPasswordScreen = () => {
  const { mutate, isPending } = useForgotPasswordMutation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = (values: ForgotPasswordFormType) => {
    mutate(values, {
      onSuccess: (data) => {
        showSuccess(data.message);
        router.push({
          pathname: "/verifyOtp",
          params: { email: values.email },
        });
      },
      onError: (error) => {
        setError("email", {
          type: "server",
          message: error.message || "Email not found",
        });
      },
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <View className="bg-black py-10">
            <View className="pt-16 pb-10 px-6">
              <TouchableOpacity
                onPress={() => router.back()}
                className="absolute left-6 top-16 w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              >
                <Ionicons name="arrow-back" size={20} color="#fff" />
              </TouchableOpacity>

              <View className="items-center">
                <Text className="text-4xl font-extrabold text-white">
                  Forgot Password
                </Text>

                <Text className="mt-3 text-base text-gray-300 text-center">
                  Enter your email to receive a verification code
                </Text>
              </View>
            </View>
          </View>

          {/* FORM */}
          <View className="flex-1 bg-black">
            <View className="flex-1 bg-white rounded-t-[40px] px-7 pt-5 overflow-hidden">
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 40 }}
              >
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      label="EMAIL"
                      placeholder="Enter your email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={errors.email?.message}
                    />
                  )}
                />

                <TouchableOpacity
                  className="bg-orange-500 py-4 rounded-2xl mt-10 items-center shadow-lg"
                  onPress={handleSubmit(handleForgotPassword)}
                  disabled={isPending}
                >
                  <Text className="text-white font-bold text-lg tracking-wide">
                    {isPending ? "Sending..." : "SEND CODE"}
                  </Text>
                </TouchableOpacity>

                {/* Back to login */}
                <TouchableOpacity
                  className="mt-6 items-center"
                  onPress={() => router.replace("/login")}
                >
                  <Text className="text-gray-500">
                    Remember your password?{" "}
                    <Text className="text-orange-500 font-semibold">Login</Text>
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
