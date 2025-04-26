const homelist = function (req, res, next) {
  res.render("index", { title: "Home" });
};

const locationInfo = function (req, res, next) {
  res.render("index", { title: "Location info" });
};

const addReview = function (req, res, next) {
  res.render("index", { title: "Add review" });
};

module.exports = {
  homelist,
  locationInfo,
  addReview,
};
