const express = require("express");
const router = express.Router();
const ctrlLocations = require("../controllers/locations");
const ctrlOthers = require("../controllers/others");

/* Location pages */
router.get("/", ctrlLocations.homelist);
router.get("/location/:id", ctrlLocations.locationInfo);
router.get("/location/:id/review/new", ctrlLocations.addReview);
router.post("/location/:id/review/new", ctrlLocations.postAddReview);

/* Other pages */
router.get("/about", ctrlOthers.about);

module.exports = router;
