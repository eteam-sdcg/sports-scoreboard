import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-NIELoMlHeAOQ04hhOqMxuXIlgUmAnPs",
  authDomain: "sports-live-scoreboard.firebaseapp.com",
  databaseURL: "https://sports-live-scoreboard-default-rtdb.firebaseio.com",
  projectId: "sports-live-scoreboard",
  storageBucket: "sports-live-scoreboard.firebasestorage.app",
  messagingSenderId: "467601433134",
  appId: "1:467601433134:web:59ae2c876b62e5c3d575bf"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
