import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../common/Header";
export function EditProperty() {
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    location: "",
    size: "",
    imageUrl: "",
    type: "House",
  });
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch the property details and populate the form
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/api/property/${id}`)
        .then((response) => {
          const data = response.data;
          setFormState({
            name: data.name,
            description: data.description,
            location: data.location,
            size: data.size,
            imageUrl: data.image_url,
            type: data.type,
          });
        })
        .catch((error) => {
          console.error("Error fetching property:", error);
        });
    }
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dezn9ks7m/image/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formState.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }
      await axios.put(`http://localhost:3000/api/property/${id}`, {
        ...formState,
        size: formState.size,
        image_url: imageUrl,
      });
      alert("Property updated successfully");
      navigate("/property");
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Edit Property" />
      <section className="py-4 bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="relative max-w-6xl mx-auto">
            <div className="relative max-w-4xl mx-auto mt-4 bg-gray-800 rounded-md shadow-md p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[{
                      label: "Name",
                      name: "name",
                      type: "text",
                      placeholder: "Property name",
                    },
                    {
                      label: "Description",
                      name: "description",
                      type: "text",
                      placeholder: "Property description",
                    },
                    {
                      label: "Location",
                      name: "location",
                      type: "text",
                      placeholder: "Property location",
                    },
                    {
                      label: "Size",
                      name: "size",
                      type: "text",
                      placeholder: "Size",
                    }
                  ].map(({ label, name, type, placeholder }) => (
                    <div key={name} className="col-span-1">
                      <label className="text-sm font-medium text-gray-400 mb-2 block">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={formState[name]}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  ))}

                  {/* Type Select Field */}
                  <div className="col-span-1">
                    <label className="text-sm font-medium text-gray-400 mb-2 block">
                      Type
                    </label>
                    <select
                      name="type"
                      value={formState.type}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>

                  {/* Image File Input */}
                  <div className="col-span-1">
                    <label className="text-sm font-medium text-gray-400 mb-2 block">
                      Update Image
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EditProperty;
