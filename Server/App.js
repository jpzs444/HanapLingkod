const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require("bcrypt");

//models
const Worker = require("./Models/Workers");
const Recuiter = require("./Models/Recuiters");
const Work = require("./Models/Work");
const ServiceCategory = require("./Models/ServiceCategory");
const ServiceSubCategory = require("./Models/SubCategory");

//helper
const Check = require("./Helpers/ifUserExist");
const notification = require("./Helpers/PushNotification");
//routes
const ServiceCategoryRoutes = require("./Routes/ServiceCategoryRoutes");
const ServiceSubCategoryRoutes = require("./Routes/ServiceSubCategory");
const UsernotificationRoutes = require("./Routes/UserNotificationRoutes");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.connect(
  "mongodb+srv://admin-Patrick:test123@cluster0.2anjoo0.mongodb.net/?retryWrites=true&w=majority"
  // "mongodb://localhost:27017/hanapLingkod"
);

const conn = mongoose.connection;

conn.on("error", () => console.error.bind(console, "connection error"));

conn.once("open", () => console.info("Connection to Database is successful"));

module.exports = conn;

//store photos
const storage = multer.diskStorage({
  //destination for files
  destination: function (request, file, callback) {
    callback(null, "./Public/Uploads");
  },

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

// notification(["ExponentPushToken[gGbp3QMm-ufwxCiXde8v7t]"], "666", "message34");

//Login
app.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered" });
    }
    //check if the username exist in recuiter or worker
    let ifWorkerExist = await Worker.exists({ username: username });
    let ifRecuiterExist = await Recuiter.exists({ username: username });
    let user;
    if (ifWorkerExist) {
      user = await Worker.findOne({ username: username });
    } else {
      user = await Recuiter.findOne({ username: username });
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

app.post(
  "/signup/worker",
  Check.ifRecruiterExist,
  Check.ifWorkerExist,
  multipleFile,
  async (req, res) => {
    const session = await conn.startSession();

    try {
      session.startTransaction();

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const worker = await Worker.create(
        [
          {
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
            GovId: req.files.govId[0].filename,
            licenseCertificate: req.files.certificate[0].filename,
            role: "worker",
            verification: false,
            accountStatus: "active",
          },
        ],
        { session }
      );

      let serviceSubCategoryID;
      for (var i = 0; i < req.body.Category.length; i += 1) {
        if (req.body.Category[i] == "unlisted") {
          let unlistedID = await ServiceCategory.findOne(
            { Category: "unlisted" },
            { Category: 0 }
          );
          const serviceSubCategory = await ServiceSubCategory.create(
            [
              {
                ServiceID: unlistedID._id,
                ServiceSubCategory: req.body.ServiceSubCategory[i],
              },
            ],
            { session }
          );

          serviceSubCategoryID = serviceSubCategory[0].id;
        } else {
          let result = await ServiceSubCategory.findOne(
            { ServiceSubCategory: req.body.ServiceSubCategory[i] },
            { ServiceSubCategory: 0, ServiceID: 0 },
            { session }
          );
          serviceSubCategoryID = result._id;
        }
        const work = await Work.create(
          [
            {
              ServiceSubCode: serviceSubCategoryID,
              workerId: worker[0].id,
              minPrice: req.body.minPrice[i],
              maxPrice: req.body.maxPrice[i],
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
  }
);

//signup recruiter
app.post(
  "/signup/recruiter",
  Check.ifRecruiterExist,
  Check.ifWorkerExist,
  upload.single("govId"),
  async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const recuiter = new Recuiter({
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
        GovId: req.body.path,
        verification: false,
        accountStatus: "active",
        role: "recuiter",
      });
      recuiter.save((err) => {
        if (err) {
          res.json({ message: err.message, type: "danger" });
        } else {
          res.send("Recuiter account created");
        }
      });
    } catch {
      res.status(500).send();
    }
  }
);

app.use(ServiceCategoryRoutes);
app.use(ServiceSubCategoryRoutes);
app.use(UsernotificationRoutes);

app.listen(3000, () => console.log("listening on port 3000."));
