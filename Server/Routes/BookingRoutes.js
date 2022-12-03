const express = require("express");
const router = express.Router();
const ServiceRequest = require("../Models/ServiceRequest");
const Recruiter = require("../Models/Recruiters");
const Worker = require("../Models/Workers");
const Booking = require("../Models/Booking");
const notification = require("../Helpers/PushNotification");
const dayjs = require("dayjs");
const Recruitercomment = require("../Models/RecruiterComment");
const Workercomment = require("../Models/WorkerComment");
const {
  RatingAverageWorker,
  RatingAverageRecruiter,
} = require("../Helpers/RatingAverage");
const WorkerComment = require("../Models/WorkerComment");
const RecruiterComment = require("../Models/RecruiterComment");
const { generateAccessToken, authenticateToken } = require("../Helpers/JWT");

router
  .route("/booking/:user")
  .get(authenticateToken, async function (req, res) {
    try {
      let page;
      if (req.query.page) {
        page = parseInt(req.query.page);
      } else {
        page = 1;
      }
      const limit = 10;

      let queryResultWorker = await Booking.find({
        workerId: req.params.user,
        bookingStatus: { $ne: 2 },
        $and: [{ bookingStatus: { $ne: 2 } }, { bookingStatus: { $ne: 3 } }],
        deleteflag: false,
      })
        .sort({ serviceDate: -1 })
        .limit(limit * page)
        .lean();
      let queryResultRecruiter = await Booking.find({
        recruiterId: req.params.user,
        $and: [{ bookingStatus: { $ne: 2 } }, { bookingStatus: { $ne: 3 } }],
      })
        .sort({ serviceDate: -1 })
        .limit(limit * page)
        .lean();
      let Status2_worker = await Booking.find({
        workerId: req.params.user,
        bookingStatus: 2,
      }).lean();

      let Status2_recruiter = await Booking.find({
        recruiterId: req.params.user,
        bookingStatus: 2,
      }).lean();
      res.send({
        worker: queryResultWorker,
        recruiter: queryResultRecruiter,
        Status2_worker: Status2_worker,
        Status2_recruiter: Status2_recruiter,
      });
    } catch (error) {
      res.send(error);
    }
  });

