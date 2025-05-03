const homelist = function (req, res, next) {
  res.render("locations-list", { title: "Home" });
};

const locationInfo = function (req, res, next) {
  res.render("location-info", { title: "Location info" });
};

const addReview = function (req, res, next) {
  res.render("location-review-form", { title: "Add review" });
};

module.exports = {
  homelist,
  locationInfo,
  addReview,
};
