import ToastProvider from "@/components/Provider/ToastProvider";
import { CartAnimationProvider } from "@/store/cartAnimationContext";
import { NavigationProvider } from "@/store/navigationContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <NavigationProvider>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <CartAnimationProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
            <ToastProvider />
          </CartAnimationProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </NavigationProvider>
  );
}
