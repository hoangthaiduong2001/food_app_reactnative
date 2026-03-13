import { useRegisterMutation } from "@/apis/hooks/register";
import InputField from "@/components/InputField";
import { showSuccess } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
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
import { RegisterFormType, registerSchema } from "./schema";

const RegisterScreen = () => {
  const { mutate, isPending } = useRegisterMutation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setConfirmShowPassword] =
    useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = (values: RegisterFormType) => {
    mutate(values, {
      onSuccess: (data) => {
        showSuccess(data.message);
        setTimeout(() => {
          router.replace("/login");
        }, 1000);
      },
      onError: (error) => {
        const field = error?.field;
        const message = error?.message || "Something went wrong.";

        if (field) {
          setError(field, {
            type: "server",
            message,
          });
        } else {
          setError("username", {
            type: "server",
            message,
          });
        }
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
                <Text className="text-4xl font-extrabold text-white tracking-wide">
                  Create Account
                </Text>
                <Text className="mt-3 text-base text-gray-300 text-center">
                  Sign up to get started
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
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      label="USERNAME"
                      placeholder="Enter username"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.username?.message}
                    />
                  )}
                />

                <Text className="text-sm text-gray-500 font-semibold mt-7 mb-2">
                  PASSWORD
                </Text>

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <View className="flex-row items-center bg-gray-100 rounded-2xl px-5">
                        <TextInput
                          placeholder="Enter password"
                          placeholderTextColor="#9CA3AF"
                          secureTextEntry={!showPassword}
                          className="flex-1 py-4 text-base"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          importantForAutofill="no"
                          textContentType="newPassword"
                          autoComplete="new-password"
                          autoCorrect={false}
                          spellCheck={false}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword((prev) => !prev)}
                        >
                          <Ionicons
                            name={
                              showPassword ? "eye-off-outline" : "eye-outline"
                            }
                            size={22}
                            color="#6B7280"
                          />
                        </TouchableOpacity>
                      </View>
                      {errors.password && (
                        <Text className="text-red-500 text-sm mt-2">
                          {errors.password.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Text className="text-sm text-gray-500 font-semibold mt-7 mb-2">
                  CONFIRM PASSWORD
                </Text>

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <View className="flex-row items-center bg-gray-100 rounded-2xl px-5">
                        <TextInput
                          placeholder="Enter confirm password"
                          placeholderTextColor="#9CA3AF"
                          secureTextEntry={!showConfirmPassword}
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
                            setConfirmShowPassword((prev) => !prev)
                          }
                        >
                          <Ionicons
                            name={
                              showConfirmPassword
                                ? "eye-off-outline"
                                : "eye-outline"
                            }
                            size={22}
                            color="#6B7280"
                          />
                        </TouchableOpacity>
                      </View>
                      {errors.confirmPassword &&
                        errors.confirmPassword.message && (
                          <Text className="text-red-500 text-sm mt-2">
                            {errors?.confirmPassword.message}
                          </Text>
                        )}
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      label="EMAIL"
                      placeholder="Enter email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      error={errors.email?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      label="PHONE"
                      placeholder="Enter phone number"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                      error={errors.phone?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="address"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      label="ADDRESS"
                      placeholder="Enter address"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.address?.message}
                    />
                  )}
                />

                <TouchableOpacity
                  className="bg-orange-500 py-4 rounded-2xl mt-10 items-center shadow-lg"
                  onPress={handleSubmit(handleRegister)}
                  disabled={isPending}
                >
                  <Text className="text-white font-bold text-lg tracking-wide">
                    {isPending ? "Creating..." : "REGISTER"}
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

export default RegisterScreen;
