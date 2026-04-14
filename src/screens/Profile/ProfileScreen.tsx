import { useLogoutMutation } from "@/apis/hooks/auth";
import {
  useGetProfile,
  useUpdateProfileMutation,
  useUploadImage,
} from "@/apis/hooks/profile";
import Loading from "@/components/Loading";
import { useAuthStore } from "@/store/auth";
import { showError, showSuccess } from "@/utils/toast";
import { getRefreshToken } from "@/utils/tokenStorage";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileScreen = () => {
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    username: "",
    phone: "",
    address: "",
    img: "",
  });
  const { setToken, logout, userId, setUser, hasWallet } =
    useAuthStore.getState();
  const { mutate: logoutMutate } = useLogoutMutation();
  const { data, isLoading } = useGetProfile();
  const { mutateAsync: uploadImage } = useUploadImage();
  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();

  const user = data?.data;

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      showError("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setSelectedImage(asset);

      setForm((prev) => ({
        ...prev,
        img: asset.uri,
      }));
    }
  };

  const handleLogout = async () => {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      setToken("");
      return;
    }

    logoutMutate(
      { refreshToken },
      {
        onSuccess: () => {
          setToken("");
          logout();
        },
        onError: () => {
          setToken("");
        },
      },
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      let imageUrl = user?.img;

      if (selectedImage) {
        const uploadRes = await uploadImage(selectedImage);
        imageUrl = uploadRes.url;
      }

      const payload = {
        ...form,
        img: imageUrl,
      };
      await new Promise<void>((resolve, reject) => {
        updateProfile(payload, {
          onSuccess: () => resolve(),
          onError: (err) => reject(err),
        });
      });
      setUser(userId, payload.username, hasWallet);
      showSuccess("Profile updated successfully");
      setIsEditing(false);
      setSelectedImage(null);
    } catch (err: any) {
      console.log(err);
      showError(err?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        phone: user.phone || "",
        address: user.address || "",
        img: user.img || "",
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="bg-orange-400 pt-16 pb-12 items-center rounded-b-3xl">
        <TouchableOpacity onPress={handlePickImage} disabled={!isEditing}>
          <Image
            source={{ uri: form.img || user?.img }}
            className="w-24 h-24 rounded-full border-4 border-white"
          />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold mt-3">
          {user?.username}
        </Text>

        <Text className="text-white/80">{user?.email}</Text>
      </View>

      <View className="bg-white mx-4 mt-6 p-5 rounded-3xl">
        <Text className="text-gray-500 mb-1">Username</Text>
        <TextInput
          value={form.username}
          editable={isEditing}
          onChangeText={(text) => setForm({ ...form, username: text })}
          className={`border rounded-xl p-3 mb-4 ${
            isEditing ? "border-orange-400" : "border-gray-200 bg-gray-100"
          }`}
        />

        <Text className="text-gray-500 mb-1">Phone</Text>
        <TextInput
          value={form.phone}
          editable={isEditing}
          keyboardType="phone-pad"
          onChangeText={(text) => setForm({ ...form, phone: text })}
          className={`border rounded-xl p-3 mb-4 ${
            isEditing ? "border-orange-400" : "border-gray-200 bg-gray-100"
          }`}
        />

        <Text className="text-gray-500 mb-1">Address</Text>
        <TextInput
          value={form.address}
          editable={isEditing}
          onChangeText={(text) => setForm({ ...form, address: text })}
          className={`border rounded-xl p-3 ${
            isEditing ? "border-orange-400" : "border-gray-200 bg-gray-100"
          }`}
        />

        <TouchableOpacity
          disabled={isPending}
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          className={`py-4 rounded-2xl items-center mt-5 ${
            isPending ? "bg-gray-300" : "bg-orange-500"
          }`}
        >
          <Text className="text-white font-semibold text-lg">
            {isPending
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Edit Profile"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mx-4 mt-6 mb-10">
        <TouchableOpacity
          className="bg-red-500 py-4 rounded-2xl items-center"
          onPress={handleLogout}
        >
          <Text className="text-white font-semibold text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <View className="absolute inset-0 bg-black/40 items-center justify-center z-50">
          <View className="bg-white px-6 py-5 rounded-2xl items-center">
            <Loading fullScreen overlay />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default ProfileScreen;
