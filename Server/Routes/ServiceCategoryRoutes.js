const express = require("express");
const router = express.Router();
const ServiceCategory = require("../Models/ServiceCategory");
const ServiceSubCategory = require("../Models/SubCategory");
const Work = require("../Models/Work");
const ServiceRequest = require("../Models/ServiceRequest");
const Booking = require("../Models/Booking");
const multer = require("multer");
const cloudinary = require("../Helpers/cloudinary");
const { CategoryMiddleware } = require("../Helpers/DeleteMiddleware");
const { generateAccessToken, authenticateToken } = require("../Helpers/JWT");
const { CheckIfBan } = require("../Helpers/banChecker");

// router.use(authenticateToken);
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

router
  .route("/service-category")
  .get(
    authenticateToken, CheckIfBan,
    function (req, res) {
      ServiceCategory.find(
        {
          // deleteflag: false,
        },
        function (err, services) {
          if (services) {
            res.send(services);
          } else {
            res.send("No such data found");
          }
        }
      );
    }
  )
  .post(upload.single("image"), async function (req, res) {
    let image;
    if (req.file !== undefined) {
      image = await cloudinary.uploader.upload(req.file.path, {
        folder: "HanapLingkod/Category",
      });
    }

    const serviceCategory = new ServiceCategory({
      Category: req.body.Category,
      image: image.url,
    });
    serviceCategory.save(function (err) {
      if (!err) {
        res.send("New Service Category Created");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    ServiceCategory.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all files");
      } else {
        res.send(err);
      }
    });
  });

///// specific /////
router
  .route("/service-category/:id")
  .put(upload.single("image"), async function (req, res) {
    console.log("asdsad");
    const image = await cloudinary.uploader.upload(req.file.path, {
      folder: "HanapLingkod/Category",
    });

    ServiceCategory.findOneAndUpdate(
      { _id: req.params.id },
      { image: image.url },
      function (err) {
        if (!err) {
          res.send("Updated Successfully");
        } else {
          res.send(err);
        }
      }
    );
  })

  .get(function (req, res) {
    ServiceCategory.find({ _id: req.params.id }, function (err, services) {
      if (services) {
        res.send(services);
      } else {
        res.send("No such data found");
      }
    });
  })
  .delete(async function (req, res) {
    const subCatQuery = await ServiceSubCategory.find(
      {
        ServiceID: req.params.id,
      },
      { __v: 0, ServiceID: 0, ServiceSubCategory: 0, deleteflag: 0 }
    ).lean();
    const subCatId = subCatQuery.map((object) => object._id);

    const workQuery = await Work.find(
      {
        ServiceSubId: { $in: subCatId },
      },
      {
        __v: 0,
        ServiceSubId: 0,
        workerId: 0,
        minPrice: 0,
        maxPrice: 0,
        deleteflag: 0,
      }
    ).lean();
    const workId = workQuery.map((object) => object._id);

    const serviceRequestQuery = await ServiceRequest.find(
      {
        workId: { $in: workId },
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
        workId: { $in: workId },
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

    if (serviceRequestQuery == 0 && BookingQuery == 0) {
      ServiceCategory.findOneAndUpdate(
        { _id: req.params.id },
        {
          deleteflag: 1,
        },
        function (err, doc) {
          if (!err) {
            CategoryMiddleware(doc);
            res.send("Deleted Successfully ");
          } else {
            res.send(err);
          }
        }
      );
      console.log("asd");
    } else {
      res.send("A Request is on going cannot delete");
    }
  });

module.exports = router;
