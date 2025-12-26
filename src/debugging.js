import { getVar } from "./gameInterface.js";

let debugContext = null;

export function reportError(e, message) {
    // Error reporting disabled by user request to prevent potential bans.
    console.warn("Error suppressed:", e, message);
    
    // Optional: Alert strictly locally if needed, but console is better for gameplay flow.
    // alert("Error:\n" + e.message);
}

export function debugWithContext(callback, context) {
    try {
        return callback();
    } catch (error) {
        debugContext = context;
        setTimeout(() => {
            if (debugContext !== null) debugContext = null;
        });
        throw error;
    }
}