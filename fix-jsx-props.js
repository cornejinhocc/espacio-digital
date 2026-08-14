const fs = require("fs");

let content = fs.readFileSync("app/page.tsx", "utf8");

// Reemplazar la sintaxis incorrecta de props (color: "...") por la correcta (color="...")
content = content.replace(/<Cpu size={([^}]+)} color: "([^"]+)" \/>/g, "<Cpu size={$1} color=\"$2\" />");
content = content.replace(/color: "#a855f7"/g, "color=\"#a855f7\""); // También para otros iconos si los hay
content = content.replace(/color: "#34d399"/g, "color=\"#34d399\"");

fs.writeFileSync("app/page.tsx", content, "utf8");
console.log("¡Sintaxis de propiedades JSX corregida correctamente!");

