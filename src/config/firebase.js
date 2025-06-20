import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fundkaro.firebaseapp.com",
  projectId: "fundkaro",
  storageBucket: "fundkaro.appspot.com",
  messagingSenderId: "916922630529",
  appId: "1:916922630529:web:d082c4412b3808d65da880"
};
export const app = initializeApp(firebaseConfig);