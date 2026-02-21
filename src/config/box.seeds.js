import Box from "../models/mall/Box.js";

const boxes = [
  { boxNumber: "A101", floor: 1, mapReference: "map_a1.png", surfaceArea: 50 },
  { boxNumber: "A102", floor: 1, mapReference: "map_a1.png", surfaceArea: 40 },
  { boxNumber: "B201", floor: 2, mapReference: "map_b2.png", surfaceArea: 60 },
  { boxNumber: "C301", floor: 3, mapReference: "map_c3.png", surfaceArea: 70 }
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
