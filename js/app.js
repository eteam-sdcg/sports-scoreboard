import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Parent container (THIS MATCHES YOUR HTML)
const container = document.querySelector(".scoreboard");

// House elements
const houses = {
  opal: document.querySelector(".house.opal"),
  crystal: document.querySelector(".house.crystal"),
  diamond: document.querySelector(".house.diamond"),
  sapphire: document.querySelector(".house.sapphire"),
};

// Score spans
const scores = {
  opal: houses.opal.querySelector(".score"),
  crystal: houses.crystal.querySelector(".score"),
  diamond: houses.diamond.querySelector(".score"),
  sapphire: houses.sapphire.querySelector(".score"),
};

// Sound (optional)
const rankSound = document.getElementById("rankSound");

// Firebase listener
const scoresRef = ref(db, "totalScores");

let lastOrder = [];

onValue(scoresRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  // Update numbers
  Object.keys(scores).forEach((key) => {
    scores[key].textContent = data[key] ?? 0;
  });

  // Sort highest → lowest
  const sorted = Object.keys(houses)
    .map((key) => ({
      key,
      score: data[key] ?? 0,
    }))
    .sort((a, b) => b.score - a.score);

  const newOrder = sorted.map(item => item.key).join(",");

  // Play sound only if ranking changed
  if (newOrder !== lastOrder.join(",")) {
    rankSound?.play().catch(() => {});
    lastOrder = newOrder.split(",");
  }

  // Reorder DOM
  sorted.forEach(({ key }) => {
    container.appendChild(houses[key]);
  });
});
