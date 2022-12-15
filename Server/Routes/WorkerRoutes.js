const express = require("express");
const Workers = require("../Models/Workers");
const router = express.Router();
const Worker = require("../Models/Workers");
const Work = require("../Models/Work");
const { Router } = require("express");
const multer = require("multer");
const cloudinary = require("../Helpers/cloudinary");
const ServiceRequest = require("../Models/ServiceRequest");
const Booking = require("../Models/Booking");
const { BannedWorker, BannedRecruiter } = require("../Models/BannedUsers");
const { authenticateToken } = require("../Helpers/JWT");
//store photos
const storage = multer.diskStorage({
  //destination for files
  // destination: function (request, file, callback) {
  //   callback(null, "./Public/Uploads");
  // },

  //add back the extension
  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

//upload the image
const upload = multer({ storage: storage });

// CORS
const cors = require("cors");
router.use(cors({ origin: "*" }));

router.route("/Worker").get(
  // authenticateToken,
  async function (req, res) {
    // console.log("aa");
    let filter = {};
    if (req.query.verification != undefined) {
      filter["verification"] = req.query.verification;
    }
    if (req.query.barangay != undefined) {
      filter["barangay"] = req.query.barangay;
    }
    if (req.query.works != undefined) {
      filter["works"] = req.query.works;
    }
    if (req.query.rating != undefined) {
      filter["rating"] = { $gte: parseFloat(req.query.rating) };
    }
    let page;
    if (req.query.page) {
      page = parseInt(req.query.page);
    } else {
      page = 1;
    }
    const limit = 10;

    //query the banned workers
    const bannedUsersResult = await BannedWorker.find({ ban: true });
    let bannedUsers = [];
    //put the banned users id to an array
    bannedUsersResult.forEach((x) => {
      bannedUsers.push(x.workerId);
    });
    //add the banned users id to filters
    filter["_id"] = {
      $nin: bannedUsers,
    };

    console.log("Worker List filter: " + filter);
    const result = await Worker.find(filter)
      .select(
        "-unavailableTime -licenseCertificate -GovId -pushtoken -password -accountStatus"
      )
      .limit(limit * page)
      .lean()
      .exec();
    res.send(result);
  }
);

//////specific///

router
  .route("/Worker/:id")
  .get(authenticateToken, function (req, res) {
    Worker.findOne({ _id: req.params.id }, function (err, found) {
      if (found) {
        res.send(found);
      } else {
        res.send("No such data found");
      }
    });
  })
  .put(
    authenticateToken,
    upload.single("profilePic"),
    async function (req, res) {
      let workerObj = {
        username: req.body.username,
        // password: hashedPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        middlename: req.body.middlename,
        birthday: req.body.birthday,
        age: req.body.age,
        sex: req.body.sex,
        street: req.body.street,
        purok: req.body.purok,
        barangay: req.body.barangay,
        city: req.body.city,
        province: req.body.province,
        phoneNumber: req.body.phoneNumber,
        emailAddress: req.body.emailAddress,
        workDescription: req.body.workDescription,
      };
      if (req.file !== undefined) {
        const profilePic = await cloudinary.uploader.upload(req.file.path, {
          folder: "HanapLingkod/profilePic",
        });
        workerObj.profilePic = profilePic.url;
      }

      Worker.findOneAndUpdate(
        { _id: req.params.id },
        workerObj,
        function (err) {
          if (!err) {
            res.send("Updated Successfully");
          } else {
            res.send(err);
          }
        }
      );
    }
  )

  .delete(authenticateToken, function (req, res) {
    Worker.findOneAndDelete({ _id: req.params.id }).exec();
    Work.deleteMany({ workerId: req.params.id }).exec();
    ServiceRequest.deleteMany({ workerId: req.params.id }).exec();
    Booking.deleteMany({ workerId: req.params.id }).exec();
  });
module.exports = router;
