import Box from "../models/mall/Box.js";
import mallData from "../mall.json" assert { type: "json" };

function calculateSurface(points) {
  let area = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }

  return Math.abs(area / 2);
}

export const seedBoxes = async () => {
  const existing = await Box.countDocuments();

  if (existing > 0) {
    console.log("Boxes already seeded.");
    return;
  }

  const boxesToInsert = [];

  mallData.forEach(floor => {
    floor.rooms.forEach(room => {
      if (room.category === "shop") {
        boxesToInsert.push({
          boxNumber: room.name,
          floorId: floor.id,
          floorName: floor.name,
          category: room.category,
          polygon: room.points,
          surfaceArea: calculateSurface(room.points),
          isAvailable: true
        });
      }
    });
  });

  await Box.insertMany(boxesToInsert);
  console.log("Boxes seeded successfully.");
};

export default seedBoxes;