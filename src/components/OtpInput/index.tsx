import React, { useRef } from "react";
import { TextInput, View } from "react-native";

type OtpInputProps = {
  value: string;
  onChange: (val: string) => void;
};

const OtpInput = ({ value, onChange }: OtpInputProps) => {
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newValue = value.split("");
    newValue[index] = text;

    const otp = newValue.join("").slice(0, 4);
    onChange(otp);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (index > 0 && !value[index]) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-between mt-6">
      {[0, 1, 2, 3].map((i) => (
        <TextInput
          key={i}
          ref={(ref) => {
            if (ref) inputs.current[i] = ref;
          }}
          value={value[i] || ""}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Backspace") handleBackspace(i);
          }}
          keyboardType="number-pad"
          maxLength={1}
          className="w-16 h-16 text-center text-xl font-bold border border-gray-300 rounded-xl"
        />
      ))}
    </View>
  );
};

export default OtpInput;
