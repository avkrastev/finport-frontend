const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Asset = require("../models/asset");
const User = require("../models/user");
const mongoose = require("mongoose");

const getAsset = async (req, res, next) => {
  let assets;

  try {
    assets = await Asset.find();
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
    asset = await Asset.findById(req.params.cid);
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

  const addNewAsset = new Asset({
    ...req.body.transaction,
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
    await user.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Adding new asset asset failed, try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ asset: addNewAsset });
};

const updateAsset = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Error!", 422));
  }

  const { name, sign, icon, amount } = req.body;

  let asset;
  try {
    asset = await Asset.findById(req.params.cid);
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

  if (name) asset.name = name;
  if (sign) asset.sign = sign;
  if (icon) asset.icon = icon;
  if (amount) asset.amount = amount;

  try {
    await asset.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update asset.",
      500
    );
    return next(error);
  }

  res.status(200).json({ asset: asset.toObject({ getter: true }) });
};

const deleteAsset = async (req, res, next) => {
  let asset;
  try {
    asset = await Asset.findById(req.params.cid).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find asset by ID.",
      500
    );
    return next(error);
  }

  if (!asset) {
    const error = new HttpError("Could not find asset for this ID.", 404);
    return next(error);
  }

  if (asset.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this asset.",
      401
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await asset.remove({ session: sess });
    asset.creator.assets.pull(asset);
    await asset.creator.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete asset.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted asset" });
};

exports.getAsset = getAsset;
exports.getAssetById = getAssetById;
exports.addAsset = addAsset;
exports.updateAsset = updateAsset;
exports.deleteAsset = deleteAsset;
