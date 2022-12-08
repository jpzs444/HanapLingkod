const dayjs = require("dayjs");
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);
var isToday = require("dayjs/plugin/isToday");
const Booking = require("../Models/Booking");
const Recruiters = require("../Models/Recruiters");
const Worker = require("../Models/Workers");
const notification = require("../Helpers/PushNotification");

async function WorkReminder() {
  dayjs.extend(isToday);

  let date = new Date();

  let result = await Booking.find({ bookingStatus: 1 }).exec();
  for (let item of result) {
    // console.log(item.startTime);
    const { startTime, workerId, recruiterId } = item;
    const time = dayjs(startTime);
    if (
      dayjs(startTime).isToday() &&
      time.diff(date, "h", true) > 0 &&
      time.diff(date, "h", true) <= 2
    ) {
      const pushIDWorker = await Worker.findOne(
        { _id: workerId },
        { pushtoken: 1, _id: 0 }
      ).lean();
      const pushIDRecruiter = await Recruiters.findOne(
        { _id: recruiterId },
        { pushtoken: 1, _id: 0 }
      ).lean();

      let time_in_string = dayjs(date).to(time); // in a year

      notification(
        [pushIDWorker.pushtoken],
        "You have a booking scheduled on" + time_in_string,
        "You may check your bookings on the homepage or the thee-line menu",
        workerId
      );

      notification(
        [pushIDRecruiter.pushtoken],
        "You have a booking scheduled on" + time_in_string,
        "You may check your bookings on the homepage or the thee-line menu",
        workerId
      );
    }
  }
}
module.exports = WorkReminder;
