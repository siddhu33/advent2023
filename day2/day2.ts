import * as fs from "fs";

interface ColorSize {
  [index: string]: number;
}

const file = fs.readFileSync("day2/day2.txt", "utf-8");

function part1() {
  const lines = file.split("\n");
  const color_size: ColorSize = { r: 12, g: 13, b: 14 };
  let total = 0;
  for (const line of lines) {
    let fail = false;
    const [gameTxt, setTxt] = line.split(": ", 2);
    const gameNum = parseInt(gameTxt.replace("Game ", ""), 10);
    const sets = setTxt.split(";");
    for (const set of sets) {
      const matches = set.matchAll(/([0-9]+ [red|green|blue])/g);
      for (const match of matches) {
        const [num, color] = match[0].split(" ");
        if (parseInt(num, 10) > color_size[color]) {
          fail = true;
          break;
        }
      }
      if (fail) {
        break;
      }
    }
    if (!fail) {
      total += gameNum;
    }
  }
  console.log(total);
}

function part2() {
  const lines = file.split("\n");
  let total = 0;
  for (const line of lines) {
    const max_color: ColorSize = { r: 0, g: 0, b: 0 };
    let fail = false;
    const [_gameTxt, setTxt] = line.split(": ", 2);
    const sets = setTxt.split(";");
    for (const set of sets) {
      const matches = set.matchAll(/([0-9]+ [red|green|blue])/g);
      for (const match of matches) {
        const [num, color] = match[0].split(" ");
        const num_int = parseInt(num, 10);
        if (num_int > max_color[color]) {
          max_color[color] = num_int;
        }
      }
    }
    total += Object.values(max_color).reduce((a, b) => a * b);
  }
  console.log(total);
}

part1();
part2();
