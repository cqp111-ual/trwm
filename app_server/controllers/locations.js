const { request } = require('undici');
const { apiUrl } = require('../../config.js');

const homelist = async function (req, res, next) {
  try {
    const response = await request(`${apiUrl}/locations`);
    const { statusCode, body } = response;

    if (statusCode !== 200) {
      throw new Error(`API responded with status code ${statusCode}`);
    }

    const data = await body.json();

    const locations = data.data.map((loc) => ({
      id: loc._id,
      name: loc.name,
      address: loc.address,
      facilities: loc.facilities,
      rating: loc.rating,
      distance: '100m'
    }));

    res.render("locations-list", {
      title: "Home",
      locations: locations
    });
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.render("locations-list", {
      title: "Home",
      locations: [],
      error: "No se pudieron obtener los datos."
    });
  }
};

const locationInfo = async function (req, res, next) {
  const locationId = req.params.id;

  try {
    const response = await request(`${apiUrl}/locations/${locationId}`);
    const { statusCode, body } = response;

    if (statusCode !== 200) {
      throw new Error(`API responded with status code ${statusCode}`);
    }

    const data = await body.json();
    const location = data.data;

    res.render("location-info", {
      title: location.name,
      location
    });
  } catch (err) {
    console.error('Error fetching location:', err);
    res.render("location-info", {
      title: "Location info",
      location: null,
      error: "Location not found"
    });
  }
};

const addReview = function (req, res, next) {
  const locationId = req.params.id;
  res.render("location-review-form", { title: "Add review", locationId: locationId });
};


const postAddReview = async function (req, res, next) {
  const locationId = req.params.id;

  const newReview = {
    author: req.body.author,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.reviewText,
  };

  try {
    const response = await request(`${apiUrl}/locations/${locationId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    });

    const { statusCode, body } = response;
    const responseData = await body.json();

    if (statusCode === 201) {
      // Redirigir a la info de la location si todo va bien
      return res.redirect(`/location/${locationId}`);
    } else if (statusCode === 400 && responseData.message?.includes("validation failed")) {
      // Reenviar al formulario con mensaje de error
      res.render("location-review-form", {
        title: "Add review",
        error: "All fields required. Please try again.",
      });
    } else {
      throw new Error(`API error ${statusCode}: ${responseData.message}`);
    }
  } catch (err) {
    console.error("Error posting review:", err);
    res.render("location-review-form", {
      title: "Add review",
      error: "Something went wrong. Please try again later.",
    });
  }
};


module.exports = {
  homelist,
  locationInfo,
  addReview,
  postAddReview
};
