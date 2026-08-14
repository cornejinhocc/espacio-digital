const fs = require("fs");
fs.copyFileSync("app/page.tsx", "app/page.backup.tsx");
fs.copyFileSync("app/globals.css", "app/globals.backup.css");
console.log("¡Nuevo respaldo guardado exitosamente con el fondo de Luma!");

