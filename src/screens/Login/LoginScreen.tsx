import {
  useGoogleLogin,
  useGoogleLoginMutation,
  useLoginMutation,
} from "@/apis/hooks/auth";
import { useAuthStore } from "@/store/auth";
import { LoginBodyType } from "@/types/auth";
import { showError } from "@/utils/toast";
import { saveTokens } from "@/utils/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LoginFormType, loginSchema } from "./schema";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const { setToken, setUser } = useAuthStore.getState();
  const { mutate, isPending } = useLoginMutation();
  const { mutate: googleLoginMutate } = useGoogleLoginMutation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const { request, promptAsync } = useGoogleLogin(async (idToken) => {
    googleLoginMutate(
      { idToken },
      {
        onSuccess: async (data) => {
          await saveTokens(data.accessToken, data.refreshToken, data.user);
          setToken(data.accessToken);
          setUser(data.user.id, data.user.username, data.user.hasWallet);
        },
        onError: (error) => {
          showError(error.message);
        },
      },
    );
  });

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = (values: LoginBodyType) => {
    mutate(values, {
      onSuccess: async (data) => {
        await saveTokens(data.accessToken, data.refreshToken, data.user);

        if (rememberMe) {
          await AsyncStorage.setItem("remembered_username", values.username);
        } else {
          await AsyncStorage.removeItem("remembered_username");
        }

        setToken(data.accessToken);
        setUser(data.user.id, data.user.username, data.user.hasWallet);
      },
      onError: (error) => {
        const field = error.field;
        const message = error.message || "Something went wrong.";

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

  useEffect(() => {
    const loadRememberedUser = async () => {
      const savedUsername = await AsyncStorage.getItem("remembered_username");
      if (savedUsername) {
        setValue("username", savedUsername);
        setRememberMe(true);
      }
    };

    loadRememberedUser();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-black">
        <View className="py-10">
          <View className="pt-10 pb-10 items-center px-6">
            <Text className="text-5xl font-extrabold text-white tracking-wide">
              Welcome Back
            </Text>
            <Text className="mt-4 text-lg text-gray-300 text-center leading-6">
              Sign in to continue and enjoy your favorite meals
            </Text>
          </View>
        </View>
        <View className="flex-1 bg-white rounded-t-[40px] px-7 pt-10">
          <Text className="text-sm text-gray-500 font-semibold mb-2">
            USERNAME
          </Text>

          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  placeholder="Enter your username"
                  placeholderTextColor="#9CA3AF"
                  className="bg-gray-100 rounded-2xl px-5 py-4 text-base"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
                {errors.username && (
                  <Text className="text-red-500 text-sm mt-2">
                    {errors.username.message}
                  </Text>
                )}
              </>
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
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
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
                    onPress={() => setShowPassword((prev) => !prev)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
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

          <View className="flex-row items-center justify-between mt-4">
            <TouchableOpacity
              onPress={() => setRememberMe((prev) => !prev)}
              className="flex-row items-center"
              activeOpacity={0.8}
            >
              <View
                className={`w-5 h-5 rounded-md border-2 items-center justify-center ${
                  rememberMe
                    ? "bg-orange-500 border-orange-500"
                    : "border-gray-300 bg-white"
                }`}
              >
                {rememberMe && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
              <Text className="ml-3 text-gray-600 font-semibold">
                Remember me
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/forgotPassword")}>
              <Text className="text-orange-500 font-semibold">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-orange-500 py-4 rounded-2xl mt-10 items-center shadow-lg"
            onPress={handleSubmit(handleLogin)}
            disabled={isPending}
          >
            <Text className="text-white font-bold text-lg tracking-wide">
              {isPending ? "Signing In..." : "LOG IN"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center my-8">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="mx-4 text-gray-400 text-sm font-medium">
              OR CONTINUE WITH
            </Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          <TouchableOpacity
            className="flex-row items-center justify-center border border-gray-200 py-4 rounded-2xl bg-white shadow-sm"
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <Ionicons name="logo-google" size={22} color="#DB4437" />

            <Text className="ml-3 text-base font-semibold text-gray-700">
              Continue with Google
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-10">
            <Text className="text-base text-gray-500">
              Don&lsquo;t have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text className="ml-2 text-base font-bold text-orange-500">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
