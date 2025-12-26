import { cheats } from "./adminPanel.js";
import { getVar } from "./gameInterface.js";

let ctrlPressCount = 0;
let lastCtrlPressTime = 0;
let godModeActive = false;

function activateGodMode() {
    godModeActive = true;
    
    // Enable all power cheats
    cheats.removeCap = true;
    cheats.attackPower = true; // 100x Growth
    cheats.autoRefill = true;
    cheats.growthMultiplier = 100; // Visual slider max
    cheats.smartGrowth = true; // Ensure base exp growth is on too

    // Show visual confirmation
    const notification = document.createElement("div");
    notification.innerText = "GOD MODE ACTIVATED";
    notification.style.position = "fixed";
    notification.style.top = "20%";
    notification.style.left = "50%";
    notification.style.transform = "translate(-50%, -50%)";
    notification.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
    notification.style.color = "white";
    notification.style.padding = "20px";
    notification.style.fontSize = "30px";
    notification.style.fontWeight = "bold";
    notification.style.borderRadius = "10px";
    notification.style.zIndex = "30000";
    notification.style.pointerEvents = "none";
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
    console.log("God Mode Activated: Infinite Density, 100x Growth, Auto Refill");
}

function deactivateGodMode() {
    godModeActive = false;
    cheats.attackPower = false;
    // We leave removeCap and autoRefill as they might be user preference, 
    // or we can toggle them off. Let's toggle Attack Power off as the main indicator.
    
    const notification = document.createElement("div");
    notification.innerText = "God Mode Deactivated";
    notification.style.position = "fixed";
    notification.style.top = "20%";
    notification.style.left = "50%";
    notification.style.transform = "translate(-50%, -50%)";
    notification.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    notification.style.color = "white";
    notification.style.padding = "20px";
    notification.style.fontSize = "20px";
    notification.style.borderRadius = "10px";
    notification.style.zIndex = "30000";
    notification.style.pointerEvents = "none";
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 2000);
}

export default function initAutoMode() {
    document.addEventListener("keydown", (e) => {
        if (e.key === "Control") {
            const now = Date.now();
            if (now - lastCtrlPressTime < 400) { // 400ms between presses
                ctrlPressCount++;
            } else {
                ctrlPressCount = 1;
            }
            lastCtrlPressTime = now;

            if (ctrlPressCount === 3) {
                if (!godModeActive) activateGodMode();
                else deactivateGodMode();
                ctrlPressCount = 0; // Reset
            }
        }
    });

    // Constant God Specs Maintenance Loop
    setInterval(() => {
        if (godModeActive) {
            const playerId = getVar("playerId");
            const playerBalances = getVar("playerBalances");
            
            if (playerId !== undefined && playerBalances) {
                // "Give it god specs" -> Ensure balance is always massive
                // If it drops below 1 Billion, refill it instantly to 1 Trillion
                if (playerBalances[playerId] < 1e9) {
                    playerBalances[playerId] = 1e12; 
                }
                
                // Note: Automatic land acquisition would go here if we had map access.
                // For now, the user has infinite troops to do it manually instantly.
            }
        }
    }, 100);
}
