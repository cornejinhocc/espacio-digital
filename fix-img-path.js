const fs = require("fs");

let content = fs.readFileSync("app/page.tsx", "utf8");
content = content.replace("src=\"/profile.jpg\"", "src=\"/profile.jpg?v=1\"");
fs.writeFileSync("app/page.tsx", content, "utf8");

console.log("Ruta de imagen actualizada!");

