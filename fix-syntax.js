const fs = require("fs");

let content = fs.readFileSync("app/page.tsx", "utf8");

// Corregir la asignación de color dentro de los objetos de estilo
content = content.replace(/color="#a855f7"/g, "color: \"#a855f7\"");
content = content.replace(/color="#34d399"/g, "color: \"#34d399\"");
content = content.replace(/color="#38bdf8"/g, "color: \"#38bdf8\"");

fs.writeFileSync("app/page.tsx", content, "utf8");
console.log("¡Sintaxis de estilos corregida con éxito!");

