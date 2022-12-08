const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    middlename: String,
    birthday: Date,
    age: Number,
    sex: String,
    street: String,
    purok: String,
    barangay: String,
    city: String,
    province: String,
    phoneNumber: String,
    emailAddress: String,
    profilePic: String,
    GovId: String,
    verification: Boolean,
    accountStatus: String,
    role: String,

    establishment: String,
    workStreet: String,
    workPurok: String,
    workBarangay: String,
    workCity: String,
    workprovince: String,
    licenseCertificate: String,
    workDescription: String,
    prevWorks: [String],
    works: [String],
    pushtoken: { type: String, default: "" },
    unavailableTime: [
      {
        title: String,
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        startTime: Date,
        endTime: Date,
        wholeDay: Boolean,
        CannotDelete: Boolean,
      },
    ],
    // comments: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Workercomment",
    //   },
    // ],
    rating: Number,
    deleteflag: { type: Boolean, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Worker", workerSchema);
