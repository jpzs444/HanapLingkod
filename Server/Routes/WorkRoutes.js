const express = require("express");
const router = express.Router();
const Work = require("../Models/Work");
const ServiceCategory = require("../Models/ServiceCategory");
const ServiceSubCategory = require("../Models/SubCategory");
const mongoose = require("mongoose");

router
  .route("/Work")
  .get(async function (req, res) {
    let queryResult = await Work.find({}).exec();
    res.send(queryResult);
  })
  .post(async function (req, res) {
    console.log(req.body);
    const session = await mongoose.connection.startSession();

    try {
      session.startTransaction();
      let serviceSubCategoryID;
      const Category = [].concat(req.body.Category);
      const SubCategory = [].concat(req.body.ServiceSubCategory);
      const min = [].concat(req.body.minPrice);
      const max = [].concat(req.body.maxPrice);

      for (var i = 0; i < Category.length; i += 1) {
        if (Category[i] == "unlisted") {
          let unlistedID = await ServiceCategory.findOne(
            { Category: "unlisted" },
            { Category: 0 }
          );
          const serviceSubCategory = await ServiceSubCategory.create(
            [
              {
                ServiceID: unlistedID._id,
                ServiceSubCategory: SubCategory[i],
              },
            ],
            { session }
          );

          serviceSubCategoryID = serviceSubCategory[0].id;
        } else {
          let result = await ServiceSubCategory.findOne(
            { ServiceSubCategory: SubCategory[i] },
            { ServiceSubCategory: 0, ServiceID: 0 },
            { session }
          );
          serviceSubCategoryID = result._id;
        }
        const work = await Work.create(
          [
            {
              ServiceSubId: serviceSubCategoryID,
              workerId: req.body.userId,
              minPrice: min[i],
              maxPrice: max[i],
            },
          ],
          { session }
        );
      }
      await session.commitTransaction();
      console.log("success");
      res.send("Succesfully Created");
    } catch (err) {
      console.log(err);

      await session.abortTransaction();

      res.status(500).send();
    }
  });

router.route("/Work/:UserId").get(function (req, res) {
  Work.find({ workerId: req.params.UserId }, function (err, found) {
    if (found) {
      res.send(found);
    } else {
      res.send("No such data found");
    }
  });
});

module.exports = router;
