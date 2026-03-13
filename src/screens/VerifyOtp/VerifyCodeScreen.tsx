import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
} from "@/apis/hooks/auth";
import OtpInput from "@/components/OtpInput";
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
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ForgotPasswordFormType } from "../ForgotPassword/schema";
import { VerifyOtpFormType, verifyOtpSchema } from "./schema";

const VerifyOtpScreen = () => {
  const router = useRouter();
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const { mutate, isPending } = useVerifyOtpMutation();
  const { mutate: resendOtpMutate } = useForgotPasswordMutation();
  const { email } = useLocalSearchParams<{ email: string }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormType>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleResendOtp = (values: ForgotPasswordFormType) => {
    resendOtpMutate(values, {
      onSuccess: (data) => {
        showSuccess(data.message);
      },
      onError: (error) => {
        showError(error.message);
      },
    });
  };

  const handleVerifyCode = (values: VerifyOtpFormType) => {
    mutate(
      { email, otp: values.otp },
      {
        onSuccess: () => {
          router.push({
            pathname: "/resetPassword",
            params: {
              email,
              otp: values.otp,
            },
          });
        },
        onError: () => {
          const attempts = failedAttempts + 1;
          setFailedAttempts(attempts);

          if (attempts >= 5) {
            showError("Too many incorrect attempts. Please request a new OTP.");
            router.replace("/forgotPassword");
            return;
          }

          showError(`Invalid OTP. Attempts left: ${5 - attempts}`);
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
                  Verify Code
                </Text>

                <Text className="mt-3 text-base text-gray-300 text-center">
                  Enter the verification code sent to your email
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
                  name="otp"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      <Controller
                        control={control}
                        name="otp"
                        render={({ field: { onChange, value } }) => (
                          <View>
                            <OtpInput
                              value={value}
                              onChange={(val) => {
                                onChange(val);

                                if (val.length === 4) {
                                  handleSubmit(handleVerifyCode)();
                                }
                              }}
                            />
                            {errors.otp && (
                              <Text className="text-red-500 mt-2">
                                {errors.otp.message}
                              </Text>
                            )}
                          </View>
                        )}
                      />
                    </View>
                  )}
                />

                <TouchableOpacity
                  className="bg-orange-500 py-4 rounded-2xl mt-10 items-center shadow-lg"
                  onPress={handleSubmit(handleVerifyCode)}
                  disabled={isPending}
                >
                  <Text className="text-white font-bold text-lg tracking-wide">
                    {isPending ? "Verifying..." : "VERIFY CODE"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="mt-6 items-center">
                  <Text className="text-gray-500">
                    Didn&apos;t receive the code?{" "}
                    <Text
                      className="text-orange-500 font-semibold"
                      onPress={() => handleResendOtp({ email })}
                    >
                      Resend
                    </Text>
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

export default VerifyOtpScreen;
