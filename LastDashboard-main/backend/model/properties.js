import mongoose from "mongoose";

// Property schema definition
const propertySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"], 
      trim: true, 
      minlength: [3, "Name must be at least 3 characters long"], 
      maxlength: [20, "Name cannot exceed 20 characters"],
      match: [/^[A-Za-z]/, "Name must start with a letter (A-Z or a-z)"] // Regex to ensure the name starts with a letter
    },
    description: { 
      type: String, 
      required: [true, "Description is required"], 
      trim: true, 
      minlength: [1, "Description must be at least 10 characters long"], 
      maxlength: [200, "Description cannot exceed 20 characters"] 
    },
    location: { 
      type: String, 
      required: [true, "Location is required"], 
      trim: true, 
      minlength: [5, "Location must be at least 5 characters long"], 
      maxlength: [200, "Location cannot exceed 200 characters"] 
    },
    size: { 
      type: String, 
      required: [true, "Size is required"], 
      trim: true, 
      validate: {
        validator: function (value) {
          const regex = /^\d+\s?(sqft|sqm|acres)$/;
          if (!regex.test(value)) return false;

          // Extract the number part and check if it's positive
          const number = parseInt(value.match(/^\d+/)[0], 10);
          return number > 0;
        },
        message: "Size must be a positive number followed by a valid unit (e.g., '1000 sqft', '500 sqm', or '2 acres')",
      },
    },
    image_url: { 
      type: String, 
      required: [true, "Image URL is required"], 
      trim: true, 
      match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, "Please provide a valid URL"] 
    },
    type: { 
      type: String, 
      required: [true, "Type is required"], 
      enum: { 
        values: ['House', 'Apartment', 'Commercial'], 
        message: "Type must be either 'House', 'Apartment', or 'Commercial'" 
      } 
    },
    rentAmount: { 
      type: Number, 
      required: [true, "Rent amount is required"], 
      min: [0, "Rent amount cannot be negative"] 
    },
    isRented: { 
      type: Boolean, 
      default: false 
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Property = mongoose.model("Property", propertySchema);
export default Property;
