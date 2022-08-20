const mongoose = require("mongoose");
const serviceCategorySchema = mongoose.Schema({
  serviceCategory: String,
});

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);
