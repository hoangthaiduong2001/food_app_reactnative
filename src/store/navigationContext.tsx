import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface NavigationContextType {
  isReady: boolean;
}

const NavigationContext = createContext<NavigationContextType>({
  isReady: false,
});

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Delay to ensure navigation context is fully initialized
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContext.Provider value={{ isReady }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationReady = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      "useNavigationReady must be used within NavigationProvider",
    );
  }
  return context.isReady;
};
