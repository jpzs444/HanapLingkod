const express = require("express");
const router = express.Router();
const ServiceRequest = require("../Models/ServiceRequest");
const Recruiter = require("../Models/Recruiters");
const Worker = require("../Models/Workers");
const Booking = require("../Models/Booking");
const notification = require("../Helpers/PushNotification");
const dayjs = require("dayjs");
const AddToCalendar = require("../Helpers/TimeAdder");
const checkConflict = require("../Helpers/ConflictChecker");
const generateOTP = require("../Helpers/OTP_Generator");
const { CheckIfBan } = require("../Helpers/banChecker");
const { generateAccessToken, authenticateToken } = require("../Helpers/JWT");
const BookingEmail = require("../Helpers/BookingEmail");

// CORS
const cors = require("cors");
router.use(cors({ origin: "*" }));

router
  .route("/service-request/:user")
  .get(authenticateToken, CheckIfBan, async function (req, res) {
    console.log(req.params.user);
    try {
      let page;
      if (req.query.page) {
        page = parseInt(req.query.page);
      } else {
        page = 1;
      }
      const limit = 10;

      let queryResultWorker = await ServiceRequest.find({
        workerId: req.params.user,
        requestStatus: { $ne: 3 },
        deleteflag: false,
      })
        .sort({ serviceDate: -1 })
        .limit(limit * page)
        .lean();
      let queryResultRecruiter = await ServiceRequest.find({
        recruiterId: req.params.user,
        requestStatus: { $ne: 3 },
        deleteflag: false,
      })
        .sort({ serviceDate: -1 })
        .limit(limit * page)
        .lean();

      let status3_Worker = await ServiceRequest.find({
        workerId: req.params.user,
        requestStatus: 3,
        deleteflag: false,
      }).lean();

      let status3_Recruiter = await ServiceRequest.find({
        recruiterId: req.params.user,
        requestStatus: 3,
        deleteflag: false,
      });

      res.send({
        worker: queryResultWorker,
        recruiter: queryResultRecruiter,
        status3_Worker: status3_Worker,
        status3_Recruiter: status3_Recruiter,
      });
    } catch (error) {
      res.send(error);
    }
  });
router
  .route("/service-request")
  .post(authenticateToken, CheckIfBan, async function (req, res) {
    try {
      console.log("asd");
      let pendingRequest = await ServiceRequest.count({
        recruiterId: req.body.recruiterId,
        requestStatus: 1,
        deleteflag: false,
      })
        .lean()
        .exec();
      console.log(pendingRequest);
      if (pendingRequest === 0) {
        console.log("true");
        let startTime = dayjs(
          req.body.serviceDate + " " + req.body.startTime
        ).toISOString();
        const pushID = await Worker.findOne(
          { _id: req.body.workerId },
          { pushtoken: 1, _id: 0 }
        ).lean();
        const serviceRequest = new ServiceRequest({
          workerId: req.body.workerId,
          recruiterId: req.body.recruiterId,
          workId: req.body.workId,
          subCategory: req.body.subCategory,
          address: req.body.address,
          minPrice: req.body.minPrice,
          maxPrice: req.body.maxPrice,
          serviceDate: req.body.serviceDate,
          startTime: startTime,
          description: req.body.description,
          geometry: {
            type: "point",
            coordinates: [req.body.long, req.body.lat],
          },
          requestStatus: 1,
        });
        console.log(serviceRequest._id);
        serviceRequest.save(function (err) {
          if (!err) {
            console.log("new request created");
            res.send("true");
            notification(
              [pushID.pushtoken],
              "A new request has been sent to you!",
              " Kindly check your requests on the homepage or in the three-line menu.",
              { Type: "New Service Request", id: serviceRequest._id },
              req.body.workerId
            );
          } else {
            res.send(err);
          }
        });
      } else {
        console.log("false");
        res.send("false");

        console.log("A pending request is still existing");
      }
    } catch (error) {
      res.send(error);
    }
  });
