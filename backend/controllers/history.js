const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const History = require("../models/history");
const User = require("../models/user");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const fns = require("date-fns");

const getHistory = async (req, res, next) => {
  let history;

  try {
    const creator = req.userData.userId;
    history = await History.find({ creator });
  } catch (err) {
    const error = new HttpError("Something went wrong!", 500);
    return next(error);
  }

  if (!history) {
    const error = new HttpError("Could not find any history data!", 404);
    return next(error);
  }

  res.json({ history });
};

const getHistoryById = async (req, res, next) => {
  let history;
  try {
    history = await History.findById(req.params.id);
  } catch (err) {
    const error = new HttpError("Something went wrong!", 500);
    return next(error);
  }

  if (!history) {
    const error = new HttpError("Could not find any history data!", 404);
    return next(error);
  }

  res.json({ history: history.toObject({ getters: true }) });
};

const getHistoryForAWeek = async (req, res, next) => {
  try {
    const history = await History.aggregate([
      {
        $match: {
          creator: new ObjectId(req.userData.userId)
        },
      },
      {
        $group: {
          _id: "$date",
          categories: {
            $push: {
              category: "$category",
              balance: "$balance",
              total: "$total",
            },
          },
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
      {
        $limit: 7,
      },
    ]).exec();

    res.status(200).json({ history });
  } catch(err) {
    console.log(err);
    const error = new HttpError("Fetching history data failed, try again.", 500);
    return next(error);
  }

};

const addHistory = async (data, creator) => {
  // const existingRecord = await History.aggregate([
  //   {
  //     $match: {
  //       creator: new ObjectId(creator),
  //       category: data.category,
  //       date: data.date,
  //     },
  //   },
  // ]).exec();

  // if (existingRecord.length) {
  //   return true;
  // }

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    new HttpError("User not found, try again.", 500);
  }

  try {
    const addNewHistoryData = new History({
      ...data,
      date: fns.format(new Date(), "yyyy-MM-dd"),
      creator,
    });

    await addNewHistoryData.save();
    user.history.push(addNewHistoryData);
    await user.save({ validateModifiedOnly: true });
  } catch (err) {
    console.log(err);
    new HttpError("Adding new history data failed, try again.", 500);
  }

  return true;
};

const updateHistory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Error!", 422));
  }

  const { category, balance, total, currency, date, id } = req.body;

  let history;
  try {
    history = await History.findById(id);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find history data by ID.",
      500
    );
    return next(error);
  }

  if (history.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to modify this history data.",
      401
    );
    return next(error);
  }

  if (category) history.category = category;
  if (balance) history.balance = balance;
  if (total) history.total = total;
  if (currency) history.currency = currency;
  if (date) history.date = date;

  try {
    await history.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update history data",
      500
    );
    return next(error);
  }

  res.status(200).json({ history: history.toObject({ getters: true }) });
};

const deleteHistory = async (req, res, next) => {
  try {
    const sess = await mongoose.startSession();

    let history;
    try {
      history = await History.findById(req.params.id).populate("creator");
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find history data by ID.",
        500
      );
      return error;
    }

    if (!history) {
      const error = new HttpError(
        "Could not find history data for this ID.",
        404
      );
      return error;
    }

    if (history.creator.id !== userId) {
      const error = new HttpError(
        "You are not allowed to delete this history data.",
        401
      );
      return error;
    }

    try {
      sess.startTransaction();
      await history.remove({ session: sess });
      history.creator.history.pull(history);
      await history.creator.save({ session: sess });
      sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not delete history data.",
        500
      );
      return error;
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update history data.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted history data!" });
};

exports.getHistory = getHistory;
exports.getHistoryById = getHistoryById;
exports.addHistory = addHistory;
exports.updateHistory = updateHistory;
exports.deleteHistory = deleteHistory;
exports.getHistoryForAWeek = getHistoryForAWeek;
