import { AddressItem } from "@/hooks/useAddressSearch";

export interface AddressPickerProps {
  onSelect: (item: AddressItem) => void;
}
