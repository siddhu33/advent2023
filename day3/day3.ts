import * as fs from "fs";


const file = fs.readFileSync("day3/day3.txt", "utf-8");
const lines = file.split("\n")

const height = lines.length
const width = lines[0].length

function part1() {
    const numberLocations = []
    const symbolLocations = []
    for (let i = 0; i < height; i += 1) {
        const line = lines[i];
        const matches = line.matchAll(/([0-9]+)/g)
        for (const match of matches) {
            if (match.index != undefined) {
                numberLocations.push({ line: i, start: match.index, end: match.index + match[0].length - 1, value: parseInt(match[0], 10) })
            }
        }
        const symbols = line.matchAll(/(?![0-9])(?!\.)./g)
        for (const match of symbols) {
            if (match.index) {
                //symbol found, look for digits around and map the digit coordinates around match index.
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        if (x != 0 || y != 0) {
                            const hIndex = i + x;
                            const wIndex = match.index + y;
                            if (hIndex >= 0 && hIndex < height && wIndex >= 0 && wIndex < width) {
                                const digit = lines[hIndex][wIndex];
                                if (!isNaN(+digit))
                                    symbolLocations.push({ line: hIndex, index: wIndex })
                            }
                        }
                    }
                }
            }
        }
    }
    const numbersSelected = new Set<string>();
    for (const symbolLocation of symbolLocations) {
        for (const numberLocation of numberLocations) {
            if (symbolLocation.line === numberLocation.line) {
                if (symbolLocation.index >= numberLocation.start && symbolLocation.index <= numberLocation.end) {
                    //matched, put JSON stringify into numbers
                    numbersSelected.add(JSON.stringify(numberLocation))
                }
            }
        }
    }
    const allParts = Array.from(numbersSelected.values()).map(v => JSON.parse(v)).map(x => x.value).reduce((a, b) => a + b)
    console.table({ part1: allParts })
}

interface numberDetail {
    line: number;
    start: number;
    end: number;
    value: number;
}

interface numberMap {
    [index: number]: numberDetail[]
}

function part2() {
    const numberLocations: numberMap = {}
    let gearRatios = 0
    for (let i = 0; i < height; i += 1) {
        const line = lines[i];
        const matches = line.matchAll(/([0-9]+)/g)
        for (const match of matches) {
            if (match.index != undefined) {
                const numbers = numberLocations[i];
                const numberObj = { line: i, start: match.index, end: match.index + match[0].length - 1, value: parseInt(match[0], 10) }
                if (numbers == undefined) {
                    numberLocations[i] = []
                }
                numberLocations[i].push(numberObj)
            }
        }
    }
    for (let i = 0; i < height; i += 1) {
        const line = lines[i];
        const symbols = line.matchAll(/\*/g)
        for (const match of symbols) {
            const matchedNumbers = new Set<string>();
            if (match.index) {
                //symbol found, look for digits around and map the digit coordinates around match index.
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        if (x != 0 || y != 0) {
                            const hIndex = i + x;
                            const wIndex = match.index + y;
                            if (hIndex >= 0 && hIndex < height && wIndex >= 0 && wIndex < width) {
                                const digit = lines[hIndex][wIndex];
                                if (!isNaN(+digit)) {
                                    //find number on line
                                    for (const number of numberLocations[hIndex]) {
                                        if (number.start <= wIndex && wIndex <= number.end) {
                                            const numMatch = { line: hIndex, start: number, value: number.value }
                                            matchedNumbers.add(JSON.stringify(numMatch))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                const numberArray = Array.from(matchedNumbers)
                if (numberArray.length == 2) {
                    //gear found, calc ratio
                    gearRatios += numberArray.map(n => JSON.parse(n)).map(n => n.value).reduce((a, b) => a * b)
                }
            }
        }
    }
    console.table({ part2: gearRatios })
}


part1()
part2()