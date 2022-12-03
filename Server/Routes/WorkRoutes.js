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
const { authenticateToken } = require("../Helpers/JWT");
const Workers = require("../Models/Workers");
const { BannedWorker } = require("../Models/BannedUsers");

router
  .route("/Work")
  .get(authenticateToken, async function (req, res) {
    console.time("Work Routes");

    let queryResult = await Work.find({
      deleteflag: false,
    }).exec();
    res.send(queryResult);
    console.timeEnd("Work Routes");
  })
  .post(authenticateToken, async function (req, res) {
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
router.route("/Work/:category").get(
  // authenticateToken,
  async function (req, res) {
    try {
      let page;
      if (req.query.page) {
        page = parseInt(req.query.page);
      } else {
        page = 1;
      }
      const limit = 10;
      // const { page = 1 } = req.query;

      //query the banned workers
      const bannedUsersResult = await BannedWorker.find({ ban: true });
      let bannedUsers = [];
      //put the banned users id to an array
      bannedUsersResult.forEach((x) => {
        bannedUsers.push(x.workerId);
      });

      let subId = await ServiceSubCategory.findOne({
        ServiceSubCategory: req.params.category,
      }).lean();

      const count = await Work.countDocuments({
        ServiceSubId: subId._id,
      });

      const query = await Work.find({
        ServiceSubId: subId._id,
        deleteflag: false,
        _id: { $nin: bannedUsers },
      })
        .limit(limit * page)
        .lean()
        .exec();
      res.send(query);
    } catch (err) {
      res.send(err);
    }
  }
);
router
  .route("/Work/:category/:id")
  .get(authenticateToken, async function (req, res) {
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
    const serviceRequestQuery = await ServiceRequest.count({
      workId: req.params.id,
      requestStatus: 1,
    }).lean();
    console.log("asdsadasd");
    const BookingQuery = await Booking.count({
      workId: req.params.id,
      $and: [{ bookingStatus: { $ne: 3 } }, { bookingStatus: { $ne: 4 } }],
    }).lean();

    console.log(serviceRequestQuery);
    console.log(BookingQuery);

    if (serviceRequestQuery == 0 && BookingQuery == 0) {
      let sample = "";
      Work.findByIdAndUpdate(
        { _id: req.params.id },
        {
          deleteflag: 1,
        },
        function (err, doc) {
          if (!err) {
            sample = doc;
            WorkMiddleware(doc);
            console.log("Deleted Successfully ");
            res.send("Deleted Successfully ");
          } else {
            res.send(err);
          }
        }
      );
      const id = await Work.findOne({ _id: req.params.id })
        .select("workerId")
        .lean()
        .exec();
      console.log(id);
      const works = await Work.find({
        workerId: id.workerId,
        deleteflag: false,
      })
        .select("ServiceSubId")
        .lean()
        .exec();
      let availableWorks = [];
      works.forEach((x) => {
        console.log(x.ServiceSubId);

        availableWorks.push(x.ServiceSubId.ServiceSubCategory);
      });
      Workers.findOneAndUpdate(
        { _id: id.workerId },
        { $set: { works: availableWorks } },
        function (err) {
          if (!err) {
            console.log("sdsad");
          } else {
            console.log(err);
          }
        }
      );
    } else {
      console.log("A Request is on going cannot delete");
      res.send("A Request is on going cannot delete");
    }
  });

router.route("/WorkList/:UserId").get(
  // authenticateToken,
  function (req, res) {
    Work.find(
      { workerId: req.params.UserId, deleteflag: false },
      function (err, found) {
        if (found) {
          res.send(found);
          // console.log(res);
        } else {
          res.send("No such data found");
        }
      }
    );
  }
);

module.exports = router;
