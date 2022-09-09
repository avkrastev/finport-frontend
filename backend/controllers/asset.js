const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Asset = require("../models/asset");
const P2p = require("../models/p2p");
const User = require("../models/user");
const mongoose = require("mongoose");
const url = require("url");
const {
  exchangeRatesBaseUSD,
  roundNumber,
  sumsInSupportedCurrencies,
} = require("../utils/functions");
const fns = require("date-fns");
const DataBuilder = require("../models/data-builder");
const CryptoAssetStats = require("../models/stats/crypto");
const StocksAssetStats = require("../models/stats/stocks");
const ETFAssetStats = require("../models/stats/etf");
const CommoditiesAssetStats = require("../models/stats/commodities");
const MiscAssetStats = require("../models/stats/misc");
const { CATEGORIES } = require("../utils/categories");
const P2PAssetStats = require("../models/stats/p2p");
const { ObjectId, ConnectionClosedEvent } = require("mongodb");

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

const getCryptoAsset = async (req, res, next) => {
  const creator = req.userData.userId;

  try {
    const dataBuilder = new DataBuilder("crypto", creator);
    const sumsResult = await Asset.aggregate(
      dataBuilder.getTotalSumByCategoryPipeline()
    ).exec();

    const statsResults = await Asset.aggregate(
      dataBuilder.getTotalSumsByCategoryAndAssetPipeline()
    ).exec();

    const cryptoAssetStats = new CryptoAssetStats(statsResults, sumsResult);
    const assets = await cryptoAssetStats.getAllData();

    assets.sums.sumsInDifferentCurrencies = await sumsInSupportedCurrencies(
      assets.sums.holdingValue,
      assets.sums.totalSum
    );

    res.json({ assets });
  } catch (err) {
    const error = new HttpError("Something went wrong!", 500);
    return next(error);
  }
};

const getStockAsset = async (req, res, next) => {
  const creator = req.userData.userId;

  try {
    const dataBuilder = new DataBuilder("stocks", creator);
    const sumsResult = await Asset.aggregate(
      dataBuilder.getTotalSumByCategoryPipeline()
    ).exec();

    const statsResults = await Asset.aggregate(
      dataBuilder.getTotalSumsByCategoryAndAssetPipeline()
    ).exec();

    const stocksAssetStats = new StocksAssetStats(statsResults, sumsResult);
    const assets = await stocksAssetStats.getAllData();

    assets.sums.sumsInDifferentCurrencies = await sumsInSupportedCurrencies(
      assets.sums.holdingValue,
      assets.sums.totalSum
    );

    res.json({ assets });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong!", 500);
    return next(error);
  }
};

const getETFAsset = async (req, res, next) => {
  const creator = req.userData.userId;

  try {
    const dataBuilder = new DataBuilder("etf", creator);
    const sumsResult = await Asset.aggregate(
      dataBuilder.getTotalSumByCategoryPipeline()
    ).exec();

    const statsResults = await Asset.aggregate(
      dataBuilder.getTotalSumsByCategoryAndAssetPipeline()
    ).exec();

    const ETFsAssetStats = new ETFAssetStats(statsResults, sumsResult);
    const assets = await ETFsAssetStats.getAllData();

    assets.sums.sumsInDifferentCurrencies = await sumsInSupportedCurrencies(
      assets.sums.holdingValue,
      assets.sums.totalSum
    );

    res.json({ assets });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong!", 500);
    return next(error);
  }
};

const getCommodityAsset = async (req, res, next) => {
  const creator = req.userData.userId;

  try {
    const dataBuilder = new DataBuilder("commodities", creator);
    const sumsResult = await Asset.aggregate(
      dataBuilder.getTotalSumByCategoryPipeline()
    ).exec();

    const statsResults = await Asset.aggregate(
      dataBuilder.getTotalSumsByCategoryAndAssetPipeline()
    ).exec();

    const commoditiesAssetStats = new CommoditiesAssetStats(
      statsResults,
      sumsResult
    );
    const assets = await commoditiesAssetStats.getAllData();

    assets.sums.sumsInDifferentCurrencies = await sumsInSupportedCurrencies(
      assets.sums.holdingValue,
      assets.sums.totalSum
    );

    res.json({ assets });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong!", 500);
    return next(error);
  }
};

const getMiscAsset = async (req, res, next) => {
  const creator = req.userData.userId;

  try {
    const dataBuilder = new DataBuilder("misc", creator);
    const sumsResult = await Asset.aggregate(
      dataBuilder.getTotalSumByCategoryPipeline()
    ).exec();

    const statsResults = await Asset.aggregate(
      dataBuilder.getTotalSumsByCategoryAndAssetPipeline()
    ).exec();

    const miscAssetStats = new MiscAssetStats(statsResults, sumsResult);
    const assets = await miscAssetStats.getAllData();

    assets.sums.sumsInDifferentCurrencies = await sumsInSupportedCurrencies(
      assets.sums.holdingValue,
      assets.sums.totalSum
    );

    res.json({ assets });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong!", 500);
    return next(error);
  }
};

