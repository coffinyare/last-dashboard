import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddPropertyModal from '../property/AddProperty';

const TableWithActions = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/properties');
      console.log("Fetched data:", response.data);
      setProperties(response.data.properties);  // Set the properties array
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  useEffect(() => {
    fetchProperties(); // Load properties when the component mounts
  }, []);

  const handleAddNew = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleEditClick = (property) => {
    navigate(`/EditProperty/${property._id}`);
  };

  const handleDelete = async (id) => {
    if (!id) return;

    const isConfirmed = window.confirm("Are you sure you want to delete this property?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/property/${id}`);
      alert('Property deleted successfully');
      fetchProperties(); // Refresh properties after deletion
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete the property.');
    }
  };

  const filteredProperties = Array.isArray(properties)
    ? properties.filter(property =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md max-w-7xl shadow-lg rounded-xl p-6 border border-gray-700 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-100">Property List</h2>
        <input
          type="text"
          placeholder="Search by name, location, type, or city"
          className="border px-4 py-2 rounded-md bg-gray-700 text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleAddNew}
        >
          Add New
        </button>
      </div>

      {filteredProperties.length === 0 ? (
        <p className="text-gray-500 text-center">No properties found.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Image</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Location</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">size</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredProperties.map((property) => (
              <tr key={property._id}>
                <td className="px-4 py-2">
                  <img
                    src={property.image_url}
                    alt={`${property.name} cover`}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2 text-gray-100">{property.name}</td>
                <td className="px-4 py-2 text-gray-100">{property.location}</td>
                <td className="px-4 py-2 text-gray-100">{property.size}</td>
                <td className="px-4 py-2 text-gray-100">{property.rent_type}</td>
                <td className="px-4 py-2 text-gray-100">{property.type}</td>
                <td className="px-4 py-2 text-gray-100">{property.city}</td>
                <td className="px-4 py-2">
                  {property.isRented ? (
                    <span className="text-red-500">Rented</span>
                  ) : (
                    <span className="text-green-500">Available</span>
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                    onClick={() => handleEditClick(property)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    onClick={() => handleDelete(property._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Property Modal */}
      <AddPropertyModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        refreshProperties={fetchProperties}  // Trigger a refresh after adding
      />
    </div>
  );
};

export default TableWithActions;
