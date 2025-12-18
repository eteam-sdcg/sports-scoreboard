import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const scoreboard = document.getElementById("scoreboard");

const leaderBanner = document.getElementById("leaderBanner");


// Store previous ranks
let previousRanks = {};

const scoresRef = ref(db, "totalScores");

onValue(scoresRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;


  // Sort by score (high → low)
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);

// Show leader banner
const [leaderHouse, leaderScore] = sorted[0];
leaderBanner.innerHTML = `🏆 TODAY'S LEADER: ${leaderHouse.toUpperCase()} – ${leaderScore} POINTS`;


  scoreboard.innerHTML = "";

  sorted.forEach(([house, score], index) => {
    const currentRank = index + 1;
    const prevRank = previousRanks[house];

    const card = document.createElement("div");
    card.className = `card ${house} ${index === 0 ? "leader" : ""}`;

    // Detect movement
    if (prevRank) {
      if (currentRank < prevRank) {
        card.classList.add("move-up");
      } else if (currentRank > prevRank) {
        card.classList.add("move-down");
      }
    }

    card.innerHTML = `
      <span>${currentRank}. ${house.toUpperCase()}</span>
      <strong>${score}</strong>
    `;

    scoreboard.appendChild(card);

    // Save rank for next update
    previousRanks[house] = currentRank;
  });
});
