import Property from "../model/properties.js";
import cloudinary from "cloudinary";
import { validationResult } from "express-validator";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a new property
export const createProperty = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { name, description, location, size, image_url, type, rentAmount, isRented } = req.body;

    const newProperty = new Property({
      name,
      description,
      location,
      size,
      image_url,
      type,
      rentAmount,
      isRented: isRented || false,
    });

    await newProperty.save();
    res.status(201).json({ message: "Property created successfully", data: newProperty });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upload an image
export const uploadImage = async (req, res) => {
  try {
    if (!req.files || !req.files.photo) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const file = req.files.photo.tempFilePath;
    const result = await cloudinary.uploader.upload(file, { folder: "properties" });

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// Get all properties with filters and pagination
export const getProperties = async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (type) filter.type = type;

    const properties = await Property.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Property.countDocuments(filter);

    res.status(200).json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get rented properties
export const getRentedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isRented: false });
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching rented properties:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get property by ID
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error("Error fetching property by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update property by ID  // 
export const updateProperty = async(req, res) => {
  try {
  const {id}= req.params;
  const updatedata = req.body;
  const updatedproperty = await Property.findByIdAndUpdate(id,updatedata,{new:true})
  } catch(error) {
    res.status(500).json({message:"server error"})
  }
}
// Delete property by ID
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
