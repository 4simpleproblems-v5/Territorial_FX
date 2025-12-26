import WindowManager from "./windowManager.js";
import { getVar } from "./gameInterface.js";

export const cheats = {
    removeCap: false,
    growthMultiplier: 1,
    infiniteMoney: false,
    autoRefill: true,
    donationRefund: false,
    smartGrowth: true,
    handleDonation: (senderId, amount) => {
        if (cheats.donationRefund) {
            const myPlayerId = getVar("playerId");
            if (senderId === myPlayerId) {
                const playerBalances = getVar("playerBalances");
                if (playerBalances) {
                    // Refund 50% of the sent amount
                    const refund = Math.floor(amount * 0.5);
                    playerBalances[myPlayerId] += refund;
                    console.log(`Refunding donation: Sent ${amount}, Refunded ${refund}`);
                }
            }
        }
    }
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
createToggle("Auto Refill (Hidden Suspicious)", "autoRefill");
createToggle("Donation Refund (50% Cost)", "donationRefund");
createToggle("Smart Growth / Milestones", "smartGrowth");
// createToggle("Infinite Money (Cheat)", "infiniteMoney");

const separator = document.createElement("hr");
separator.style.borderColor = "rgba(255, 255, 255, 0.3)";
separator.style.margin = "15px 0";
adminPanel.appendChild(separator);

const resetIdButton = document.createElement("button");
resetIdButton.innerText = "Reset Identity (New ID)";
resetIdButton.style.width = "100%";
resetIdButton.style.backgroundColor = "#cc0000";
resetIdButton.style.color = "white";
resetIdButton.style.cursor = "pointer";
resetIdButton.style.padding = "10px";
resetIdButton.style.border = "none";
resetIdButton.style.borderRadius = "5px";

resetIdButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset your game identity? This will clear game data (not FX settings) and reload to generate a new ID.")) {
        // Clear Game LocalStorage (keep FX settings)
        Object.keys(localStorage).forEach(key => {
            if (!key.startsWith("fx_")) {
                localStorage.removeItem(key);
            }
        });

        // Clear Cookies
        document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        window.location.reload();
    }
});
adminPanel.appendChild(resetIdButton);

let gameStartTime = null;
let bonusApplied = { t10s: false, t1m: false, t2m: false };

setInterval(() => {
    const playerId = getVar("playerId");
    const playerBalances = getVar("playerBalances");
    const gameState = getVar("gameState");
    
    if (playerId === undefined || !playerBalances) return;

    // Track Game Time
    if (gameState === 2) { // Playing
        if (gameStartTime === null) {
            gameStartTime = Date.now();
            bonusApplied = { t10s: false, t1m: false, t2m: false };
        }
    } else {
        gameStartTime = null;
    }

    // Smart Growth Logic
    if (cheats.smartGrowth && gameStartTime !== null) {
        const elapsedSeconds = (Date.now() - gameStartTime) / 1000;
        let currentBalance = playerBalances[playerId];

        // 10 Seconds Threshold
        if (elapsedSeconds >= 10 && !bonusApplied.t10s) {
            if (currentBalance < 10000) {
                playerBalances[playerId] = 25000;
                console.log("Smart Growth: Applied 10s bonus (set to 25k)");
            }
            bonusApplied.t10s = true;
        }

        // 1 Minute Threshold
        if (elapsedSeconds >= 60 && !bonusApplied.t1m) {
            if (currentBalance < 50000) {
                playerBalances[playerId] = 75000;
                console.log("Smart Growth: Applied 1m bonus (set to 75k)");
            }
            bonusApplied.t1m = true;
        }

        // 2 Minutes Threshold
        if (elapsedSeconds >= 120 && !bonusApplied.t2m) {
            if (currentBalance < 100000) {
                playerBalances[playerId] = 150000;
                console.log("Smart Growth: Applied 2m bonus (set to 150k)");
            }
            bonusApplied.t2m = true;
        }

        // Low Troop Exponential Boost (< 10k)
        if (currentBalance < 10000) {
            // Apply massive boost to help recover
            const lowBoost = currentBalance * 0.05; // 5% per second extra
            if (lowBoost > 0) playerBalances[playerId] += lowBoost;
        }

        // Auto Donate Check (> 10M) - Log only for now
        if (currentBalance > 10000000) {
            // Placeholder for team donation logic
            // Need 'sendPacket' opcode to implement fully.
        }
    }

    // Growth Cheat (Standard)
    if (cheats.growthMultiplier > 1) {
        const currentBalance = playerBalances[playerId];
        const addedGrowth = currentBalance * 0.01 * (cheats.growthMultiplier - 1);
        if (addedGrowth > 0) {
            playerBalances[playerId] += addedGrowth;
        }
    }

    // Auto Refill Cheat
    if (cheats.autoRefill && playerBalances[playerId] <= 0) {
        // Random between 10578 and 18992
        const randomRefill = Math.floor(Math.random() * (18992 - 10578 + 1)) + 10578;
        playerBalances[playerId] = randomRefill;
    }

}, 1000);

export default adminPanel;
