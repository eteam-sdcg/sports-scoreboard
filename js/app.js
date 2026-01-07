import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Select score elements (order matches your HTML)
const scoreElements = {
  opal: document.querySelector(".house.opal .score"),
  crystal: document.querySelector(".house.crystal .score"),
  diamond: document.querySelector(".house.diamond .score"),
  sapphire: document.querySelector(".house.sapphire .score"),
};

// Listen to Firebase
const scoresRef = ref(db, "totalScores");

onValue(scoresRef, (snapshot) => {
  const data = snapshot.val();

  if (!data) return;

  scoreElements.opal.textContent = data.opal ?? 0;
  scoreElements.crystal.textContent = data.crystal ?? 0;
  scoreElements.diamond.textContent = data.diamond ?? 0;
  scoreElements.sapphire.textContent = data.sapphire ?? 0;
});
