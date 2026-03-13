import ToastProvider from "@/components/Provider/ToastProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Slot />
        <ToastProvider />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
