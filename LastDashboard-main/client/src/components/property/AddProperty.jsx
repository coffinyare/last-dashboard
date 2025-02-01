import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Define validation schema using Yup
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name cannot exceed 20 characters long")
    .matches(/^[A-Za-z]/, "Name must start with a letter (A-Z or a-z)"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters long")
    .max(200, "Description cannot exceed 200 characters"),
  location: yup
    .string()
    .required("Location is required")
    .min(3, "Location must be at least 3 characters long")
    .max(100, "Location cannot exceed 100 characters"),
  size: yup
    .string()
    .required("Size is required")
    .matches(/^\d+\s?(sqft|sqm|acres)$/, "Size must be a number with formula"),
  rentAmount: yup
    .number()
    .required("Rent amount is required")
    .min(1, "Rent amount must be a positive number"),
  type: yup.string().required("Type is required"),
  imageFile: yup.mixed().required("Image is required"),
});

const AddPropertyModal = ({ isModalOpen, setIsModalOpen, refreshProperties }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setValue("imageFile", e.target.files[0]);
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      let imageUrl = "";
      if (formData.imageFile) {
        const imageData = new FormData();
        imageData.append("file", formData.imageFile);
        imageData.append("upload_preset", "ml_default");
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dezn9ks7m/image/upload",
          imageData
        );
        imageUrl = response.data.secure_url;
      }

      await axios.post("http://localhost:3000/api/property", {
        ...formData,
        image_url: imageUrl,
      });

      toast.success("Property registered successfully");
      setMessage("Property added successfully!");
      setIsModalOpen(false);
      refreshProperties();
    } catch (error) {
      console.error("Error registering property:", error);
      setMessage("Failed to add property.");
      toast.error("There was an error submitting the property. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 min-h-screen">
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-xl font-bold text-gray-200">Add New Property</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-300 text-xl font-bold"
            >
              &times;
            </button>
          </div>
    
          {message && <p className="text-red-500 mb-4">{message}</p>}
    
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Property Name</label>
                <input
                  type="text"
                  name="name"
                  {...register("name")}
                  className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
                  placeholder="Enter property name"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Description</label>
                <input
                  type="text"
                  name="description"
                  {...register("description")}
                  className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
                  placeholder="Enter property description"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Location</label>
                <input
                  type="text"
                  name="location"
                  {...register("location")}
                  className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
                  placeholder="Enter property location"
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Size</label>
                <input
                  type="text"
                  name="size"
                  {...register("size")}
                  className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
                  placeholder="Enter property size"
                />
                {errors.size && <p className="text-red-500 text-sm">{errors.size.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Type</label>
                <select
                  name="type"
                  {...register("type")}
                  className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
                >
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Commercial">Commercial</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Rent Amount</label>
                <input
                  type="number"
                  name="rentAmount"
                  {...register("rentAmount")}
                  className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
                  placeholder="Enter rent amount"
                />
                {errors.rentAmount && <p className="text-red-500 text-sm">{errors.rentAmount.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Upload Image</label>
                <input
                  type="file"
                  name="imageFile"
                  onChange={handleFileChange}
                  className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
                  accept="image/*"
                />
                {errors.imageFile && <p className="text-red-500 text-sm">{errors.imageFile.message}</p>}
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Adding Property..." : "Add Property"}
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default AddPropertyModal;
