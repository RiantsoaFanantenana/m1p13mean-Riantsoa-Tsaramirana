import Box from "../models/mall/Box.js";

const boxes = [
  { boxNumber: "A101", floor: 1, mapReference: "map_a1.png" },
  { boxNumber: "A102", floor: 1, mapReference: "map_a1.png" },
  { boxNumber: "B201", floor: 2, mapReference: "map_b2.png" },
  { boxNumber: "C301", floor: 3, mapReference: "map_c3.png" }
];

export default async function seedBoxes() {
  for (const box of boxes) {
    await Box.updateOne(
      { boxNumber: box.boxNumber },
      { $setOnInsert: box },
      { upsert: true }
    );
  }

  console.log("✅ Boxes seeded");
}