//
router
  .route("/service-request/:user/:id")
  .put(authenticateToken, CheckIfBan, async function (req, res) {
    try {
      let endTime;
      let result;

      if (req.body.endDate !== undefined && req.body.endTime !== undefined) {
        console.log(
          "endDate:" + req.body.endDate + " end time " + req.body.endTime
        );
        endTime = dayjs(
          req.body.endDate + " " + req.body.endTime
        ).toISOString();
      }
      result = await ServiceRequest.findOne({ _id: req.params.id });

      const { workerId, recruiterId } = result;
      const pushIDWorker = await Worker.findOne(
        { _id: workerId },
        { pushtoken: 1, emailAddress: 1, firstname: 1, lastname: 1, _id: 0 }
      ).lean();
      console.log(pushIDWorker);
      const pushIDRecruiter = await Recruiter.findOne(
        { _id: recruiterId },
        { pushtoken: 1, emailAddress: 1, firstname: 1, lastname: 1, _id: 0 }
      ).lean();

      if (req.body.acceptMore === "false") {
        console.log(workerId);
        Worker.findOneAndUpdate(
          { _id: workerId },
          {
            $push: {
              unavailableTime: {
                title: "Cannot Accept Anymore",
                startTime: result.startTime,
                wholeDay: 1,
                CannotDelete: 0,
              },
            },
          },
          function (err) {
            if (!err) {
              console.log("Cannot accept more today");
            } else {
              console.log(err);
            }
          }
        );
      }

      // console.log(endTime);
      if (req.body.requestStatus == 2) {
        console.log("time outside function: " + endTime);
        if (await checkConflict(req.params.user, req.params.id, endTime)) {
          console.log(
            "conflict cheker result:" +
              (await checkConflict(req.params.user, req.params.id, endTime))
          );
          console.log("Conflict Scheadule");
          res.status(400).send({ success: false });
        } else {
          const reqObj = {
            requestStatus: req.body.requestStatus,
            endTime: req.body.endTime,
          };
          reqObj.endTime = endTime;
          await ServiceRequest.findOneAndUpdate(
            { _id: req.params.id },
            reqObj,
            {
              new: true,
            }
          );

          //create booking
          const OTP = generateOTP(6);
          // console.log(result);
          const newBooking = await Booking.create({
            workerId: result.workerId,
            recruiterId: result.recruiterId,
            workId: result.workId,
            subCategory: result.subCategory,
            minPrice: result.minPrice,
            maxPrice: result.maxPrice,
            serviceDate: result.serviceDate,
            startTime: result.startTime,
            endTime: endTime,
            description: result.description,
            otp: OTP,
            bookingStatus: 1,
            address: result.address,
            geometry: {
              type: "point",
              coordinates: [
                result.geometry.coordinates[0],
                result.geometry.coordinates[1],
              ],
            },
          });
          AddToCalendar(newBooking);
          //put delete flag to true
          await ServiceRequest.findOneAndUpdate(
            { _id: req.params.id },
            {
              deleteflag: true,
            }
          );
          // notify recruiter
          notification(
            [pushIDRecruiter.pushtoken],
            "Your request has been accepted!",
            "Kindly check your bookings on the homepage or in the three-line menu.",
            { Type: "updated Service Request", id: req.params.id },
            recruiterId
          );

          //email
          let date1 = dayjs(result.serviceDate).format("DD/MM/YYYY");

          let time1 = dayjs(result.startTime).format("hh:mm:ss A");
          //worker
          let subjectWorker = "Booking Confirmation " + date1 + " " + time1;
          let textWorker =
            "You accepted a request!\n" +
            "\n" +
            "Good day, " +
            pushIDWorker.firstname +
            " " +
            pushIDWorker.lastname +
            "\n " +
            "\n" +
            "This email serves as a confirmation that you have accepted a request from " +
            pushIDRecruiter.firstname +
            " " +
            pushIDRecruiter.lastname +
            "\n" +
            "and further details can be viewed in its booking information, which can be accessed \n" +
            "through the bookings list in the HanapLingkod Application. If you are not the one who accepted\n" +
            "the request, or you wish to cancel the booked service, you may cancel it directly through the application.\nThank you.";
          BookingEmail(subjectWorker, textWorker, pushIDWorker.emailAddress);
          //recruiter
          let subjectRecruiter = "Booking Confirmation " + date1 + " " + time1;
          let textRecruiter =
            "Your request has been accepted!\n" +
            "\n" +
            "Good day, " +
            pushIDRecruiter.firstname +
            " " +
            pushIDRecruiter.lastname +
            "\n " +
            "\n" +
            "This email serves as a confirmation that you have a booked service with " +
            pushIDWorker.firstname +
            " " +
            pushIDWorker.lastname +
            "\n" +
            "and further details can be viewed in its booking information, which can be accessed through the \n" +
            "bookings list in the HanapLingkod Application. If you are not the one who booked the service, or \n" +
            "you wish to cancel the booked service, you may cancel it directly through the application.\n Thank you.";

          BookingEmail(
            subjectRecruiter,
            textRecruiter,
            pushIDRecruiter.emailAddress
          );

          console.log("Successfully Updated status 2");
          res.status(200).send({ success: true });
        }
      }

      if (req.body.requestStatus == 3) {
        console.log("asdscanel");
        await ServiceRequest.findOneAndUpdate(
          { _id: req.params.id },
          {
            requestStatus: req.body.requestStatus,
            updated_at: Date.now(),
          },
          {
            new: true,
          }
        );
        notification(
          [pushIDRecruiter.pushtoken],
          "We regret to inform you that your request has been rejected.",
          "Kindly look for other available workers or post a service request.",
          { Type: "updated Service Request", id: req.params.id },

          recruiterId
        );
        res.send("Successfully Updated to status 3 ");
      }

      if (req.body.requestStatus == 4) {
        console.log("ssss");
        await ServiceRequest.findOneAndUpdate(
          { _id: req.params.id },
          {
            requestStatus: req.body.requestStatus,
          },
          {
            new: true,
          }
        );
        notification(
          [pushIDWorker.pushtoken],
          "We regret to inform you that a request to you has been canceled.",
          "You may check the reason for cancellation in your requests",
          { Type: "updated Service Request", id: req.params.id },
          workerId
        );
        res.send("Successfully Updated to status 4 ");
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  })

  .get(authenticateToken, async function (req, res) {
    try {
      let queryResult = await ServiceRequest.find({ _id: req.params.id });
      res.send(queryResult);
    } catch (error) {
      res.send(error);
    }
  })
  .delete(authenticateToken, async function (req, res) {
    ServiceRequest.findByIdAndUpdate(
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
  .route("/service-request-comment/:id")
  .post(authenticateToken, async function (req, res) {
    ServiceRequest.findOneAndUpdate(
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

module.exports = router;
