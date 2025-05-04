const mongoose = require('mongoose');
const LocationModel = mongoose.model('Location');

const locationsReadAll = async (req, res) => {
  try {
    const locations = await LocationModel.find({});
    if (!locations || locations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Locations not found",
        data: null 
      });
    }
    return res.status(200).json({
      success: true,
      message: "Locations retrieved successfully",
      data: locations
    });
  } catch (err) {
      return res.status(500).json({
        success: false, 
        message: "Error retrieving locations", 
        data: err.message 
      });
  }
};

const locationsReadOne = async (req, res) => {
  try {
    const locationid = req.params.locationid;

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
    return res.status(200).json({
      success: true,
      message: "Location found",
      data: location
    });
  } catch (err) {
      return res.status(500).json({
        success: false, 
        message: "Error retrieving location", 
        data: err.message 
      });
  }
};

const locationsCreate = async (req, res) => {
  try {
    const { name, address, facilities, distance, coords, openingTimes, reviews } = req.body;

    // Evitamos que se creen locations con reviews desde el inicio
    if (reviews) {
      return res.status(400).json({
        success: false,
        message: "Reviews cannot be added during location creation",
        data: null
      });
    }

    const location = new LocationModel({
      name,
      address,
      facilities,
      distance,
      coords: {
        type: 'Point',
        coordinates: coords
      },
      openingTimes
    });

    const savedLocation = await location.save(); // Aquí se dispara la validación automática

    return res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: savedLocation
    });

  } catch (err) {
    // console.error(err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        data: err
      });
    }

    // console.error("Error creating location:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: err
    });
  }
};

const locationsDeleteOne = async (req, res) => {
  try {
    const locationid = req.params.locationid;

    if (!mongoose.Types.ObjectId.isValid(locationid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid location ID format",
        data: null
      });
    }

    const location = await LocationModel.findByIdAndDelete(locationid);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
        data: null
      });
    }
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error deleting location",
      data: err.message
    });
  }
};

const locationsUpdateOne = async (req, res) => {
  try {
    const locationid = req.params.locationid;

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

    // Actualizar los campos de la ubicación
    location.name = req.body.name || location.name;
    location.address = req.body.address || location.address;
    location.facilities = req.body.facilities || location.facilities;
    location.coords = req.body.coords || location.coords;
    location.openingTimes = req.body.openingTimes || location.openingTimes;
    location.reviews = req.body.reviews || location.reviews;

    const updatedLocation = await location.save();

    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
      data: updatedLocation
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error updating location",
      data: err.message
    });
  }
};

module.exports = {
  locationsReadAll,
  locationsReadOne,
  locationsCreate,
  locationsDeleteOne,
  locationsUpdateOne
};