import WindowManager from "./windowManager.js";
import { getVar } from "./gameInterface.js";

export const cheats = {
    removeCap: false,
    growthMultiplier: 1,
    infiniteMoney: false
};

const adminPanel = WindowManager.create({
    name: "adminPanel",
    classes: "window",
    closeWithButton: true
});

adminPanel.style.width = "400px";
adminPanel.style.color = "white";

const title = document.createElement("h2");
title.innerText = "Admin Panel";
title.style.textAlign = "center";
adminPanel.appendChild(title);

function createToggle(labelText, cheatKey) {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "space-between";
    container.style.marginBottom = "10px";

    const label = document.createElement("label");
    label.innerText = labelText;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = cheats[cheatKey];
    input.addEventListener("change", (e) => {
        cheats[cheatKey] = e.target.checked;
    });

    container.appendChild(label);
    container.appendChild(input);
    adminPanel.appendChild(container);
}

function createSlider(labelText, cheatKey, min, max, step) {
    const container = document.createElement("div");
    container.style.marginBottom = "10px";

    const topRow = document.createElement("div");
    topRow.style.display = "flex";
    topRow.style.justifyContent = "space-between";

    const label = document.createElement("label");
    label.innerText = labelText;

    const valueDisplay = document.createElement("span");
    valueDisplay.innerText = cheats[cheatKey];

    topRow.appendChild(label);
    topRow.appendChild(valueDisplay);

    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = cheats[cheatKey];
    input.style.width = "100%";
    input.addEventListener("input", (e) => {
        cheats[cheatKey] = parseFloat(e.target.value);
        valueDisplay.innerText = cheats[cheatKey];
    });

    container.appendChild(topRow);
    container.appendChild(input);
    adminPanel.appendChild(container);
}

createToggle("Remove Population Cap (150 limit)", "removeCap");
createSlider("Population Growth Scale (Interest)", "growthMultiplier", 1, 10, 0.5);
// createToggle("Infinite Money (Cheat)", "infiniteMoney");

setInterval(() => {
    if (cheats.growthMultiplier <= 1) return;

    const playerId = getVar("playerId");
    const playerBalances = getVar("playerBalances");
    
    if (playerId === undefined || !playerBalances) return;

    const currentBalance = playerBalances[playerId];
    
    // Simulating extra interest.
    // Base interest in game is roughly ~1% per tick or second?
    // We will add (Multiplier - 1)% of current balance every second.
    // If Multiplier is 2, we add 1% extra every second.
    const addedGrowth = currentBalance * 0.01 * (cheats.growthMultiplier - 1);
    
    if (addedGrowth > 0) {
        playerBalances[playerId] += addedGrowth;
    }
}, 1000);

export default adminPanel;
