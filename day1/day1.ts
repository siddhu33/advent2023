import * as fs from "fs";

const file = fs.readFileSync("day1/day1.txt", "utf-8");

function part1(): number {
    const lines = file.split("\n").map(l => {
        return Array.from(l).filter(c => { return !isNaN(parseInt(c, 10)) })
    })
    let vals: number[] = []
    for (const l of lines) {
        if (l.length > 1) {
            vals.push(parseInt(`${l.at(0)}${l.at(-1)}`, 10))
        } else if (l.length == 1) {
            vals.push(parseInt(`${l.at(0)}${l.at(0)}`, 10))
        }
    }
    return vals.reduce((a, b) => a + b)
}

interface W2N {
    [index: string]: string
};

const words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
const word_to_num: W2N = {
    "one": "1", "two": "2", "three": "3", "four": "4", "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9"
}
function part2() {
    return file.split("\n").map(l => {
        let min_idx = 99999999;
        let max_idx = -1;
        let min_val = null;
        let max_val = null;
        for (const w of words) {
            const w_num = word_to_num[w];
            const fi = l.indexOf(w);
            const li = l.lastIndexOf(w);
            if (fi >= 0 && fi < min_idx) {
                min_idx = fi;
                min_val = w_num
            }
            if (li >= 0 && li > max_idx) {
                max_idx = li;
                max_val = w_num
            }
        }
        for (const n of numbers) {
            const fi = l.indexOf(n);
            const li = l.lastIndexOf(n);
            if (fi >= 0 && fi < min_idx) {
                min_idx = fi;
                min_val = n
            }
            if (li >= 0 && li > max_idx) {
                max_idx = li;
                max_val = n;
            }
        }
        return parseInt(`${min_val}${max_val}`)
    })
}

const p2 = part2()
console.log("part1: %d", part1());
console.log("part2: %s", p2.reduce((a, b) => a + b)); 