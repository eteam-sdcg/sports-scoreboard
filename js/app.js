import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const container = document.querySelector(".scoreboard");

const houses = {
  opal: document.querySelector(".house.opal"),
  crystal: document.querySelector(".house.crystal"),
  diamond: document.querySelector(".house.diamond"),
  sapphire: document.querySelector(".house.sapphire"),
};

const scoresRef = ref(db, "totalScores");

onValue(scoresRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  // 1️⃣ record old positions
  const firstPos = {};
  Object.keys(houses).forEach(k => {
    houses[k].classList.remove("first", "moving-up", "moving-down");
    firstPos[k] = houses[k].getBoundingClientRect().top;
  });

  // 2️⃣ update numbers
  Object.keys(houses).forEach(k => {
    houses[k].querySelector(".score").textContent = data[k] ?? 0;
  });

  // 3️⃣ sort by score
  const sorted = Object.keys(houses)
    .map(k => ({ key: k, score: data[k] ?? 0 }))
    .sort((a, b) => b.score - a.score);

  // 4️⃣ reorder DOM
  sorted.forEach(item => container.appendChild(houses[item.key]));

  // 5️⃣ animate movement (FLIP)
  sorted.forEach(item => {
    const el = houses[item.key];
    const last = el.getBoundingClientRect().top;
    const delta = firstPos[item.key] - last;

    if (delta !== 0) {
      el.style.transform = `translateY(${delta}px)`;
      el.offsetHeight; // force repaint
      el.style.transform = "translateY(0)";
      el.classList.add(delta > 0 ? "moving-up" : "moving-down");
    }
  });

  // 6️⃣ glow first place
  houses[sorted[0].key].classList.add("first");
});
