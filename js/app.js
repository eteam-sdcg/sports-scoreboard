import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

const board = document.querySelector(".scoreboard");
let previousRanks = {};

const rankSound = document.getElementById("rankSound");
let userInteracted = false;

// allow sound after first click/touch
document.addEventListener("click", () => {
  userInteracted = true;
}, { once: true });


// DOM references
const houseEls = {
  opal: document.querySelector(".house.opal"),
  crystal: document.querySelector(".house.crystal"),
  diamond: document.querySelector(".house.diamond"),
  sapphire: document.querySelector(".house.sapphire")
};

// listen scores
onValue(ref(db, "totalScores"), (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  // convert to array
  const houses = Object.keys(data).map(key => ({
    key,
    score: data[key]
  }));

  // sort high → low
  houses.sort((a, b) => b.score - a.score);

  // remove old first class
  Object.values(houseEls).forEach(el => el.classList.remove("first"));

  // render order + animation
  houses.forEach((house, index) => {
    const el = houseEls[house.key];
    const scoreEl = el.querySelector(".score");

    // rank movement animation
if (previousRanks[house.key] !== undefined) {
  const diff = previousRanks[house.key] - index;

  if (diff !== 0) {
    // play sound once per update
    if (userInteracted) {
      rankSound.currentTime = 0;
      rankSound.play();
    }

    el.style.transform = `translateY(${diff * 20}px)`;
    setTimeout(() => {
      el.style.transform = "translateY(0)";
    }, 50);
  }
}


    // move element in DOM
    board.appendChild(el);

    // smooth score count-up
    animateNumber(scoreEl, Number(scoreEl.textContent), house.score);

    // first place glow
    if (index === 0) {
      el.classList.add("first");
    }

    previousRanks[house.key] = index;
  });
});

// smooth number animation
function animateNumber(el, start, end) {
  const duration = 800;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    el.textContent = Math.floor(start + (end - start) * progress);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}
