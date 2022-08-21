const mongoose = require("mongoose");
const serviceCategorySchema = mongoose.Schema({
  Category: String,
});

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);
