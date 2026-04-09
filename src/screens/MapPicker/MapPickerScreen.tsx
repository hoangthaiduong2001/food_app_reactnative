import { Ionicons } from "@expo/vector-icons";
import Mapbox from "@rnmapbox/maps";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN!);

const MapPickerScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [location, setLocation] = useState<[number, number] | null>(null);

  const handleSelect = async () => {
    if (!location) return;

    const [lon, lat] = location;

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN!}`,
    );
    const data = await res.json();

    const address = data?.features?.[0]?.place_name;

    if (!address) return;

    router.push({
      pathname: "/(protected)/payment",
      params: {
        items: params.items,
        address,
        lat,
        lon,
      },
    });
  };

  return (
    <View className="flex-1">
      <View className="absolute top-12 left-4 z-50">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white p-2 rounded-full shadow"
        >
          <Ionicons name="arrow-back" size={20} />
        </TouchableOpacity>
      </View>
      <Mapbox.MapView
        style={{ flex: 1 }}
        onPress={(e) => {
          const coords = e.geometry.coordinates as [number, number];
          setLocation(coords);
        }}
      >
        <Mapbox.Camera zoomLevel={14} centerCoordinate={[106.7, 10.8]} />

        {location && (
          <Mapbox.PointAnnotation id="marker" coordinate={location}>
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: "red",
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "#fff",
              }}
            />
          </Mapbox.PointAnnotation>
        )}
      </Mapbox.MapView>

      <TouchableOpacity
        onPress={handleSelect}
        className="absolute bottom-10 left-5 right-5 bg-orange-500 p-4 rounded-xl"
      >
        <Text className="text-white text-center font-bold">
          Select this location
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapPickerScreen;
