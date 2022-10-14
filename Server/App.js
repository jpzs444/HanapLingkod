const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require("bcrypt");
const cloudinary = require("./Helpers/cloudinary");
const fs = require("fs");
const dayjs = require("dayjs");

//models
const Worker = require("./Models/Workers");
const Recruiter = require("./Models/Recruiters");
const ServiceCategory = require("./Models/ServiceCategory");
const ServiceSubCategory = require("./Models/SubCategory");
const Work = require("./Models/Work");

//helper
const notification = require("./Helpers/PushNotification");
//routes
const ServiceCategoryRoutes = require("./Routes/ServiceCategoryRoutes");
const ServiceSubCategoryRoutes = require("./Routes/ServiceSubCategory");
const UsernotificationRoutes = require("./Routes/UserNotificationRoutes");
const WorkerRoutes = require("./Routes/WorkerRoutes");
const WorkRoutes = require("./Routes/WorkRoutes");
const RecruiterRoutes = require("./Routes/RecruiterRoutes");
const ServiceRequestRoutes = require("./Routes/ServiceRequestRoutes");
const RequestPostRoutes = require("./Routes/RequestPostRoutes");
const Booking = require("./Routes/BookingRoutes");
const Calendar = require("./Routes/CalendarRoutes");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.connect(
  "mongodb+srv://admin-Patrick:test123@cluster0.2anjoo0.mongodb.net/?retryWrites=true&w=majority"
  // "mongodb://localhost:27017/hanapLingkod"
);

global.conn = mongoose.connection;

conn.on("error", () => console.error.bind(console, "connection error"));

conn.once("open", () => console.info("Connection to Database is successful"));

module.exports = conn;

//store photos
const storage = multer.diskStorage({
  //destination for files
  // destination: function (request, file, callback) {
  // callback(null, "./Public/Uploads");
  // },

  //add back the extension
  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

//upload the image
const upload = multer({ storage: storage });

//upload multiple files
const multipleFile = upload.fields([
  { name: "govId" },
  { name: "certificate" },
]);

app.get("/images/:filename", async function (req, res) {
  let path = "./Public/Uploads/" + req.params.filename;
  console.log(path);
  try {
    if (fs.existsSync(path)) {
      res.download(path);
    } else {
      res.send("Image Does Not Exist");
      console.log("Image Does Not Exist");
    }
  } catch (err) {
    console.error(err);
  }
});

app.post("/r", async function (req, res) {
  let yy = dayjs("2019-01-25T23:10").format("YYYY-MM-DDTHH:mm:ss");
  console.log(yy);
});

app.get("/search", async function (req, res) {
  let keyword = req.query.keyword;
  let regex = new RegExp(`${keyword}`);
  // console.log(regex);

  let WorkerResult = await Worker.find({
    $or: [{ firstname: regex }, { lastname: regex }, { middlename: regex }],
  })
    .lean()
    .exec();
  let CategoryResult = await ServiceCategory.find({ Category: regex })
    .lean()
    .exec();
  let SubCategoryResult = await ServiceSubCategory.find({
    ServiceSubCategory: regex,
  })
    .lean()
    .exec();

  res.send({
    worker: WorkerResult,
    category: CategoryResult,
    subCategory: SubCategoryResult,
  });
});

//upload prev works
app.post(
  "/prevWorks/:id",
  upload.array("pastWorks", 12),
  async function (req, res) {
    //put the filename to array
    const prevWorkslist = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const result = await cloudinary.uploader.upload(path, {
        folder: "HanapLingkod/prevWorks",
      });
      prevWorkslist.push(result.url);
    }
    // console.log(prevWorkslist);

    Worker.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { prevWorks: prevWorkslist },
      },
      function (err) {
        if (!err) {
          res.send("Updated Successfully");
        } else {
          res.send(err);
        }
      }
    );
  }
);