router
  .route("/booking/:user/:id")
  .put(authenticateToken, async function (req, res) {
    // console.log(typeof req.body.confirmWorker);
    let result = await Booking.findOneAndUpdate(
      { _id: req.params.id },
      {
        bookingStatus: req.body.bookingStatus,
        statusWorker: req.body.statusWorker,
        statusRecruiter: req.body.statusRecruiter,
      },
      { new: true }
    );
    const { statusWorker, statusRecruiter, workerId, recruiterId } = result;

    //push token
    const pushIDWorker = await Worker.findOne(
      { _id: workerId },
      { pushtoken: 1, _id: 0 }
    ).lean();
    const pushIDRecruiter = await Recruiter.findOne(
      { _id: recruiterId },
      { pushtoken: 1, _id: 0 }
    ).lean();
    console.log(recruiterId);
    if (req.body.statusRecruiter == 3) {
      let newComment = await Workercomment.create([
        {
          bookingId: req.params.id,
          reviewee: workerId,
          reviewer: recruiterId,
          rating: req.body.rating,
          message: req.body.message,
        },
      ]);
      RatingAverageWorker(workerId);

      // console.log(newComment[0]._id);
      // Worker.findOneAndUpdate(
      //   { _id: workerId },
      //   {
      //     $push: { comments: newComment[0]._id },
      //   },
      //   function (err) {
      //     if (!err) {
      //       console.log("added comment worker");
      //     } else {
      //       console.log(err);
      //     }
      //   }
      // );

      notification(
        [pushIDWorker.pushtoken],
        "Recruiter mark the booking as done",
        "lorem ipsum ",
        { Type: "Updated Booking Status", id: req.params.id },
        workerId
      );
    }
    if (req.body.statusWorker == 3) {
      let newComment = await Recruitercomment.create([
        {
          bookingId: req.params.id,
          reviewee: recruiterId,
          reviewer: workerId,
          rating: req.body.rating,
          message: req.body.message,
        },
      ]);
      RatingAverageRecruiter(recruiterId);
      // Recruiter.findOneAndUpdate(
      //   { _id: recruiterId },
      //   {
      //     $push: { comments: newComment[0]._id },
      //   },
      //   function (err) {
      //     if (!err) {
      //       console.log("added comment recruiter");
      //     } else {
      //       console.log(err);
      //     }
      //   }
      // );
      notification(
        [pushIDRecruiter.pushtoken],
        "worker mark the booking as done",
        "lorem ipsum ",
        { Type: "Updated Booking Status", id: req.params.id },
        recruiterId
      );
    }
    if (statusWorker == 3 && statusRecruiter == 3) {
      // console.log("");
      Booking.findOneAndUpdate(
        { _id: req.params.id },
        {
          bookingStatus: 3,
        },
        function (err) {
          if (!err) {
            console.log("booking updated to Done");
          } else {
            console.log(err);
          }
        }
      );
      //remove from user
      console.log(req.params.id);
      Worker.findOneAndUpdate(
        { _id: req.params.user },
        { $pull: { unavailableTime: { bookingId: req.params.id } } }
      ).exec();
    }

    if (req.body.statusWorker == 2) {
      Booking.findOneAndUpdate(
        { _id: req.params.id },
        {
          bookingStatus: 2,
        },
        function (err) {
          if (!err) {
            console.log("booking updated to Ongoing");
          } else {
            console.log(err);
          }
        }
      );
      // notify recruiter
      notification(
        [pushIDRecruiter.pushtoken],
        "On the Way",
        "Worker is on the way",
        { Type: "Updated Booking Status", id: req.params.id },

        recruiterId
      );
    }
    if (req.body.statusWorker == 4 || result.statusRecruiter == 4) {
      Booking.findOneAndUpdate(
        { _id: req.params.id },
        {
          bookingStatus: 4,
        },
        function (err) {
          if (!err) {
            console.log("booking updated to Cancelled");
          } else {
            console.log(err);
          }
        }
      );
      if (req.body.statusWorker == 4) {
        notification(
          [pushIDRecruiter.pushtoken],
          "Worker cancelled the booking",
          "lorem ipsum ",
          { Type: "Updated Booking Status", id: req.params.id },
          recruiterId
        );
      }
      if (result.statusRecruiter == 4) {
        notification(
          [pushIDWorker.pushtoken],
          "Worker cancelled the booking",
          "lorem ipsum ",
          { Type: "Updated Booking Status", id: req.params.id },
          workerId
        );
      }
      console.log(req.params.id);
      Worker.findOneAndUpdate(
        { _id: req.params.user },
        { $pull: { unavailableTime: { bookingId: req.params.id } } }
      ).exec();
    }

    if (result.statusRecruiter == 5) {
      Booking.findOneAndUpdate(
        { _id: req.params.id },
        {
          bookingStatus: 5,
        },
        function (err) {
          if (!err) {
            console.log("booking updated to confirmed OTP");
          } else {
            console.log(err);
          }
        }
      );
    }
    res.send("updated Sucess");
  })
  .get(authenticateToken, async function (req, res) {
    try {
      let queryResult = await Booking.find({ _id: req.params.id });
      res.send(queryResult);
    } catch (error) {
      res.send(error);
    }
  })
  .delete(async function (req, res) {
    Booking.findByIdAndUpdate(
      { _id: req.params.id },
      { deleteflag: true },
      function (err) {
        if (!err) {
          res.send("Deleted Succesfully");
        }
      }
    );
  });

router
  .route("/completed-bookings/:user")
  .get(authenticateToken, async function (req, res) {
    try {
      let page;
      if (req.query.page) {
        page = parseInt(req.query.page);
      } else {
        page = 1;
      }
      const limit = 10;

      let queryResultWorker = await Booking.find({
        workerId: req.params.user,
        bookingStatus: 3,
        deleteflag: false,
      })
        .sort({ date: -1, bookingStatus: 1 })
        .limit(limit * page)
        .lean();
      let queryResultRecruiter = await Booking.find({
        recruiterId: req.params.user,
        bookingStatus: 3,
      })
        .sort({ date: -1, bookingStatus: 1 })
        .limit(limit * page)
        .lean();

      res.send({ worker: queryResultWorker, recruiter: queryResultRecruiter });
    } catch (error) {
      res.send(error);
    }
  });

router
  .route("/completed-bookings/:user/:id")
  .get(authenticateToken, async function (req, res) {
    try {
      let queryResult = await Booking.find({ _id: req.params.id });
      res.send(queryResult);
    } catch (error) {
      res.send(error);
    }
  });

router.route("/booking-comment/:id").post(async function (req, res) {
  console.log(req.body.comment);
  Booking.findOneAndUpdate(
    { _id: req.params.id },
    {
      comment: req.body.comment,
    },
    function (err) {
      if (!err) {
        res.send("Success");
      } else {
        console.log(err);
      }
    }
  );
});

router.route("/reviews/:bookingId").get(async function (req, res) {
  console.log(req.params.bookingId);
  const workerCommentResult = await WorkerComment.find({
    bookingId: req.params.bookingId,
  })
    .lean()
    .exec();
  const recruiterCommentResult = await RecruiterComment.find({
    bookingId: req.params.bookingId,
  })
    .lean()
    .exec();

  res.send({ worker: workerCommentResult, recruiter: recruiterCommentResult });
});

module.exports = router;
