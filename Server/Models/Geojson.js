const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const GeoSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "Point",
  },
  coordinates: {
    type: [Number],
    index: "2dsphere",
  },
});

module.exports = mongoose.model("Geo", GeoSchema);
