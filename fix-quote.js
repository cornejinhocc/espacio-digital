const fs = require("fs");

let content = fs.readFileSync("app/page.tsx", "utf8");
// Remover comillas sobrantes al final del archivo
content = content.trim().replace(/"$/, "");
fs.writeFileSync("app/page.tsx", content, "utf8");

console.log("¡Comilla sobrante eliminada con éxito!");

