const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Asset = require("../models/asset");
const User = require("../models/user");
const mongoose = require("mongoose");
const url = require("url");
const { exchangeRates, roundNumber } = require("../utils/functions");
const fns = require("date-fns");

const getAsset = async (req, res, next) => {
  let assets;
  const queryObject = url.parse(req.url, true).query;

  try {
    const creator = req.userData.userId;
    assets = await Asset.find({ creator, ...queryObject }).sort({
      date: "desc",
    });
  } catch (err) {
    const error = new HttpError("Something went wrong!", 500);
    return next(error);
  }

  if (!assets) {
    const error = new HttpError("Could not find any assets!", 404);
    return next(error);
  }

  res.json({ assets });
};

const getAssetById = async (req, res, next) => {
  let asset;
  try {
    asset = await Asset.findById(req.params.id);
  } catch (err) {
    const error = new HttpError("Something went wrong!", 500);
    return next(error);
  }

  if (!asset) {
    const error = new HttpError("Could not find any assets!", 404);
    return next(error);
  }

  res.json({ asset: asset.toObject({ getters: true }) });
};

const addAsset = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Error!", 422));
  }

  const creator = req.userData.userId;

  const priceInUsd = await exchangeRates(
    req.body.transaction.price,
    req.body.transaction.currency,
    fns.format(new Date(req.body.transaction.date), "yyyy-MM-dd")
  );
  console.log(priceInUsd);
  let quantity = req.body.transaction.quantity;
  // TODO create global constants for types
  if (req.body.transaction.type === 1 || req.body.transaction.type === 3) {
    quantity = -Math.abs(quantity);
  }

  const addNewAsset = new Asset({
    ...req.body.transaction,
    quantity,
    price_usd: roundNumber(priceInUsd),
    date: new Date(req.body.transaction.date).toISOString(),
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Adding new asset asset failed, try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user with provided id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await addNewAsset.save({ session: sess });
    user.assets.push(addNewAsset);
    await user.save({ session: sess, validateModifiedOnly: true });
    sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Adding new asset asset failed, try again.",
      500
    );
    return next(error);
  }

  res.json({ asset: addNewAsset.toObject({ getters: true }) });
};

const updateAsset = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Error!", 422));
  }

  const { price, currency, quantity, date, type } = req.body;

  let asset;
  try {
    asset = await Asset.findById(req.params.id);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find asset by ID.",
      500
    );
    return next(error);
  }

  if (asset.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to modify this asset.",
      401
    );
    return next(error);
  }

  if (price) asset.price = price;
  if (currency) {
    asset.currency = currency;
    const priceInUsd = await exchangeRates(
      asset.price,
      asset.currency,
      fns.format(new Date(asset.date), "yyyy-MM-dd")
    );
    asset.price_usd = priceInUsd;
  }
  if (quantity) {
    // TODO create global constants for types
    if (asset.type === 1 || asset.type === 3) {
      asset.quantity = -Math.abs(quantity);
    } else {
      asset.quantity = quantity;
    }
  }
  if (date) {
    const priceInUsd = await exchangeRates(
      asset.price,
      asset.currency,
      fns.format(new Date(date), "yyyy-MM-dd")
    );
    asset.price_usd = priceInUsd;
    asset.date = new Date(date).toISOString();
  }
  if (type !== asset.type) asset.type = type;

  try {
    await asset.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update asset.",
      500
    );
    return next(error);
  }

  res.status(200).json({ asset: asset.toObject({ getters: true }) });
};

const deleteAsset = async (req, res, next) => {
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await deleteAssetCommon(req.params.id, req.userData.userId, sess);
    sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update asset.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted asset" });
};

const deleteAssets = async (req, res, next) => {
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    const deletedTransactions = req.body.ids.map(async (id) => {
      const transaction = await deleteAssetCommon(
        id,
        req.userData.userId,
        sess
      );
      return transaction;
    });

    await Promise.all(deletedTransactions);
    sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete asset.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted assets" });
};

const deleteAssetCommon = async (id, userId, sess) => {
  let asset;
  try {
    asset = await Asset.findById(id).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find asset by ID.",
      500
    );
    return error;
  }

  if (!asset) {
    const error = new HttpError("Could not find asset for this ID.", 404);
    return error;
  }

  if (asset.creator.id !== userId) {
    const error = new HttpError(
      "You are not allowed to delete this asset.",
      401
    );
    return error;
  }

  try {
    await asset.remove({ session: sess });
    asset.creator.assets.pull(asset);
    await asset.creator.save({ session: sess });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete asset.",
      500
    );
    return error;
  }
};

exports.getAsset = getAsset;
exports.getAssetById = getAssetById;
exports.addAsset = addAsset;
exports.updateAsset = updateAsset;
exports.deleteAsset = deleteAsset;
exports.deleteAssets = deleteAssets;