import { cheats } from "./adminPanel.js";
import { getVar } from "./gameInterface.js";

function createOverlay() {
    console.log("Creating FX Overlay UI...");
    const container = document.createElement("div");
    container.id = "fx-overlay-ui";
    container.style.position = "absolute";
    container.style.bottom = "200px";
    container.style.right = "10px";
    container.style.left = "auto";
    container.style.width = "200px";
    container.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    container.style.padding = "10px";
    container.style.borderRadius = "5px";
    container.style.color = "white";
    container.style.display = "none";
    container.style.zIndex = "10000";
    container.style.fontFamily = "Trebuchet MS, sans-serif";
    container.style.fontSize = "12px";
    container.style.pointerEvents = "auto";

    // --- Growth Slider ---
    const labelRow = document.createElement("div");
    labelRow.style.display = "flex";
    labelRow.style.justifyContent = "space-between";
    labelRow.style.marginBottom = "5px";

    const label = document.createElement("span");
    label.innerText = "Growth Mod";
    
    const valueDisplay = document.createElement("span");
    valueDisplay.innerText = cheats.growthMultiplier + "x";

    labelRow.appendChild(label);
    labelRow.appendChild(valueDisplay);

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "1";
    slider.max = "10";
    slider.step = "0.5";
    slider.value = cheats.growthMultiplier;
    slider.style.width = "100%";
    slider.style.cursor = "pointer";

    slider.addEventListener("input", (e) => {
        cheats.growthMultiplier = parseFloat(e.target.value);
        valueDisplay.innerText = cheats.growthMultiplier + "x";
    });

    // Listen for changes from Admin Panel
    setInterval(() => {
        if (slider.value != cheats.growthMultiplier) {
            slider.value = cheats.growthMultiplier;
            valueDisplay.innerText = cheats.growthMultiplier + "x";
        }
    }, 500);

    container.appendChild(labelRow);
    container.appendChild(slider);

    // --- Donation UI ---
    const separator = document.createElement("div");
    separator.style.borderTop = "1px solid rgba(255, 255, 255, 0.3)";
    separator.style.margin = "10px 0";
    container.appendChild(separator);

    const donationLabel = document.createElement("div");
    donationLabel.innerText = "Custom Donation Amount";
    donationLabel.style.marginBottom = "5px";
    container.appendChild(donationLabel);

    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.placeholder = "Amount";
    amountInput.style.width = "100%";
    amountInput.style.marginBottom = "5px";
    amountInput.style.color = "black";
    container.appendChild(amountInput);

    const sendBtn = document.createElement("button");
    sendBtn.innerText = "Set Donation Amount";
    sendBtn.style.width = "100%";
    sendBtn.style.cursor = "pointer";
    sendBtn.style.color = "black";
    sendBtn.addEventListener("click", () => {
        const amount = parseInt(amountInput.value);
        if (!isNaN(amount) && amount > 0) {
            // We can't easily find the packet opcode without reverse engineering.
            // But we can store this "Custom Amount" and maybe use it in a future hook?
            // Or log it.
            console.log("Setting custom donation amount to:", amount);
            alert("Custom donation amount set to " + amount + " (Feature in progress)");
            // If we found the packet:
            // __fx.customLobby.sendPacket(new Uint8Array([OPCODE, ...]));
        }
    });
    container.appendChild(sendBtn);


    document.body.appendChild(container);

    // Visibility Loop
    setInterval(() => {
        const gameState = getVar("gameState");
        const playerId = getVar("playerId");
        // Check if we are in a game (gameState 2 or playerId exists with territories)
        if (gameState === 2 || (playerId !== undefined && getVar("playerTerritories"))) {
            container.style.display = "block";
        } else {
            container.style.display = "none";
        }
    }, 1000);
}

export default createOverlay;
