
// public/js/app.js

// Firebase SDK - يُفضل وضعها في بداية الملف
// هذه الروابط لآخر إصدار مستقر من Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
// لاحظ أننا لم نقم باستيراد Storage هنا لأننا لن نستخدمها
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";



  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC-pZm-mV7fvfMFVEqOq1s5vnoVHQ4Olc4",
    authDomain: "money-969a6.firebaseapp.com",
    projectId: "money-969a6",
    storageBucket: "money-969a6.firebasestorage.app",
    messagingSenderId: "51946916024",
    appId: "1:51946916024:web:e50cb67494fe5305f14c4d"
  };

// تهيئة خدمات Firebase التي سنستخدمها
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const storage = getStorage(app); // تم إلغاء التعليق لأننا لن نستخدم Storage لتجنب التكاليف

// **هنا سنبدأ بكتابة باقي منطق التطبيق**
// ...
