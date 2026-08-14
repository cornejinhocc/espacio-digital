const fs = require("fs");

let page = fs.readFileSync("app/page.tsx", "utf8");

// Reemplazar la sección de la imagen para usar /profile.jpg directamente
page = page.replace(/src=\{[^\}]+\}/g, "src=\"/profile.jpg\"");
page = page.replace(/src="data:image[^\"]*"/g, "src=\"/profile.jpg\"");

fs.writeFileSync("app/page.tsx", page, "utf8");
console.log("¡Código actualizado para leer /profile.jpg!");

