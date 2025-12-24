import { db } from "./firebase.js";
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// CHANGE THIS PASSWORD
const ADMIN_PASSWORD = "sports2025";

const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");
const loginError = document.getElementById("loginError");
const status = document.getElementById("status");

window.login = function () {
  const pass = document.getElementById("adminPassword").value;

  if (pass === ADMIN_PASSWORD) {
    loginBox.style.display = "none";
    adminPanel.style.display = "block";
  } else {
    loginError.textContent = "Wrong password";
  }
};

// Load existing scores into inputs
const scoresRef = ref(db, "totalScores");

onValue(scoresRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  document.getElementById("sapphire").value = data.sapphire;
  document.getElementById("crystal").value = data.crystal;
  document.getElementById("opal").value = data.opal;
  document.getElementById("diamond").value = data.diamond;
});

window.updateScores = function () {
  const newScores = {
    sapphire: Number(document.getElementById("sapphire").value),
    crystal: Number(document.getElementById("crystal").value),
    opal: Number(document.getElementById("opal").value),
    diamond: Number(document.getElementById("diamond").value)
  };

  set(ref(db, "totalScores"), newScores)
    .then(() => {
      status.textContent = "Scores updated successfully ✅";
      status.style.color = "green";
    })
    .catch(() => {
      status.textContent = "Error updating scores ❌";
      status.style.color = "red";
    });
};
