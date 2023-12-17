import * as fs from "fs";

const file = fs.readFileSync("day6/test6.txt", "utf-8");
const lines = file.split("\n");

function part1() {
  console.table({ part1: 0 });
}

function part2() {
  console.table({ part2: 0 });
}

part1();
part2();
