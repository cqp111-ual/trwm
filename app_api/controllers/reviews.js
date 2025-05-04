const mongoose = require('mongoose');
const LocationModel = mongoose.model('Location');

const reviewsCreate = async (req, res) => {
  try {
    const { locationid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(locationid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid location ID format",
        data: null
      });
    }

    const location = await LocationModel.findById(locationid);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
        data: null
      });
    }

    const newReview = {
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    };

    location.reviews.push(newReview);
    const savedLocation = await location.save();
    await updateAverageRating(location._id);

    const thisReview = savedLocation.reviews[savedLocation.reviews.length - 1];

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: thisReview
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error adding review",
      data: err.message
    });
  }
};

const reviewsReadOne = async (req, res) => {
  try {
    const { locationid, reviewid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(locationid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid location ID format",
        data: null
      });
    }

    const location = await LocationModel.findById(locationid).select("name reviews");
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
        data: null
      });
    }

    const review = location.reviews.id(reviewid);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review retrieved successfully",
      data: {
        location: {
          name: location.name,
          id: locationid
        },
        review
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving review",
      data: err.message
    });
  }
};

const reviewsUpdateOne = async (req, res) => {
  try {
    const { locationid, reviewid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(locationid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid location ID format",
        data: null
      });
    }

    const location = await LocationModel.findById(locationid);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
        data: null
      });
    }

    const review = location.reviews.id(reviewid);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
        data: null
      });
    }

    review.author = req.body.author || review.author;
    review.rating = req.body.rating || review.rating;
    review.reviewText = req.body.reviewText || review.reviewText;

    await location.save();
    await updateAverageRating(location._id);

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error updating review",
      data: err.message
    });
  }
};

const reviewsDeleteOne = async (req, res) => {
  try {
    const { locationid, reviewid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(locationid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid location ID format",
        data: null
      });
    }

    const location = await LocationModel.findById(locationid);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
        data: null
      });
    }

    const review = location.reviews.id(reviewid);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
        data: null
      });
    }

    location.reviews.pull(reviewid);
    await location.save();
    await updateAverageRating(location._id);

    return res.status(204).send();

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error deleting review",
      data: err.message
    });
  }
};

const updateAverageRating = async (locationid) => {
  try {
    const location = await LocationModel.findById(locationid).select('rating reviews');
    if (location && location.reviews.length > 0) {
      const total = location.reviews.reduce((acc, r) => acc + r.rating, 0);
      const average = Math.round(total / location.reviews.length);
      location.rating = average;
      await location.save();
    }
  } catch (err) {
    console.error("Error updating average rating:", err.message);
  }
};

module.exports = {
  reviewsCreate,
  reviewsReadOne,
  reviewsUpdateOne,
  reviewsDeleteOne
};
