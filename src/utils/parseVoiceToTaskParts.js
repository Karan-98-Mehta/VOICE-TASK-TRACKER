export function parseVoiceToTaskParts(text) {
    if (!text) return { title: "", description: "" };
    const lower = text.toLowerCase();
    const tIdx = lower.indexOf("title:");
    const dIdx = lower.indexOf("description:");
    if (tIdx !== -1 && dIdx !== -1) {
    const title = text.substring(tIdx + 6, dIdx).trim().replace(/^[-–—:\s]+/, "");
    const description = text.substring(dIdx + 12).trim();
    return { title, description };
    }
    const sepMatch = text.split(/\s[-–—:]\s|\s-\s|:\s/);
    if (sepMatch.length >= 2) {
    return { title: sepMatch[0].trim(), description: sepMatch.slice(1).join(" ").trim() };
    }
    const dot = text.indexOf(". ");
    if (dot > 0) {
    return { title: text.slice(0, dot).trim(), description: text.slice(dot + 1).trim() };
    }
    return { title: text.trim(), description: "" };
}