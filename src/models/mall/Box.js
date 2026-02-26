const mongoose = require("mongoose");

const PointSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true }
}, { _id: false });

const BoxSchema = new mongoose.Schema({
  boxNumber: { type: String, required: true, unique: true },

  floorId: { type: String, required: true },
  floorName: { type: String, required: true },

  category: {
    type: String,
    enum: ["shop", "service", "parking"],
    default: "shop"
  },

  polygon: {
    type: [PointSchema],
    required: true
  },

  surfaceArea: Number,

  isAvailable: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

/* ==============================
   SURFACE CALCULATION FUNCTION
================================= */

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

/* ==============================
   MONGOOSE MIDDLEWARE
================================= */

BoxSchema.pre("save", function (next) {
  if (this.polygon && this.polygon.length >= 3) {
    this.surfaceArea = calculateSurface(this.polygon);
  }
  next();
});

module.exports = mongoose.model("Box", BoxSchema);