app.delete("/prevWorks/:id", function (req, res) {
  try {
    console.log(req.body.toDelete);
    const publicId = req.body.toDelete
      .split("/")
      .slice(7)
      .join("/")
      .split(".")[0];
    cloudinary.uploader.destroy(publicId, function (result) {
      console.log(result);
    });

    Worker.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { prevWorks: req.body.toDelete },
      },
      function (err) {
        if (!err) {
          res.send("Deleted Successfully");
        } else {
          res.send(err);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

//check username
app.post("/isUsernameUnique", async function (req, res) {
  // console.log("asd");
  let RecruiterCount = await Recruiter.find({ username: req.body.username })
    .select("username")
    .lean()
    .count()
    .exec();

  let WorkerCount = await Worker.find({ username: req.body.username })
    .select("username")
    .lean()
    .count()
    .exec();
  if (WorkerCount === 0 && RecruiterCount === 0) {
    res.send(true);
  } else {
    res.send(false);
  }
});

//Login
app.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered" });
    }
    //check if the username exist in recruiter or worker
    let ifWorkerExist = await Worker.exists({ username: username });
    let ifRecruiterExist = await Recruiter.exists({ username: username });
    let user;
    if (ifWorkerExist) {
      user = await Worker.findOne({ username: username });
    } else {
      user = await Recruiter.findOne({ username: username });
    }
    if (!user) {
      return res.status(400).json({ msg: "Invalid Username" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

app.post("/signup/worker", multipleFile, async (req, res) => {
  //initialize transactions
  const session = await conn.startSession();

  try {
    //initialize transactions
    session.startTransaction();
    // console.log(req.body);

    //cloudinary upload

    const GovIdURL = await cloudinary.uploader.upload(req.files.govId[0].path, {
      folder: "HanapLingkod/GovId",
    });

    //hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const SubCategory = [].concat(req.body.ServiceSubCategory);

    let workerObj = {
      username: req.body.username,
      password: hashedPassword,
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
      profilePic: "pic",
      GovId: "GovIdURL.url",
      workDescription: req.body.workDescription,
      works: SubCategory,
      role: "worker",
      verification: false,
      accountStatus: "active",
    };
    if (req.files.certificate !== undefined) {
      const CertificateURL = await cloudinary.uploader.upload(
        req.files.certificate[0].path,
        {
          folder: "HanapLingkod/certificate",
        }
      );
      workerObj.licenseCertificate = CertificateURL.url;
    }

    //create worker
    const worker = await Worker.create([workerObj], { session });

    //save service sub category id for future use
    //convert category sub category min max price to arrays to create multiple works documents
    let serviceSubCategoryID;
    const Category = [].concat(req.body.Category);
    const min = [].concat(req.body.minPrice);
    const max = [].concat(req.body.maxPrice);

    for (var i = 0; i < Category.length; i += 1) {
      //check if the sub category is unlisted or not if unlisted create a new sub category if not query and get the id of the sub category
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
        serviceSubCategoryID = result._id;
      }
      //create work
      const work = await Work.create(
        [
          {
            ServiceSubId: serviceSubCategoryID,
            workerId: worker[0].id,
            minPrice: min[i],
            maxPrice: max[i],
          },
        ],
        { session }
      );
    }
    await session.commitTransaction();
    console.log("success");
    res.send("Succesfully Created");
  } catch (err) {
    console.log(err);

    await session.abortTransaction();

    res.status(500).send();
  }
});

//signup recruiter
app.post(
  "/signup/recruiter",
  // Check.ifRecruiterExist,
  // Check.ifWorkerExist,
  upload.single("govId"),
  async (req, res) => {
    try {
      console.log(req.file);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const CertificateURL = await cloudinary.uploader.upload(req.file.path, {
        folder: "HanapLingkod/certificate",
      });

      const recruiter = new Recruiter({
        username: req.body.username,
        password: hashedPassword,
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
        profilePic: "pic",
        GovId: CertificateURL.url,
        verification: false,
        accountStatus: "active",
        role: "recruiter",
      });
      recruiter.save((err) => {
        if (err) {
          res.json({ message: err.message, type: "danger" });
        } else {
          res.send("Recruiter account created");
        }
      });
    } catch {
      res.status(500).send();
    }
  }
);

//routes
app.use(ServiceCategoryRoutes);
app.use(ServiceSubCategoryRoutes);
app.use(UsernotificationRoutes);
app.use(WorkerRoutes);
app.use(RecruiterRoutes);
app.use(WorkRoutes);
app.use(ServiceRequestRoutes);
app.use(RequestPostRoutes);
app.use(Booking);
app.use(Calendar);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("listening on port 3000."));
