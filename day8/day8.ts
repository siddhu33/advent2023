import * as fs from "fs";
import { start } from "repl";

interface NodeMap {
  [index: string]: Node;
}

interface Node {
  name: string;
  left: Node | undefined;
  right: Node | undefined;
}

const file = fs.readFileSync("day8/day8.txt", "utf-8");
const lines = file.split("\n");
const directions = lines[0].split("");
const nodes: NodeMap = {};
let root: Node | undefined = undefined;
for (let i = 2; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(/(\w+) = \((\w+), (\w+)\)/);
  if (match != null) {
    const [nodeName, leftNode, rightNode] = [match[1], match[2], match[3]];
    let leftObj = null;
    let rightObj = null;
    if (!(leftNode in nodes)) {
      leftObj = { name: leftNode, left: undefined, right: undefined };
      nodes[leftNode] = leftObj;
    } else {
      leftObj = nodes[leftNode];
    }
    if (!(rightNode in nodes)) {
      rightObj = { name: rightNode, left: undefined, right: undefined };
      nodes[rightNode] = rightObj;
    } else {
      rightObj = nodes[rightNode];
    }

    if (!(nodeName in nodes)) {
      nodes[nodeName] = { name: nodeName, left: leftObj, right: rightObj };
    } else {
      nodes[nodeName].left = leftObj;
      nodes[nodeName].right = rightObj;
    }

    if (root == undefined) {
      root = nodes[nodeName];
    }
  }
}

function part1() {
  let steps = 0;
  let loop = 0;
  let currNode: Node | undefined = nodes["AAA"];
  while (currNode?.name !== "ZZZ") {
    for (const direction of directions) {
      if (direction == "L") {
        currNode = currNode?.left;
      } else {
        currNode = currNode?.right;
      }
      steps += 1;
      if (currNode?.name == "ZZZ") {
        break;
      }
    }
    loop += 1;
    if (loop % 1000000 == 0) {
      console.log("loops: %d", loop);
    }
  }
  console.table({ part1: steps });
}

const gcd = (a: bigint, b: bigint) => (a ? gcd(b % a, a) : b);
const lcm = (a: bigint, b: bigint) => (a * b) / gcd(a, b);

function part2() {
  let steps = 0;
  let startingNodes: (Node | undefined)[] = Object.values(nodes).filter((n) =>
    n.name.endsWith("A")
  );
  let periodicity = startingNodes.map((v) => 0);
  while (periodicity.filter((v) => v == 0).length != 0) {
    for (const direction of directions) {
      if (direction == "L") {
        startingNodes = startingNodes.map((n) => n.left);
      } else {
        startingNodes = startingNodes.map((n) => n.right);
      }
      steps += 1;
      for (let i = 0; i < periodicity.length; i++) {
        if (periodicity[i] == 0 && startingNodes[i]?.name.endsWith("Z")) {
          periodicity[i] = steps;
        }
      }
      if (periodicity.filter((v) => v == 0).length == 0) {
        break;
      }
    }
  }
  console.table({ part2: periodicity.map(BigInt).reduce(lcm) });
}

part1();
part2();
