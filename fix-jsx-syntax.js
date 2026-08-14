const fs = require("fs");

let page = fs.readFileSync("app/page.tsx", "utf8");

// Corregir sintaxis color= por color:
page = page.replace(/color="([^"]+)"/g, "color=\"$1\"");

fs.writeFileSync("app/page.tsx", page, "utf8");
console.log("¡Sintaxis JSX verificada!");

