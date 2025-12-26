import { cheats } from "./adminPanel.js";
import { getVar } from "./gameInterface.js";

function createOverlay() {
    const container = document.createElement("div");
    container.id = "fx-overlay-ui";
    container.style.position = "absolute";
    container.style.bottom = "15px";
    container.style.left = "65%"; // To the right of the center bar
    container.style.width = "200px";
    container.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    container.style.padding = "5px 10px";
    container.style.borderRadius = "5px";
    container.style.color = "white";
    container.style.display = "none";
    container.style.zIndex = "1000"; // Ensure it's above game canvas
    container.style.fontFamily = "Trebuchet MS, sans-serif";
    container.style.fontSize = "12px";

    const labelRow = document.createElement("div");
    labelRow.style.display = "flex";
    labelRow.style.justifyContent = "space-between";
    labelRow.style.marginBottom = "2px";

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

    document.body.appendChild(container);

    // Visibility Loop
    setInterval(() => {
        const gameState = getVar("gameState");
        // gameState 2 is usually 'playing'. 
        // We also check if custom lobby is active or if we are in a game.
        // Let's rely on gameState === 2.
        if (gameState === 2) {
            container.style.display = "block";
        } else {
            container.style.display = "none";
        }
    }, 1000);
}

export default createOverlay;
