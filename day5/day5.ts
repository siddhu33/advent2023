import * as fs from "fs";

interface Destination {
  source_min: number;
  source_max: number;
  dest_min: number;
  dest_max: number;
  offset: number;
}

const file = fs.readFileSync("day5/day5.txt", "utf-8");
const lines = file.split("\n");
const seeds = lines[0]
  .split("seeds: ", 2)[1]
  .split(" ")
  .map((v) => parseInt(v, 10));
const maps: Destination[][] = [];
let map: Destination[] = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (line != "") {
    if (line.includes("map:")) {
      if (map != null && map.length) {
        maps.push(JSON.parse(JSON.stringify(map)));
      }
      map = [];
    } else {
      //map range into destinations
      const [dest_min, source_min, offset] = line
        .split(" ", 3)
        .map((i) => parseInt(i, 10));
      map.push({
        source_min: source_min,
        source_max: source_min + offset - 1,
        dest_min: dest_min,
        dest_max: dest_min + offset - 1,
        offset: offset,
      });
    }
  }
}
if (map != null && map.length) {
  maps.push(JSON.parse(JSON.stringify(map)));
}

function mapValue(input: number, map: Destination[]): number {
  for (const dest of map) {
    if (input >= dest.source_min && input <= dest.source_max) {
      return input - dest.source_min + dest.dest_min;
    }
  }
  return input;
}

function part1() {
  let min_value: number | undefined = undefined;
  seeds.forEach((seed) => {
    let value = seed;
    for (const map of maps) {
      value = mapValue(value, map);
    }
    min_value = min_value != undefined ? Math.min(min_value, value) : value;
  });
  console.table({ part1: min_value });
}

function part2() {
  let min_value: number | undefined = undefined;
  for (let i = 0; i < seeds.length - 1; i += 2) {
    const seed = seeds[i];
    const range = seeds[i + 1];
    console.log(seed);
    for (let j = 0; j < range; j++) {
      let value = seed + j;
      for (const map of maps) {
        value = mapValue(value, map);
      }
      min_value = min_value != undefined ? Math.min(min_value, value) : value;
    }
  }
  console.table({ part2: min_value });
}

part1();
part2();
