import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const houses = {
  opal: document.querySelector(".house.opal"),
  crystal: document.querySelector(".house.crystal"),
  diamond: document.querySelector(".house.diamond"),
  sapphire: document.querySelector(".house.sapphire"),
};

const scores = {
  opal: houses.opal.querySelector(".score"),
  crystal: houses.crystal.querySelector(".score"),
  diamond: houses.diamond.querySelector(".score"),
  sapphire: houses.sapphire.querySelector(".score"),
};

const scoresRef = ref(db, "totalScores");

// Track previous order
let previousOrder = [];

onValue(scoresRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  // Update numbers
  Object.keys(scores).forEach((key) => {
    scores[key].textContent = data[key] ?? 0;
  });

  // Sort by score (high → low)
  const sorted = Object.keys(houses)
    .map((key) => ({
      key,
      score: data[key] ?? 0,
    }))
    .sort((a, b) => b.score - a.score);

  const currentOrder = sorted.map(item => item.key);

  // Apply animation direction
  currentOrder.forEach((key, newIndex) => {
    const oldIndex = previousOrder.indexOf(key);

    houses[key].classList.remove("moving-up", "moving-down");

    if (oldIndex !== -1) {
      if (newIndex < oldIndex) {
        houses[key].classList.add("moving-up");
      } else if (newIndex > oldIndex) {
        houses[key].classList.add("moving-down");
      }
    }

    // Flexbox ranking
    houses[key].style.order = newIndex;
  });

  previousOrder = currentOrder;
});
