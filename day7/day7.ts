import { assert, count } from "console";
import * as fs from "fs";

const file = fs.readFileSync("day7/day7.txt", "utf-8");
const lines = file.split("\n");

interface ProcessedCard {
  hand: string[];
  count: CardCount;
  rank: number;
}

const handsAndRanks: ProcessedCard[] = lines.map((line) => {
  const [hand, rank] = line.split(" ", 2);
  return {
    hand: Array.from(hand),
    count: getCardCount(Array.from(hand)),
    rank: parseInt(rank, 10),
  };
});

const CARD_ORDER = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

const HAND_ORDER = ["5K", "4K", "FH", "3K", "2P", "1P", "HC"];

interface CardCount {
  [card: string]: number;
}

const fiveOfAKind = (cardCount: CardCount): boolean => {
  const maxNumber = Math.max(...Object.values(cardCount));
  return maxNumber === 5;
};

const fourOfAKind = (cardCount: CardCount): boolean => {
  const maxNumber = Math.max(...Object.values(cardCount));
  return maxNumber === 4;
};

const fullHouse = (cardCount: CardCount): boolean => {
  const countValues = Object.values(cardCount);
  countValues.sort((a, b) => a - b);
  return (
    countValues.length == 2 && countValues[0] === 2 && countValues[1] === 3
  );
};

const threeOfAKind = (cardCount: CardCount): boolean => {
  const countValues = Object.values(cardCount);
  return Math.max(...countValues) === 3;
};

const twoPair = (cardCount: CardCount): boolean => {
  const countValues = Object.values(cardCount);
  countValues.sort((a, b) => a - b).reverse();
  return (
    countValues.length >= 2 && countValues[0] === 2 && countValues[1] === 2
  );
};

const onePair = (cardCount: CardCount): boolean => {
  const countValues = Object.values(cardCount);
  return Math.max(...countValues) === 2;
};

const highCard = (cardCount: CardCount): boolean => {
  const countValues = Object.values(cardCount);
  return Math.max(...countValues) === 1;
};

interface Resolutions {
  [index: string]: (count: CardCount) => boolean;
}

const resolutions: Resolutions = {
  "5K": fiveOfAKind,
  "4K": fourOfAKind,
  FH: fullHouse,
  "3K": threeOfAKind,
  "2P": twoPair,
  "1P": onePair,
  HC: highCard,
};

function getCardCount(hand: string[]): CardCount {
  const cardCount: CardCount = {};
  hand.forEach((card) => {
    if (card in cardCount) {
      cardCount[card] += 1;
    } else {
      cardCount[card] = 1;
    }
  });
  return cardCount;
}

function part1() {
  const handsAndRanksCopied: ProcessedCard[] = JSON.parse(
    JSON.stringify(handsAndRanks)
  );
  handsAndRanksCopied.sort((a: ProcessedCard, b: ProcessedCard) => {
    let aHand = null;
    let bHand = null;
    let handIndex = 0;
    while (aHand == null || bHand == null) {
      const handType = HAND_ORDER[handIndex];
      const resolutionFunc = resolutions[handType];
      if (resolutionFunc == undefined) {
        console.error("ERROR!");
      }
      const resA = resolutionFunc(a.count);
      const resB = resolutionFunc(b.count);
      b.count;
      if (aHand == null && resA) {
        aHand = handType;
      }
      if (bHand == null && resB) {
        bHand = handType;
      }
      handIndex += 1;
    }
    if (aHand != null && bHand != null) {
      const aHandIndex = HAND_ORDER.indexOf(aHand);
      const bHandIndex = HAND_ORDER.indexOf(bHand);
      if (aHandIndex == bHandIndex) {
        for (let i = 0; i < a.hand.length; i++) {
          const aCardIndex = CARD_ORDER.indexOf(a.hand[i]);
          const bCardIndex = CARD_ORDER.indexOf(b.hand[i]);
          if (aCardIndex != bCardIndex) {
            return aCardIndex - bCardIndex;
          }
        }
        return 0;
      } else {
        return aHandIndex - bHandIndex;
      }
    }
    throw Error("sort function failed!");
  });
  console.table({
    part1: handsAndRanksCopied
      .map((v, i) => v.rank * (handsAndRanksCopied.length - i))
      .reduce((a, b) => a + b),
  });
}

const CARD_ORDER_JOKER = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
];

function addJokers(stripJokersHand: string, numJokers: number) {
  switch (stripJokersHand) {
    case "5K":
      return "5K";
    case "4K":
      return numJokers == 1 ? "5K" : "4K";
    case "FH":
      return "FH";
    case "3K":
      switch (numJokers) {
        case 2:
          return "5K";
        case 1:
          return "4K";
        case 0:
          return "3K";
      }
    case "2P":
      return numJokers == 1 ? "FH" : "2P";
    case "1P":
      switch (numJokers) {
        case 3:
          return "5K";
        case 2:
          return "4K";
        case 1:
          return "3K";
        case 0:
          return "1P";
      }
    case "HC":
      switch (numJokers) {
        case 4:
          return "5K";
        case 3:
          return "4K";
        case 2:
          return "3K";
        case 1:
          return "1P";
        case 0:
          return "HC";
      }
  }
}

function findHandJokers(hand: ProcessedCard) {
  const numJokers = hand.count["J"] || 0;
  if (numJokers == 5) {
    return "5K";
  }
  const stripJokers: CardCount = Object.fromEntries(
    Object.entries(hand.count).filter((ent) => ent[0] != "J")
  );
  let stripJokersHand = undefined;
  for (const handType of HAND_ORDER) {
    if (resolutions[handType](stripJokers)) {
      stripJokersHand = handType;
      break;
    }
  }
  if (stripJokersHand != null) {
    return addJokers(stripJokersHand, numJokers);
  }
}

function part2() {
  const handsAndRanksCopied: ProcessedCard[] = JSON.parse(
    JSON.stringify(handsAndRanks)
  );
  handsAndRanksCopied.sort((a: ProcessedCard, b: ProcessedCard) => {
    let aHand = findHandJokers(a);
    let bHand = findHandJokers(b);
    if (aHand != undefined && bHand != undefined) {
      const aHandIndex = HAND_ORDER.indexOf(aHand);
      const bHandIndex = HAND_ORDER.indexOf(bHand);
      if (aHandIndex == bHandIndex) {
        for (let i = 0; i < a.hand.length; i++) {
          const aCardIndex = CARD_ORDER_JOKER.indexOf(a.hand[i]);
          const bCardIndex = CARD_ORDER_JOKER.indexOf(b.hand[i]);
          if (aCardIndex != bCardIndex) {
            return aCardIndex - bCardIndex;
          }
        }
        return 0;
      } else {
        return aHandIndex - bHandIndex;
      }
    }
    throw Error("sort function failed!");
  });
  console.table({
    part2: handsAndRanksCopied
      .map((v, i) => v.rank * (handsAndRanksCopied.length - i))
      .reduce((a, b) => a + b),
  });
}
part1();
part2();
