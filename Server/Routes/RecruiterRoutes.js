const express = require("express");
const router = express.Router();
const Recruiter = require("../Models/Recruiters");
const cloudinary = require("../Helpers/cloudinary");

const multer = require("multer");

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

router.route("/Recruiter").get(function (req, res) {
  Recruiter.find({}, function (err, found) {
    if (found) {
      res.send(found);
    } else {
      res.send("No such data found");
    }
  });
});

//////specific///

router
  .route("/Recruiter/:id")
  .get(function (req, res) {
    Recruiter.findOne({ _id: req.params.id }, function (err, found) {
      if (found) {
        res.send(found);
      } else {
        res.send("No such data found");
      }
    });
  })
  .put(upload.single("profilePic"), async function (req, res) {
    let recruiterObj = {
      username: req.body.username,
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
    };
    if (req.file !== undefined) {
      const profilePic = await cloudinary.uploader.upload(req.file.path, {
        folder: "HanapLingkod/profilePic",
      });
      recruiterObj.profilePic = profilePic.url;
    }
    Recruiter.findOneAndUpdate(
      { _id: req.params.id },
      recruiterObj,
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
    Recruiter.findOneAndDelete({ _id: req.params.id }, function (err) {
      if (!err) {
        res.send("Deleted Successfully");
      } else {
        res.send(err);
      }
    });
  });

module.exports = router;
