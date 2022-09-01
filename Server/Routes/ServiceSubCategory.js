const express = require("express");
const router = express.Router();
const ServiceSubCategory = require("../Models/SubCategory");

router
  .route("/service-sub-category")
  .get(async function (req, res) {
    // let array = await ServiceSubCategory.find({})
    //   .select({ ServiceID: 1, _id: 1 })
    //   .exec();
    // console.log(array);
    // let result = [];
    // console.time();
    // for (var i = 0; i < array.length; i += 1) {
    //   if (array[i].ServiceID === null) {
    //     await ServiceSubCategory.deleteOne({ _id: array[i]._id });
    //   }
    // }
    // console.timeEnd();

    let queryResult = await ServiceSubCategory.find({}).exec();
    res.send(queryResult);
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
