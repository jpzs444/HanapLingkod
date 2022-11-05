const RecruiterComment = require("../Models/RecruiterComment");
const Recruiters = require("../Models/Recruiters");
const WorkerComment = require("../Models/WorkerComment");
const Workers = require("../Models/Workers");

async function RatingAverageWorker(user) {
  let ratings = await WorkerComment.find(
    { reviewee: user },
    { _id: 0, rating: 1 }
  ).lean();

  let rating5 = ratings.filter(function (item) {
    if (item.rating === 5) {
      return true;
    } else {
      return false;
    }
  }).length;

  let rating4 = ratings.filter(function (item) {
    if (item.rating === 4) {
      return true;
    } else {
      return false;
    }
  }).length;

  let rating3 = ratings.filter(function (item) {
    if (item.rating === 3) {
      return true;
    } else {
      return false;
    }
  }).length;

  let rating2 = ratings.filter(function (item) {
    if (item.rating === 2) {
      return true;
    } else {
      return false;
    }
  }).length;

  let rating1 = ratings.filter(function (item) {
    if (item.rating === 1) {
      return true;
    } else {
      return false;
    }
  }).length;

  let AR = (
    (1 * rating1 + 2 * rating2 + 3 * rating3 + 4 * rating4 + 5 * rating5) /
    ratings.length
  ).toFixed(1);
  console.log(AR);
  Workers.findOneAndUpdate({ _id: user }, { rating: AR }, function (err) {
    if (!err) {
      console.log("added average rating");
    } else {
      console.log(err);
    }
  });
}

async function RatingAverageRecruiter(user) {
  let ratings = await RecruiterComment.find(
    { reviewee: user },
    { _id: 0, rating: 1 }
  ).lean();

  let rating5 = ratings.filter(function (item) {
    if (item.rating === 5) {
      return true;
    } else {
      return false;
    }
  }).length;

  let rating4 = ratings.filter(function (item) {
    if (item.rating === 4) {
      return true;
    } else {
      return false;
    }
  }).length;

  let rating3 = ratings.filter(function (item) {
    if (item.rating === 3) {
      return true;
    } else {
      return false;
    }
  }).length;

  let rating2 = ratings.filter(function (item) {
    if (item.rating === 2) {
      return true;
    } else {
      return false;
    }
  }).length;

  let rating1 = ratings.filter(function (item) {
    if (item.rating === 1) {
      return true;
    } else {
      return false;
    }
  }).length;
  let AR = (
    (1 * rating1 + 2 * rating2 + 3 * rating3 + 4 * rating4 + 5 * rating5) /
    ratings.length
  ).toFixed(1);
  console.log(AR);
  Recruiters.findOneAndUpdate({ _id: user }, { rating: AR }, function (err) {
    if (!err) {
      console.log("added average rating");
    } else {
      console.log(err);
    }
  });
}

module.exports = { RatingAverageWorker, RatingAverageRecruiter };
