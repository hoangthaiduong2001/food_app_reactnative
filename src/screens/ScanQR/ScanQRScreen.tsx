import Loading from "@/components/Loading";
import { normalizeQR } from "@/utils/format";
import { showError, showSuccess } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ScanQRScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const amount = Number(params.amount || 0);
  const isProcessing = useRef(false);

  const handleParseQR = async (data: string): Promise<boolean> => {
    try {
      const normalized = normalizeQR(data);
      const parsed = JSON.parse(normalized);

      if (parsed.type === "vnpay" && parsed.status === "success") {
        showSuccess("Top up success");
        return true;
      } else {
        showError("Invalid QR");
        return false;
      }
    } catch {
      showError("Invalid QR");
      return false;
    }
  };

  const scanQRFromImage = async (uri: string) => {
    const formData = new FormData();

    formData.append("file", {
      uri,
      name: "qr.jpg",
      type: "image/jpeg",
    } as any);

    const res = await fetch("https://api.qrserver.com/v1/read-qr-code/", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    const data = result?.[0]?.symbol?.[0]?.data;

    if (!data || data.startsWith("error")) {
      throw new Error("Scan error");
    }

    return data;
  };

  const pickImageAndScan = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showError("Permission denied");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.canceled) return;

      setLoading(true);

      const uri = result.assets[0].uri;
      const data = await scanQRFromImage(uri);

      const isSuccess = await handleParseQR(data);

      if (isSuccess) {
        router.replace({
          pathname: "/(protected)/pinTopUp",
          params: {
            amount: String(amount),
          },
        });
      } else {
        setScanned(false);
      }
    } catch {
      showError("Scan fail");
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async ({ data }: any) => {
    if (isProcessing.current || loading) return;

    isProcessing.current = true;
    setScanned(true);
    setLoading(true);

    try {
      const isSuccess = await handleParseQR(data);

      if (isSuccess) {
        router.replace({
          pathname: "/(protected)/pinTopUp",
          params: {
            amount: String(amount),
          },
        });
      } else {
        setScanned(false);
        isProcessing.current = false;
      }
    } finally {
      setLoading(false);
    }
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Ionicons name="camera-outline" size={40} color="#f97316" />

        <Text className="text-lg font-semibold mt-4">Allow Camera Access</Text>

        <TouchableOpacity
          onPress={requestPermission}
          className="bg-orange-500 px-6 py-3 rounded-xl mt-6"
        >
          <Text className="text-white">Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />

      {loading && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center">
          <Loading />
        </View>
      )}

      <View className="absolute bottom-10 w-full items-center gap-3">
        <TouchableOpacity
          onPress={pickImageAndScan}
          className="bg-orange-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white">Scan from Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white px-6 py-3 rounded-full"
        >
          <Text>Cancel</Text>
        </TouchableOpacity>

        {scanned && !loading && (
          <TouchableOpacity
            onPress={() => {
              isProcessing.current = false;
              setScanned(false);
            }}
          >
            <Text className="text-blue-500 mt-2">Tap to Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ScanQRScreen;
