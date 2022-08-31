const express = require("express");
const {
  getAsset,
  getAssetById,
  addAsset,
  updateAsset,
  deleteAsset,
  deleteAssets,
  getCryptoAsset,
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

router.get("/crypto", (req, res, next) => {
  getCryptoAsset(req, res, next);
});

module.exports = router;
