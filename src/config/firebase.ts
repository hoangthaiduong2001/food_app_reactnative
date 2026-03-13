import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDwoz6c8Tq6InnTF2WWW_DMNGl3h6qErrI",
  authDomain: "cloud-image-food-app.firebaseapp.com",
  projectId: "cloud-image-food-app",
  storageBucket: "cloud-image-food-app.firebasestorage.app",
  messagingSenderId: "516321053257",
  appId: "1:516321053257:web:8a8a63f1f1b5e1b52c0d98",
  measurementId: "G-EBEMQXB9ER",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
