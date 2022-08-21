const express = require("express");
const router = express.Router();
const ServiceSubCategory = require("../Models/SubCategory");

router
  .route("/service-sub-category")
  .get(function (req, res) {
    ServiceSubCategory.find({}, function (err, services) {
      if (services) {
        res.send(services);
      } else {
        res.send("No such data found");
      }
    });
  })
  .post(function (req, res) {
    console.log("asd");
    const SubCategory = new ServiceSubCategory({
      ServiceID: req.body.ServiceID,
      ServiceSubCategory: req.body.try1,
    });
    SubCategory.save(function (err) {
      if (!err) {
        res.send("New Service Category Created");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    ServiceSubCategory.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all files");
      } else {
        res.send(err);
      }
    });
  });

module.exports = router;
