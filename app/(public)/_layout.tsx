import { useAuthStore } from "@/store/auth";
import { Redirect, Slot, useSegments } from "expo-router";

export default function PublicLayout() {
  const token = useAuthStore((state) => state.token);
  const segments = useSegments();

  const inPublic = segments[0] === "(public)";

  if (token && inPublic) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  return <Slot />;
}
