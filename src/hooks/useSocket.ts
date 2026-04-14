import { useAuthStore } from "@/store/auth";
import { socket } from "@/utils/socket";
import { useEffect } from "react";

export const useSocket = () => {
  const userId = useAuthStore((s) => s.userId);

  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("register", userId);

    return () => {};
  }, [userId]);

  return socket;
};