const getP2PAsset = async (req, res, next) => {
  const creator = req.userData.userId;

  try {
    const dataBuilder = new DataBuilder("p2p", creator);
    const sumsResult = await Asset.aggregate(
      dataBuilder.getTotalSumByCategoryPipeline()
    ).exec();

    const statsResults = await Asset.aggregate(
      dataBuilder.getTotalSumsByCategoryAndAssetPipeline()
    ).exec();

    const test = await Asset.aggregate([
      {
        $match: {
          category: "p2p",
          creator: new ObjectId(creator),
        },
      },
      {
        $lookup: {
          from: "p2ps",
          localField: "name",
          foreignField: "name",
          as: "percentages",
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]).exec();

    const percentages = await P2p.find({ creator });

    const result = test.reduce(function (r, a) {
      r[a.name] = r[a.name] || [];
      r[a.name].push(a);
      return r;
    }, Object.create(null));

    let dada = [];
    for (let item in result) {
      let amount = result[item][0].price;
      let sum = {};
      sum.name = item;
      sum.interest = 0;
      for (let j in result[item]) {
        amount += result[item][j].price;
        if (amount <= 0) {
          const endDate = new Date(result[item][0].date);
          result[item][j].time = monthDiffFromToday(
            result[item][j].date,
            endDate
          );
          result[item][j].interest = compoundInterest(
            result[item][j].price,
            result[item][j].percentages[0].apr,
            result[item][j].time
          );
        } else {
          result[item][j].time = monthDiffFromToday(result[item][j].date);
          result[item][j].interest = compoundInterest(
            result[item][j].price,
            result[item][j].percentages[0].apr,
            result[item][j].time
          );
        }
        sum.interest += result[item][j].interest;
      }
      dada.push(sum);
    }

    console.log(dada);

    const p2pAssetStats = new P2PAssetStats(
      statsResults,
      sumsResult,
      percentages
    );
    const assets = await p2pAssetStats.getAllData();

    assets.sums.sumsInDifferentCurrencies = await sumsInSupportedCurrencies(
      assets.sums.holdingValue,
      assets.sums.totalSum
    );

    assets.percentages = percentages;

    res.json({ assets });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong!", 500);
    return next(error);
  }
};

const monthDiffFromToday = (date, date2 = new Date()) => {
  let months;
  date = new Date(date);
  months = (date2.getFullYear() - date.getFullYear()) * 12;
  months -= date.getMonth();
  months += date2.getMonth();

  const result = months <= 0 ? 0 : months;
  return result / 12;
};

const compoundInterest = (principal, rate, time) => {
  const r = rate / 100;
  const a = principal * Math.pow(1 + r / 12, 12 * time);
  return a - principal;
};

const getAssetsSummary = async (req, res, next) => {
  const creator = req.userData.userId;

  try {
    const dataBuilder = new DataBuilder("", creator);
    const sumsResult = await Asset.aggregate(
      dataBuilder.getTotalSumPipeline()
    ).exec();

    const statsResults = await Asset.aggregate(
      dataBuilder.getTotalSumsByCategorySortedPipeline()
    ).exec();

    let sumsSummary = [];
    for (let asset of statsResults) {
      let formattedSummary = {};
      const category = CATEGORIES.find(
        (category) => category.alias === asset._id.category
      );
      formattedSummary.name = category.name;
      formattedSummary.alias = category.alias;
      formattedSummary.holdingValue = asset.totalSum;
      sumsSummary.push(formattedSummary);
    }

    //console.log(statsResults)
    // const miscAssetStats = new MiscAssetStats(statsResults, sumsResult);
    // const assets = await miscAssetStats.getAllData();

    const sumsInDifferentCurrencies = await sumsInSupportedCurrencies(
      sumsResult[0].totalSum,
      sumsResult[0].totalSum
    );

    res.json({
      assets: {
        sums: {
          totalSum: sumsResult[0].totalSum,
          holdingValue: sumsResult[0].totalSum,
          sumsInDifferentCurrencies,
        },
        stats: sumsSummary,
      },
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong!", 500);
    return next(error);
  }
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

  const priceInUsd = await exchangeRatesBaseUSD(
    req.body.transaction.price,
    req.body.transaction.currency,
    fns.format(new Date(req.body.transaction.date), "yyyy-MM-dd")
  );

  let quantity = req.body.transaction.quantity;
  let price = req.body.transaction.price;
  let price_usd = roundNumber(priceInUsd);
  // TODO create global constants for types
  if (req.body.transaction.type === 1 || req.body.transaction.type === 3) {
    quantity = -Math.abs(quantity);
    price = -Math.abs(price);
    price_usd = -Math.abs(price_usd);
  }

  const addNewAsset = new Asset({
    ...req.body.transaction,
    quantity,
    price,
    price_usd,
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
    const priceInUsd = await exchangeRatesBaseUSD(
      asset.price,
      asset.currency,
      fns.format(new Date(asset.date), "yyyy-MM-dd")
    );
    asset.price_usd = priceInUsd;
  }
  if (quantity) asset.quantity = quantity;
  if (date) {
    const priceInUsd = await exchangeRatesBaseUSD(
      asset.price,
      asset.currency,
      fns.format(new Date(date), "yyyy-MM-dd")
    );
    asset.price_usd = priceInUsd;
    asset.date = new Date(date).toISOString();
  }
  if (type !== asset.type) {
    const priceInUsd = await exchangeRatesBaseUSD(
      asset.price,
      asset.currency,
      fns.format(new Date(asset.date), "yyyy-MM-dd")
    );
    if (type === 1 || type === 3) {
      asset.quantity = -Math.abs(quantity);
      asset.price = -Math.abs(price);
      asset.price_usd = -Math.abs(priceInUsd);
    } else {
      asset.quantity = Math.abs(quantity);
      asset.price = Math.abs(price);
      asset.price_usd = Math.abs(priceInUsd);
    }
    asset.type = type;
  }

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
exports.getCryptoAsset = getCryptoAsset;
exports.getStockAsset = getStockAsset;
exports.getETFAsset = getETFAsset;
exports.getCommodityAsset = getCommodityAsset;
exports.getMiscAsset = getMiscAsset;
exports.getP2PAsset = getP2PAsset;
exports.getAssetsSummary = getAssetsSummary;
