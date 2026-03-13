import Constants from "expo-constants";

const hostUri =
  Constants.expoConfig?.hostUri ??
  Constants.manifest?.debuggerHost ??
  Constants.manifest2?.extra?.expoGo?.debuggerHost;

const ip = hostUri?.split(":")[0];

export const API_URL = ip ? `http://${ip}:3000` : "http://localhost:3000";
