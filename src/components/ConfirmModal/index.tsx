import { Modal, Text, TouchableOpacity, View } from "react-native";

type ConfirmModalProps = {
  visible: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

const ConfirmModal = ({
  visible,
  title = "Confirm",
  message = "Are you sure?",
  onCancel,
  onConfirm,
  loading,
}: ConfirmModalProps) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View className="flex-1 bg-black/40 items-center justify-center px-6">
        <View className="bg-white w-full rounded-2xl p-5">
          <Text className="text-lg font-bold text-center">{title}</Text>

          <Text className="text-gray-500 text-center mt-2">{message}</Text>

          <View className="flex-row mt-5 gap-3">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 py-3 rounded-xl bg-gray-200 items-center"
            >
              <Text className="font-semibold text-gray-700">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={loading}
              onPress={onConfirm}
              className={`flex-1 py-3 rounded-xl items-center ${
                loading ? "bg-gray-400" : "bg-red-500"
              }`}
            >
              <Text className="font-semibold text-white">
                {loading ? "Deleting..." : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
