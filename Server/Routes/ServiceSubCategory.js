const express = require("express");
const router = express.Router();
const ServiceSubCategory = require("../Models/SubCategory");

router
  .route("/service-sub-category")
  .get(async function (req, res) {
    try {
      let queryResult = await ServiceSubCategory.find({}).exec();
      res.send(queryResult);
    } catch (error) {
      res.send(error);
    }
  })
  .post(function (req, res) {
    const SubCategory = new ServiceSubCategory({
      ServiceID: req.body.ServiceID,
      ServiceSubCategory: req.body.subCategory,
    });
    SubCategory.save(function (err) {
      if (!err) {
        res.send("New Service Sub Category Created");
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

///specific////

router
  .route("/service-sub-category/:id")
  .get(function (req, res) {
    ServiceSubCategory.find({ _id: req.params.id }, function (err, services) {
      if (services) {
        res.send(services);
      } else {
        res.send("No such data found");
      }
    });
  })
  .delete(function (req, res) {
    ServiceSubCategory.findOneAndDelete({ _id: req.params.id }, function (err) {
      if (!err) {
        res.send("Deleted Successfully ");
      } else {
        res.send(err);
      }
    });
  });

module.exports = router;
