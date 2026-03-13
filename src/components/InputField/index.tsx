import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  ...inputProps
}) => {
  return (
    <View className="mt-7">
      <Text className="text-sm text-gray-500 font-semibold mb-2">{label}</Text>
      <TextInput
        {...inputProps}
        placeholderTextColor="#9CA3AF"
        className="bg-gray-100 rounded-2xl px-5 py-3 text-base"
      />

      {error && <Text className="text-red-500 text-sm mt-2">{error}</Text>}
    </View>
  );
};

export default InputField;
