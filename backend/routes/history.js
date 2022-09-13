const express = require("express");
const { getHistory, getHistoryForAWeek } = require("../controllers/history");
const checkAuth = require("../middleware/auth");

const router = express.Router();

router.use(checkAuth);

router.get("/", (req, res, next) => {
  getHistory(req, res, next);
});

router.get("/historyForAWeek", (req, res, next) => {
  getHistoryForAWeek(req, res, next);
});

module.exports = router;
