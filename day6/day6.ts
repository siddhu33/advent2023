import * as fs from "fs";

const file = fs.readFileSync("day6/day6.txt", "utf-8");
const lines = file.split("\n");

const times = lines[0]
  .split("Time:", 2)
  .at(1)
  .split(" ")
  .map((v) => parseInt(v, 10))
  .filter((v) => !isNaN(v));

const distances = lines[1]
  .split("Distance:", 2)
  .at(1)
  .split(" ")
  .map((v) => parseInt(v, 10))
  .filter((v) => !isNaN(v));

function getRecordBreaks(timeData: number[], distanceData: number[]): number[] {
  const recordBreaks = [];
  for (let i = 0; i < timeData.length; i++) {
    const time = timeData[i];
    let recordBreak = 0;
    const distanceRecord = distanceData[i];
    for (let j = 1; j <= time; j++) {
      const distance = j * (time - j);
      if (distance > distanceRecord) {
        recordBreak += 1;
      }
    }
    recordBreaks.push(recordBreak);
  }
  return recordBreaks;
}

function part1() {
  const recordBreaks = getRecordBreaks(times, distances);
  console.table({ part1: recordBreaks.reduce((a, b) => a * b) });
}

function part2() {
  const newTime = parseInt(
    times.map((v) => v.toString()).reduce((a, b) => a + b)
  );
  const newDistance = parseInt(
    distances.map((v) => v.toString()).reduce((a, b) => a + b)
  );
  const recordBreaks = getRecordBreaks([newTime], [newDistance]);
  console.table({ part2: recordBreaks[0] });
}

part1();
part2();
