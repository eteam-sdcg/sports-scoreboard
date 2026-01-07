import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const container = document.querySelector(".houses"); // parent container

// Map house name → element
const houses = {
  opal: document.querySelector(".house.opal"),
  crystal: document.querySelector(".house.crystal"),
  diamond: document.querySelector(".house.diamond"),
  sapphire: document.querySelector(".house.sapphire"),
};

// Score elements
const scores = {
  opal: houses.opal.querySelector(".score"),
  crystal: houses.crystal.querySelector(".score"),
  diamond: houses.diamond.querySelector(".score"),
  sapphire: houses.sapphire.querySelector(".score"),
};

// Firebase listener
const scoresRef = ref(db, "totalScores");

onValue(scoresRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  // Update numbers
  Object.keys(scores).forEach((key) => {
    scores[key].textContent = data[key] ?? 0;
  });

  // ---- RANKING LOGIC ----
  const sorted = Object.keys(data)
    .map((key) => ({
      key,
      score: data[key] ?? 0,
    }))
    .sort((a, b) => b.score - a.score);

  // Reorder DOM
  sorted.forEach(({ key }) => {
    container.appendChild(houses[key]);
  });
});
