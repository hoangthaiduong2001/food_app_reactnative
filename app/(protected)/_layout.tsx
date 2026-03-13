import { useAuthStore } from "@/store/auth";
import { Redirect, Slot, useSegments } from "expo-router";

const ProtectedLayout = () => {
  const token = useAuthStore((state) => state.token);
  const segments = useSegments();

  const inProtected = segments[0] === "(protected)";

  if (!token && inProtected) {
    return <Redirect href="/(public)/login" />;
  }

  return <Slot />;
};

export default ProtectedLayout;
