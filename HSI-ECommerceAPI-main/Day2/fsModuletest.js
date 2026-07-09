const fs = require("fs");

const content = "Hello, this file was written by Node.js!";
fs.writeFileSync("Day2/test.txt", content);
console.log("File written to Day2/test.txt");

const data = fs.readFileSync("Day2/test.txt", "utf8");
console.log("File content:", data);