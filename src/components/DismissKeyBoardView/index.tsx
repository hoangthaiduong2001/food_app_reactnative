import React from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Props = {
  children: React.ReactNode;
};

const DismissKeyboardView = ({ children }: Props) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container} pointerEvents="box-none">
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
