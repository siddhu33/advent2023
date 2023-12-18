import * as fs from "fs";

const file = fs.readFileSync("day9/day9.txt", "utf-8");
const lines = file.split("\n");

function part1() {
  let sumOfNextNumbers = 0;
  lines.forEach((line) => {
    let sequences = getSequences(line);
    for (let i = 0; i < sequences.length - 1; i++) {
      sequences[i + 1].push(sequences[i + 1].at(-1) + sequences[i].at(-1));
    }
    sumOfNextNumbers += sequences.at(-1)?.at(-1);
  });
  console.table({ part1: sumOfNextNumbers });
}

function getSequences(line: string) {
  const numbers: number[] = line.split(" ").map((v) => parseInt(v, 10));
  let sequences = [numbers];
  let innerSequence = numbers.slice(1).map((v, i) => v - numbers[i]);
  while (innerSequence.filter((v) => v == 0).length !== innerSequence.length) {
    sequences.unshift(innerSequence);
    innerSequence = innerSequence.slice(1).map((v, i) => v - innerSequence[i]);
  }
  return sequences;
}

function part2() {
  let sumOfFirstNumbers = 0;
  lines.forEach((line) => {
    let sequences = getSequences(line);
    for (let i = 0; i < sequences.length - 1; i++) {
      sequences[i + 1].unshift(sequences[i + 1][0] - sequences[i][0]);
    }
    sumOfFirstNumbers += sequences.at(-1)?.at(0);
  });
  console.table({ part2: sumOfFirstNumbers });
}

part1();
part2();
