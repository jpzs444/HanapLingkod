const express = require("express");
const Workers = require("../Models/Workers");
const router = express.Router();
const Worker = require("../Models/Workers");
const Work = require("../Models/Work");
const { Router } = require("express");
const multer = require("multer");
const cloudinary = require("../Helpers/cloudinary");

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

router.route("/Worker").get(async function (req, res) {
  Worker.find({}, function (err, found) {
    if (found) {
      res.send(found);
    } else {
      res.send("No such data found");
    }
  });
});

//////specific///

router
  .route("/Worker/:id")
  .get(function (req, res) {
    Worker.findOne({ _id: req.params.id }, function (err, found) {
      if (found) {
        res.send(found);
      } else {
        res.send("No such data found");
      }
    });
  })
  .put(upload.single("profilePic"), async function (req, res) {
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

    Worker.findOneAndUpdate({ _id: req.params.id }, workerObj, function (err) {
      if (!err) {
        res.send("Updated Successfully");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Worker.findOneAndDelete({ _id: req.params.id }).exec();
    Work.deleteMany({ workerId: req.params.id }, function (err) {
      if (!err) {
        res.send("Deleted Successfully ");
      } else {
        res.send(err);
      }
    });
    // res.send("DeleteDone");
  });

module.exports = router;
