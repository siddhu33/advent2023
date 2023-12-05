import * as fs from "fs";

const file = fs.readFileSync("day4/day4.txt", "utf-8");
const lines = file.split("\n");

function part1() {
  let totalScore: number = 0;
  lines.forEach((line) => {
    const [_lineNo, numbers] = line.split(": ", 2);
    const [winners, cards] = numbers.split(" | ", 2);
    const winningNumbers = winners
      .split(" ")
      .map((n) => parseInt(n, 10))
      .filter((n) => !isNaN(n));
    const winningSet = new Set<number>(winningNumbers);
    const cardNumbers = cards
      .split(" ")
      .map((n) => parseInt(n, 10))
      .filter((n) => !isNaN(n));
    const power = cardNumbers.filter((n) => winningSet.has(n)).length;
    if (power > 0) {
      const score = Math.pow(2, power - 1);
      totalScore += score;
    }
  });
  console.table({ part1: totalScore });
}

interface copies {
  [index: number]: number;
}

function part2() {
  const numCopies: copies = Object.fromEntries(
    [...Array(lines.length).keys()].map((x) => [x, 1]),
  );
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [_lineNo, numbers] = line.split(": ", 2);
    const [winners, cards] = numbers.split(" | ", 2);
    const winningNumbers = winners
      .split(" ")
      .map((n) => parseInt(n, 10))
      .filter((n) => !isNaN(n));
    const winningSet = new Set<number>(winningNumbers);
    const cardNumbers = cards
      .split(" ")
      .map((n) => parseInt(n, 10))
      .filter((n) => !isNaN(n));
    const power = cardNumbers.filter((n) => winningSet.has(n)).length;
    if (power > 0) {
      for (let j = 1; j <= power; j++) {
        numCopies[i + j] += numCopies[i];
      }
    }
  }
  console.table({ part2: Object.values(numCopies).reduce((a, b) => a + b) });
}

part1();
part2();
