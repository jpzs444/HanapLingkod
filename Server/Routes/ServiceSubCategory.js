const express = require("express");
const router = express.Router();
const ServiceSubCategory = require("../Models/SubCategory");
const Work = require("../Models/Work");
const ServiceRequest = require("../Models/ServiceRequest");
const Booking = require("../Models/Booking");
const { SubCategoryMiddleware } = require("../Helpers/DeleteMiddleware");
const multer = require("multer");
const cloudinary = require("../Helpers/cloudinary");
const { authenticate } = require("passport");
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

router
  .route("/service-sub-category")
  .get(async function (req, res) {
    try {
      let queryResult = await ServiceSubCategory.find({
        deleteflag: false,
      }).exec();
      res.send(queryResult);
    } catch (error) {
      res.send(error);
    }
  })
  .post(authenticateToken, function (req, res) {
    const SubCategory = new ServiceSubCategory({
      ServiceID: req.body.ServiceID,
      ServiceSubCategory: req.body.ServiceID,
    });
    SubCategory.save(function (err) {
      if (!err) {
        res.send("New Service Sub Category Created");
      } else {
        res.send(err);
      }
    });
  })
  .delete(authenticateToken, function (req, res) {
    ServiceSubCategory.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all files");
      } else {
        res.send(err);
      }
    });
  });

///specific////

router
  .route("/service-sub-category/:id")
  .get(function (req, res) {
    ServiceSubCategory.find({ _id: req.params.id }, function (err, services) {
      if (services) {
        res.send(services);
      } else {
        res.send("No such data found");
      }
    });
  })
  .put(upload.single("image"), async function (req, res) {
    const image = await cloudinary.uploader.upload(req.file.path, {
      folder: "HanapLingkod/Sub_Category",
    });

    ServiceSubCategory.findByIdAndUpdate(
      { _id: req.params.id },
      { image: image.url }
    ).exec();
    res.send("Updated success");
  })

  .delete(async function (req, res) {
    console.log("asd");
    const workQuery = await Work.find(
      {
        ServiceSubId: req.params.id,
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
    // console.log(serviceRequestQuery);
    if (serviceRequestQuery == 0 && BookingQuery == 0) {
      ServiceSubCategory.findOneAndUpdate(
        { _id: req.params.id },
        {
          deleteflag: 1,
        },
        function (err, doc) {
          if (!err) {
            SubCategoryMiddleware(doc);
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

module.exports = router;
