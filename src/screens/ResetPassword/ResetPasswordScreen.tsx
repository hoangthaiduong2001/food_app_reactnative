import { useResetPasswordMutation } from "@/apis/hooks/auth";
import { showError, showSuccess } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ResetPasswordFormType, resetPasswordSchema } from "./schema";

const ResetPasswordScreen = () => {
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false);
  const { mutate, isPending } = useResetPasswordMutation();

  const { email, otp } = useLocalSearchParams<{
    email: string;
    otp: string;
  }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handleResetPassword = (values: ResetPasswordFormType) => {
    mutate(
      {
        email,
        otp,
        newPassword: values.newPassword,
      },
      {
        onSuccess: (data) => {
          showSuccess(data.message || "Password reset successfully");
          router.replace("/login");
        },
        onError: (error) => {
          showError(error.message);
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <View className="bg-black py-12">
            <View className="pt-16 pb-10 px-6">
              <TouchableOpacity
                onPress={() => router.back()}
                className="absolute left-6 top-16 w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              >
                <Ionicons name="arrow-back" size={20} color="#fff" />
              </TouchableOpacity>

              <View className="items-center">
                <Text className="text-4xl font-extrabold text-white">
                  Reset Password
                </Text>

                <Text className="mt-3 text-base text-gray-300 text-center">
                  Enter your new password
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-1 bg-black">
            <View className="flex-1 bg-white rounded-t-[40px] px-7 pt-5 overflow-hidden">
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 40 }}
              >
                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 mt-5">
                        <TextInput
                          placeholder="Enter new password"
                          placeholderTextColor="#9CA3AF"
                          secureTextEntry={!showNewPassword}
                          className="flex-1 py-4 text-base"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          textContentType="newPassword"
                          autoComplete="new-password"
                          importantForAutofill="no"
                          autoCorrect={false}
                          spellCheck={false}
                        />
                        <TouchableOpacity
                          onPress={() => setShowNewPassword((prev) => !prev)}
                        >
                          <Ionicons
                            name={
                              showNewPassword
                                ? "eye-off-outline"
                                : "eye-outline"
                            }
                            size={22}
                            color="#6B7280"
                          />
                        </TouchableOpacity>
                      </View>
                      {errors.newPassword && (
                        <Text className="text-red-500 text-sm mt-2">
                          {errors.newPassword.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="confirmNewPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 mt-12">
                        <TextInput
                          placeholder="Enter confirm new password"
                          placeholderTextColor="#9CA3AF"
                          secureTextEntry={!showConfirmNewPassword}
                          className="flex-1 py-4 text-base"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          textContentType="newPassword"
                          autoComplete="new-password"
                          importantForAutofill="no"
                          autoCorrect={false}
                          spellCheck={false}
                        />
                        <TouchableOpacity
                          onPress={() =>
                            setShowConfirmNewPassword((prev) => !prev)
                          }
                        >
                          <Ionicons
                            name={
                              showConfirmNewPassword
                                ? "eye-off-outline"
                                : "eye-outline"
                            }
                            size={22}
                            color="#6B7280"
                          />
                        </TouchableOpacity>
                      </View>
                      {errors.confirmNewPassword && (
                        <Text className="text-red-500 text-sm mt-2">
                          {errors.confirmNewPassword.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <TouchableOpacity
                  className="bg-orange-500 py-4 rounded-2xl mt-14 items-center shadow-lg"
                  onPress={handleSubmit(handleResetPassword)}
                  disabled={isPending}
                >
                  <Text className="text-white font-bold text-lg tracking-wide">
                    {isPending ? "Resetting..." : "RESET PASSWORD"}
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

export default ResetPasswordScreen;
