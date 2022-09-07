const express = require("express");
const {
  getAsset,
  getAssetById,
  addAsset,
  updateAsset,
  deleteAsset,
  deleteAssets,
  getCryptoAsset,
  getStockAsset,
  getETFAsset,
  getCommodityAsset,
  getMiscAsset,
  getP2PAsset
} = require("../controllers/asset");
const checkAuth = require("../middleware/auth");

const router = express.Router();

router.use(checkAuth);

router.get("/", (req, res, next) => {
  getAsset(req, res, next);
});

router.get("/crypto", (req, res, next) => {
  getCryptoAsset(req, res, next);
});

router.get("/stocks", (req, res, next) => {
  getStockAsset(req, res, next);
});

router.get("/etf", (req, res, next) => {
  getETFAsset(req, res, next);
});

router.get("/commodities", (req, res, next) => {
  getCommodityAsset(req, res, next);
});

router.get("/misc", (req, res, next) => {
  getMiscAsset(req, res, next);
});

router.get("/p2p", (req, res, next) => {
  getP2PAsset(req, res, next);
});

router.get("/:id", (req, res, next) => {
  getAssetById(req, res, next);
});

router.post("/", (req, res, next) => {
  addAsset(req, res, next);
});

router.patch("/:id", (req, res, next) => {
  updateAsset(req, res, next);
});

router.delete("/:id", (req, res, next) => {
  deleteAsset(req, res, next);
});

router.post("/deleteMany", (req, res, next) => {
  deleteAssets(req, res, next);
});

module.exports = router;
