const express = require("express");
const {
  getAsset,
  getAssetById,
  addAsset,
  updateAsset,
  deleteAsset,
} = require("../controllers/asset");
const checkAuth = require("../middleware/auth");

const router = express.Router();

router.use(checkAuth);

router.get("/", (req, res, next) => {
  getAsset(req, res, next);
});

router.get("/:cid", (req, res, next) => {
  getAssetById(req, res, next);
});

router.post("/", (req, res, next) => {
  addAsset(req, res, next);
});

router.patch("/:cid", (req, res, next) => {
  updateAsset(req, res, next);
});

router.delete("/:cid", (req, res, next) => {
  deleteAsset(req, res, next);
});

module.exports = router;
