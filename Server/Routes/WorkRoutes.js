const express = require("express");
const router = express.Router();
const Work = require("../Models/Work");
const ServiceCategory = require("../Models/ServiceCategory");
const ServiceSubCategory = require("../Models/SubCategory");
const Worker = require("../Models/Workers");
const mongoose = require("mongoose");

router
  .route("/Work")
  .get(async function (req, res) {
    let queryResult = await Work.find({}).exec();
    res.send(queryResult);
  })
  .post(async function (req, res) {
    // console.log(req.body);
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
          console.log(result);
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

      Worker.findOneAndUpdate(
        { _id: req.body.userId },
        {
          $push: { works: SubCategory },
        }
      );
      console.log("success");
      res.send("Succesfully Created");
    } catch (err) {
      console.log(err);

      await session.abortTransaction();

      res.status(500).send();
    }
  });

////get works on specific category
router.route("/Work/:category").get(async function (req, res) {
  try {
    result = [];
    let query = await Work.find({}).lean().exec();
    for (var i = 0; i < query.length; i++) {
      if (query[i].ServiceSubId.ServiceSubCategory === req.params.category) {
        result.push(query[i]);
      }
    }
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});
router
  .route("/Work/:category/:id")
  .get(async function (req, res) {
    let queryResult = await Work.find({ _id: req.params.id }).exec();
    res.send(queryResult);
  })
  .put(function (req, res) {
    Work.findByIdAndUpdate(
      { _id: req.params.id },
      { minPrice: req.body.minPrice, maxPrice: req.body.maxPrice },
      function (err) {
        if (!err) {
          res.send("Updated Successfully");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Work.deleteOne({ _id: req.params.id }, function (err) {
      if (!err) {
        res.send("Deleted Successfully ");
      } else {
        res.send(err);
      }
    });
  });

router.route("/WorkList/:UserId").get(function (req, res) {
  Work.find({ workerId: req.params.UserId }, function (err, found) {
    if (found) {
      res.send(found);
    } else {
      res.send("No such data found");
    }
  });
});

module.exports = router;
