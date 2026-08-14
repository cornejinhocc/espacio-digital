const fs = require("fs");
const path = require("path");

// Read image and convert to base64
const imgBuffer = fs.readFileSync("public/profile.jpg");
const base64Img = "data:image/jpeg;base64," + imgBuffer.toString("base64");

let pageContent = fs.readFileSync("app/page.tsx", "utf8");

// Replace the src inside page.tsx with the embedded base64 image
pageContent = pageContent.replace(/src="\/profile\.jpg[^"]*"/g, `src="${base64Img}"`);

fs.writeFileSync("app/page.tsx", pageContent, "utf8");
console.log("¡Foto incrustada exitosamente en app/page.tsx!");

