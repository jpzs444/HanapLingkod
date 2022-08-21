const express = require("express");
const router = express.Router();
const ServiceCategory = require("../Models/ServiceCategory");

router
  .route("/service-category")
  .get(function (req, res) {
    ServiceCategory.find({}, function (err, services) {
      if (services) {
        res.send(services);
      } else {
        res.send("No such data found");
      }
    });
  })
  .post(function (req, res) {
    const serviceCategory = new ServiceCategory({
      Category: req.body.Category,
    });
    serviceCategory.save(function (err) {
      if (!err) {
        res.send("New Service Category Created");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    ServiceCategory.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all files");
      } else {
        res.send(err);
      }
    });
  });

module.exports = router;
