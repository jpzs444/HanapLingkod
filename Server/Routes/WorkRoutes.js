const express = require("express");
const router = express.Router();
const Work = require("../Models/Work");
const ServiceCategory = require("../Models/ServiceCategory");
const ServiceSubCategory = require("../Models/SubCategory");
const Worker = require("../Models/Workers");
const mongoose = require("mongoose");
const ServiceRequest = require("../Models/ServiceRequest");
const Booking = require("../Models/Booking");
const { WorkMiddleware } = require("../Helpers/DeleteMiddleware");

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

      Worker.findOneAndUpdate(
        { _id: req.body.userId },
        {
          $push: { works: { $each: SubCategory } },
        },
        { upsert: true },
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully added");
          }
        }
      );

      await session.commitTransaction();
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
    Work.findOneAndUpdate(
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
  .delete(async function (req, res) {
    const serviceRequestQuery = await ServiceRequest.find(
      {
        workId: req.params.id,
        requestStatus: 1,
      },
      {
        workerId: 0,
        recruiterId: 0,
        workId: 0,
        subCategory: 0,
        minPrice: 0,
        maxPrice: 0,
        serviceDate: 0,
        startTime: 0,
        endTime: 0,
        description: 0,
        requestStatus: 0,
        comment: 0,
        deleteflag: 0,
        created_at: 0,
      }
    ).lean();

    const BookingQuery = await Booking.find(
      {
        workId: req.params.id,
        bookingStatus: 1,
      },
      {
        workerId: 0,
        recruiterId: 0,
        workId: 0,
        subCategory: 0,
        minPrice: 0,
        maxPrice: 0,
        serviceDate: 0,
        startTime: 0,
        endTime: 0,
        description: 0,
        bookingStatus: 0,
        comment: 0,
        deleteflag: 0,
        created_at: 0,
        geometry: 0,
      }
    ).lean();

    console.log(BookingQuery);
    if (serviceRequestQuery == 0 && BookingQuery == 0) {
      Work.findByIdAndUpdate(
        { _id: req.params.id },
        {
          deleteflag: 1,
        },
        function (err, doc) {
          if (!err) {
            WorkMiddleware(doc);
            res.send("Deleted Successfully ");
          } else {
            res.send(err);
          }
        }
      );
    } else {
      res.send("A Request is on going cannot delete");
    }
  });

router.route("/WorkList/:UserId").get(function (req, res) {
  Work.find({ workerId: req.params.UserId }, function (err, found) {
    if (found) {
      res.send(found);
      console.log(res);
    } else {
      res.send("No such data found");
    }
  });
});

module.exports = router;
