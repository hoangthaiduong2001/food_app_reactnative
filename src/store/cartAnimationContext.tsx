import { createContext, useContext, useRef } from "react";
import { View } from "react-native";

type CartContextType = {
  cartRef: React.RefObject<View | null>;
};

const CartAnimationContext = createContext<CartContextType | null>(null);

export const useCartAnimation = () => {
  const context = useContext(CartAnimationContext);
  if (!context) throw new Error("Missing CartAnimationProvider");
  return context;
};

export const CartAnimationProvider = ({ children }: any) => {
  const cartRef = useRef<View>(null);

  return (
    <CartAnimationContext.Provider value={{ cartRef }}>
      {children}
    </CartAnimationContext.Provider>
  );
};
