import Takuzu from "./takuzu/index.js";
const grid = new Takuzu(4);
grid.generate();
grid.prepare();

console.log(grid.task);
