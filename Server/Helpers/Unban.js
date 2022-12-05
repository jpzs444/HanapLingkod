const { BannedRecruiter, BannedWorker } = require("../Models/BannedUsers");
const dayjs = require("dayjs");

async function Unban(req, res, next) {
  const daysBanned = { 3: 1, 4: 3, 5: 7 };
  for (let i = 3; i <= 5; i++) {
    let bannedRecruiter = await BannedRecruiter.find({ offense: i, ban: true });
    let bannedWorker = await BannedWorker.find({ offense: i, ban: true });
    console.log(daysBanned[i]);
    checker_Recruiter(bannedRecruiter, daysBanned[i]);
    checker_Worker(bannedRecruiter, daysBanned[i]);
  }
}

function checker_Recruiter(items, days) {
  let date = new Date();
  date = dayjs(date);
  for (i of items) {
    let { createdAt } = i;
    const time = dayjs(createdAt);
    if (date.diff(time, "d", true) >= days) {
      BannedRecruiter.findOneAndUpdate(
        { _id: i._id },
        {
          ban: false,
        },
        (err, doc) => {
          if (!err) {
            console.log("User with ID: " + item._id + " is unbanned");
          } else {
            console.log(err);
          }
        }
      );
    }
  }
}

function checker_Worker(items, days) {
  let date = new Date();
  date = dayjs(date);
  for (i of items) {
    let { createdAt } = i;
    const time = dayjs(createdAt);
    if (date.diff(time, "d", true) >= days) {
      BannedWorker.findOneAndUpdate(
        { _id: i._id },
        {
          ban: false,
        },
        (err, doc) => {
          if (!err) {
            console.log("User with ID: " + item._id + " is unbanned");
          } else {
            console.log(err);
          }
        }
      );
    }
  }
}

async function monthlyUnban() {
  BannedWorker.updateMany({}, { ban: false }).exec();
}
module.exports = { Unban, monthlyUnban };
