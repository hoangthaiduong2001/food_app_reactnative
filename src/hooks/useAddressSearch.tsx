import { useState } from "react";

export type AddressItem = {
  name: string;
  lat: string;
  lon: string;
};

export const useAddressSearch = () => {
  const [results, setResults] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (text: string) => {
    if (!text) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN!}&country=vn&limit=5`,
      );

      const data = await res.json();

      setResults(
        data.features.map((item: any) => ({
          name: item.place_name,
          lat: item.center[1],
          lon: item.center[0],
        })),
      );
    } catch (e) {
      console.log("Mapbox error:", e);
    } finally {
      setLoading(false);
    }
  };
  const clearResults = () => setResults([]);

  return { results, loading, search, clearResults };
};
