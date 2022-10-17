const Worker = require("../Models/Workers");

function AddToCalendar(BookingInfo) {
  const { _id, workerId, startTime, endTime } = BookingInfo;
  console.log(_id, startTime, endTime);
  Worker.findOneAndUpdate(
    { _id: workerId },
    {
      $push: {
        unavailableTime: {
          title: "Booking",
          startTime: startTime,
          bookingId: _id,
          endTime: endTime,
          wholeDay: 0,
          CannotDelete: 1,
        },
      },
    },
    function (err) {
      if (!err) {
        console.log("Succesfully added schedule");
      } else {
        console.log(err);
      }
    }
  );
}

module.exports = AddToCalendar;
