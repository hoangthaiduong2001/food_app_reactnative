import { useAddressSearch } from "@/hooks/useAddressSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AddressPickerProps } from "./type";

const AddressPicker = ({ onSelect }: AddressPickerProps) => {
  const { results, search, clearResults } = useAddressSearch();
  const [text, setText] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const debouncedText = useDebounce(text, 500);

  const handleChange = (value: string) => {
    setText(value);
  };

  useEffect(() => {
    if (debouncedText) {
      search(debouncedText);
    } else {
      clearResults();
    }
  }, [debouncedText]);

  return (
    <View className="relative">
      <TextInput
        value={text}
        onChangeText={handleChange}
        onFocus={() => setIsFocus(true)}
        placeholder="Search address..."
        placeholderTextColor="#9CA3AF"
        className="border border-gray-300 rounded-xl p-3"
      />

      {isFocus && (
        <Pressable
          style={{
            position: "absolute",
            top: -1000,
            bottom: -1000,
            left: -1000,
            right: -1000,
            zIndex: 40,
          }}
          onPress={() => {
            setIsFocus(false);
            Keyboard.dismiss();
          }}
        />
      )}

      {isFocus && results.length > 0 && (
        <View className="absolute top-14 left-0 right-0 bg-white border rounded-xl z-50 max-h-60 shadow">
          <ScrollView keyboardShouldPersistTaps="always">
            {results.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  Keyboard.dismiss();
                  onSelect(item);
                  setText("");
                  setIsFocus(false);
                  clearResults();
                }}
                className="p-3 border-b border-gray-100"
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default AddressPicker;
